import { Game } from '../gameLogic/backgammon';
import {
  BOT_NAMES,
  GAME_TYPE,
  PLAYER_COLORS,
} from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { DoubleDice } from '../gameLogic/doubleDice';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import endGame, { sendTurn, saveGameStats } from '../service/gameService';
import { useGameState } from '../hooks/GameStateContext';
import { useGameLogicComputer } from './useGameLogicComputer';
import { getOnlineDice, transformOnlineDice, pause, transformLocalTurnToOnlineTurn, transformOnlineTurnToLocalTurn, getLatestOnlineTurn} from '../gameLogic/gameUtils';
import { useState, useEffect, useRef, useReducer } from 'react';
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameTurns } from './useGameLogicTurns';
import { useGameHelper } from './useGameLogicHelper';
import { useGameSetup } from './useGameSetUp';
import { useGameLogicOnline } from './useGameLogicOnline';
import { PlacementConstraint } from 'aws-cdk-lib/aws-ecs';

const client = generateClient<Schema>();

type OnlineTurn = Schema['Turns']['type'];

export const useGameLogic = (
) => {
  // #region State Management

  const runGame = () => {
    if (!gamemode || !game) return;
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        break;
      case GAME_TYPE.COMPUTER:
        runBot()
        break;
      case GAME_TYPE.RANDOM:
        runOnline();
        break;
      case GAME_TYPE.FRIENDLIST:
        // Initialize game with friends logic here
        break;
      case GAME_TYPE.ELO:
        // Initialize Elo ranked game logic here
        break;
      default:
        break;
    }
  };

  const switchplayer = async () => {
    if (
      game &&
      !game.isGameOver() &&
      isOfflineGame()
    ) {
      game.switchPlayer();
      forceRender()
      if (disableScreen) {
        setDisableScreen(false);
      }
      const didswitch = await checkForLegalMove(false);
      if (
        game.getCurrentPlayer() === PLAYER_COLORS.BLACK &&
        gamemode === GAME_TYPE.COMPUTER &&
        !didswitch
      ) {
        runGame()
      }
    } else if (
      game &&
      !game.isGameOver() &&
      isOnlineGame() &&
      whoAmI === game.getCurrentPlayer()
    ) {
      setWaitingOnLocalPlayer(false)
      const turn = game.getTurnAfterMove();
      const newOnlineDice = await sendTurnToServer(turn);
      const newLocalDice = transformOnlineDice(newOnlineDice);
      game.onlineSwitchPlayer(newLocalDice);
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
      const copyGame = game.deepCopy()
      setGame(copyGame)
    } else if (
      game &&
      !game.isGameOver() &&
      isOnlineGame() &&
      whoAmI !== game.getCurrentPlayer() &&
      onlineTurns
    ) {
      const newdice = getOnlineDice(onlineTurns);
      forceRender()
      game.onlineSwitchPlayer(newdice);
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
      await checkForLegalMove(false, game);
    }
  };

  const { 
    isStartingPhase,
    setStartingPhase, 
    firstRoll,
    setFirstRoll, 
    disableScreen, 
    setDisableScreen, 
    isLoadingGame, 
    setIsLoadingGame, 
    setGameIsRunning, 
    game, 
    setGame,
    positions,
    setPositions,
    doubleDice,
    setDoubleDice,
    gamemode,
    gameOver,
    setGameOver,
    boardRef,
    onlineTurns,
    setOnlineTurns,
    gameId,
    localPlayerId,
    setDoubleAlertVisible,
    setIsWaitingForDouble,
    setShowWaitingDouble,
    opponentPlayerId,
    setOpponentPlayerId,
    whoAmI,
    setWhoAmI,
    waitingOnLocalPlayer,
    setWaitingOnLocalPlayer,
    } = useGameState()

  const {
    isOnlineGame, 
    isOfflineGame, 
    handleDisableScreen,
    legalMovesFrom,
    CHECKS
  } = useGameHelper()

  const {forceRenderReducer, updateGameState, checkForLegalMove,updateMoveIsOver,isGameOver} = useStateManagement(switchplayer)
  const {double,giveUp,makeTurn,updatePositionHandler,undoMove,onMoveChecker,} = useGameTurns(updateGameState,updateMoveIsOver,isGameOver)
  const {sendTurnToServer,sendFinalGameStateToServer,runOnline} = useGameLogicOnline(makeTurn,double)

  const [ignored, forceRender] = useReducer(forceRenderReducer, 0);

  const { runBot } = useGameLogicComputer(game,makeTurn)

  const {
    startGame,
    resetGame,
    setUpGame,
    loadGame,
  } = useGameSetup(runGame,makeTurn,forceRenderReducer,checkForLegalMove)
  // #endregion

  const getWhoAmI = async () => {
    const { data: session, errors } = await client.models.Session.get({
      id: gameId,
    });
    if (session === null || session === undefined) {
      setWhoAmI(PLAYER_COLORS.NAP);
      return
    }
    if (session.playerOneID === localPlayerId) {
      setOpponentPlayerId(
        session.playerTwoID === null ? '' : session.playerTwoID
      );
      setWhoAmI(PLAYER_COLORS.WHITE)
      forceRender()
      return
    } else {
      setOpponentPlayerId(
        session.playerOneID === null ? '' : session.playerOneID
      );
      setWhoAmI(PLAYER_COLORS.BLACK)
      forceRender()
      return
    }
  };

  // #region Effects
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
  }, [,gameId]);

  useEffect(() => {
    getWhoAmI()
  },[,gameId])

  useEffect(() => {
    if (CHECKS.READY_START_OFFLINE()) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game]);
  useEffect(() => {
    if (CHECKS.READY_START_ONLINE()) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game, onlineTurns]);
  //Case game just needs to load:
  useEffect(() => {
    if (CHECKS.READY_LOAD_ONLINE_GAME()) {
      setGameIsRunning(true);
      setIsLoadingGame(true);
      setStartingPhase(false);
      setFirstRoll(false);
      loadGame();
    }
  }, [gamemode, game, onlineTurns]);
  useEffect(() => {
    if (CHECKS.READY_RUN_ONLINE()) {
      runOnline();
    }
  }, [onlineTurns]);

  useEffect(() => {
    if (CHECKS.READY_SET_LOADED_GAME()) {
      updatePositionHandler(0, 0, 'DISTRIBUTE');
      setIsLoadingGame(false);
    }
  }, [isLoadingGame]);
  // #endregion

  return {
    game,
    positions,
    boardRef,
    onMoveChecker,
    startGame,
    updateMoveIsOver,
    undoMove,
    legalMovesFrom,
    giveUp,
    isStartingPhase,
    firstRoll,
    disableScreen,
    gameOver,
    setGameOver,
    doubleDice,
    double,
    resetGame,
    onlineTurns,
    sendTurnToServer,
    isOfflineGame,
    sendFinalGameStateToServer,
    opponentPlayerId,
    isOnlineGame,
    handleDisableScreen,
    isLoadingGame,
  };
};
