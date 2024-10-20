import { useState, useEffect } from 'react';
import { Game } from '../gameLogic/backgammon'; // Assuming this contains core Backgammon logi
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { PLAYER_COLORS } from '../utils/constants';
import { transformLocalTurnToOnlineTurn, transformOnlineTurnToLocalTurn } from '../gameLogic/gameUtils'
import { useGameState } from './GameStateContext';
import { getLatestOnlineTurn } from '../gameLogic/gameUtils';
import { Turn } from '../gameLogic/turn';
import endGame, { saveGameStats, sendTurn } from '../service/gameService';
import { useGameTurns } from './useGameLogicTurns';
import { useStateManagement } from './useGameLogicStateManagement';

const client = generateClient<Schema>();

type OnlineTurn = Schema['Turns']['type'];

type SendableTurn = {
  gameId: string;
  playerId: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};

type OnlineDice = Schema['Dice']['type'];

export const useGameLogicOnline = (
  makeTurn: (turn: Turn, quickTurn?: boolean, game?: Game) => Promise<Game | undefined>,
  gameId:string,
  setDoubleAlertVisible:React.Dispatch<React.SetStateAction<boolean>>,
  setIsWaitingForDouble: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWaitingDouble:React.Dispatch<React.SetStateAction<boolean>>
) => {

  const {
    localPlayerId,
    setOpponentPlayerId,
    doubleDice,
    gamemode,
    game,
    setGameOver,
    isWaitingForDouble,
    setOnlineTurns,
    onlineTurns,
  } = useGameState()

  const {double} = useGameTurns()

  useEffect(() => {
    if (gameId !== undefined && gameId !== null) {
      const sub = client.models.Turns.observeQuery({
        filter: { gameId: { eq: gameId } },
      }).subscribe({
        next: ({ items, isSynced }) => {
          setOnlineTurns([...items]);
        },
      });

      return () => sub.unsubscribe();
    }
  }, []);

  const runOnline = async () => {
    const latestTurn = getLatestOnlineTurn(onlineTurns!)
    if (localPlayerId === latestTurn?.playerId) {
      return;
    }
    if (latestTurn?.type === 'MOVE' && localPlayerId !== latestTurn?.playerId) {
      const localTurn = transformOnlineTurnToLocalTurn(latestTurn!);
      makeTurn(localTurn);
    } else if (
      latestTurn?.type === 'DOUBLE' &&
      localPlayerId !== latestTurn?.playerId
    ) {
      if (!isWaitingForDouble) {
        setDoubleAlertVisible(true);
      } else {
        setIsWaitingForDouble(false);
        setShowWaitingDouble(false);
        double();
      }
    } else if (
      latestTurn?.type === 'GIVE_UP' &&
      localPlayerId !== latestTurn?.playerId
    ) {
      setIsWaitingForDouble(false);
      setShowWaitingDouble(false)
      setGameOver({ gameover: true, winner: localPlayerId, reason: 'GIVE_UP' });
    }
  };

  const getWhoAmI = async () => {
    const { data: session, errors } = await client.models.Session.get({
      id: gameId,
    });
    if (session === null || session === undefined) {
      return PLAYER_COLORS.NAP;
    }
    if (session.playerOneID === localPlayerId) {
      setOpponentPlayerId(
        session.playerTwoID === null ? '' : session.playerTwoID
      );
      return PLAYER_COLORS.WHITE;
    } else {
      setOpponentPlayerId(
        session.playerOneID === null ? '' : session.playerOneID
      );
      return PLAYER_COLORS.BLACK;
    }
  };
  const sendTurnToServer = async (
    turn: Turn,
    turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT'
  ): Promise<OnlineDice> => {
    if (!turn.hasMoves && turnType === undefined)
      return { dieOne: 0, dieTwo: 0 };
    const turnToSend: SendableTurn = transformLocalTurnToOnlineTurn(
      turn,
      gameId,
      localPlayerId,
      turnType
    );
    const nextDice: OnlineDice | null | undefined = await sendTurn(turnToSend);
    if (nextDice === null || nextDice === undefined) {
      return { dieOne: 0, dieTwo: 0 };
    } else {
      return nextDice;
    }
  };
  const sendFinalGameStateToServer = async (
    winnerId: string,
    loserId: string,
    reason: 'GIVE_UP' | 'DOUBLE' | 'TIMEOUT' | 'GAME_OVER'
  ) => {
    if (game) {
      const distWhite = game.getDistances().distWhite;
      const distBlack = game.getDistances().distBlack;
      const doubleDiceValue = doubleDice.getMultiplicator();
      saveGameStats(
        gameId,
        winnerId,
        loserId,
        gamemode!,
        0,
        0,
        1,
        { white: distWhite, black: distBlack },
        doubleDiceValue,
        reason
      );
      endGame(gameId);
    }
  };
  return {
    getWhoAmI,
    sendTurnToServer,
    sendFinalGameStateToServer,
    runOnline,
  };
};
