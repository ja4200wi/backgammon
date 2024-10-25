import { useState, useEffect, useRef, useReducer } from 'react';
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
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameTurns } from './useGameLogicTurns';
import { useGameHelper } from './useGameLogicHelper';
import { useGameSetup } from './useGameSetUp';
import { useGameLogicOnline } from './useGameLogicOnline';

const client = generateClient<Schema>();

type OnlineTurn = Schema['Turns']['type'];

type SendableTurn = {
  gameId: string;
  playerId: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};

type OnlineDice = Schema['Dice']['type'];

interface GameScrProps {
  navigation: any;
  route: any;
}

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

  const [whoAmI, setWhoAmI] = useState<PLAYER_COLORS>();

  const { 
    isStartingPhase,
    setStartingPhase, 
    firstRoll,
    setFirstRoll, 
    disableScreen, 
    setDisableScreen, 
    isLoadingGame, 
    setIsLoadingGame, 
    gameIsRunning, 
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
    isWaitingForDouble,
    setIsWaitingForDouble,
    setShowWaitingDouble,
    opponentPlayerId,
    setOpponentPlayerId,
    } = useGameState()

    const {isOnlineGame, isOfflineGame, handleDisableScreen,legalMovesFrom} = useGameHelper()

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
  
  const {startGame,resetGame,doStartingPhase} = useGameSetup(getWhoAmI,runGame,gameId,localPlayerId)


  const {forceRenderReducer, updateGameState, checkForLegalMove,updateMoveIsOver,isGameOver} = useStateManagement(switchplayer)
  const {double,giveUp,makeTurn,updatePositionHandler,undoMove,onMoveChecker,} = useGameTurns(updateGameState,updateMoveIsOver,isGameOver)
  const {sendTurnToServer,sendFinalGameStateToServer,runOnline} = useGameLogicOnline(makeTurn,double)

const [ignored, forceRender] = useReducer(forceRenderReducer, 0);

  const { runBot } = useGameLogicComputer(game,makeTurn)

  // #endregion

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
    console.log('isloadingGame',isLoadingGame)
  },[isLoadingGame])
  useEffect(() => {
    if (
      (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY) &&
      game &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game]);
  useEffect(() => {
    if (
      isOnlineGame() &&
      game &&
      onlineTurns &&
      onlineTurns.length === 1 &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game, onlineTurns]);
  //Case game just needs to load:
  useEffect(() => {
    if (
      isOnlineGame() &&
      game &&
      onlineTurns &&
      onlineTurns.length > 1 &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setIsLoadingGame(true);
      setStartingPhase(false);
      setFirstRoll(false);
      loadGame();
    }
  }, [gamemode, game, onlineTurns]);
  useEffect(() => {
    if (onlineTurns && onlineTurns.length > 0 && !isLoadingGame) {
      runOnline();
    }
  }, [onlineTurns]);

  useEffect(() => {
    if (!isLoadingGame && !isStartingPhase) {
      updatePositionHandler(0, 0, 'DISTRIBUTE');
      setIsLoadingGame(false);
    }
  }, [isLoadingGame]);
  // #endregion

  // #region Game Actions
  
  const loadGame = async () => {
    if (game) {
      if (isOnlineGame() && onlineTurns) {
        const startingDice = getOnlineDice(onlineTurns, 0);
        const iAm = await getWhoAmI();
        setWhoAmI(iAm);
        const copyOnlineTurns = [...onlineTurns]; // Create a copy of the onlineTurns array
        await processTurn(copyOnlineTurns, game, iAm, startingDice);
        await pause(1000);
      }
    }
  };
  
  const processTurn = async (
    copyOnlineTurns: OnlineTurn[],
    game: Game,
    iAm: PLAYER_COLORS,
    startingDice: [number, number]
  ) => {
    let hasDoubled = false;
    let tempDoubleDice = new DoubleDice();
    let currentGame: Game | undefined = game;

    while (copyOnlineTurns.length > 0) {
      const tempOnlineTurn = copyOnlineTurns.shift();

      if (!tempOnlineTurn) continue;
      const tempLocalTurn = transformOnlineTurnToLocalTurn(tempOnlineTurn);

      const nextMoveDice = transformOnlineDice(tempOnlineTurn.diceForNextTurn!); // Use the remaining moves for the next dice roll
      if (tempOnlineTurn.type === 'MOVE') {
        currentGame = await makeTurn(tempLocalTurn, true, currentGame);
        if (currentGame) {
          currentGame.onlineSwitchPlayer(nextMoveDice);
          forceRender()
        }
      } else if (tempOnlineTurn.type === 'DOUBLE'&& currentGame) {
        if (hasDoubled) {
          tempDoubleDice = currentGame.double();
          hasDoubled = false;
        } else {
          if (
            copyOnlineTurns.length === 0 &&
            localPlayerId !== tempOnlineTurn.playerId
          ) {
            setIsLoadingGame(false);
            setDoubleAlertVisible(true);
          } else if(copyOnlineTurns.length === 0 && localPlayerId === tempOnlineTurn.playerId) {
            setIsLoadingGame(false)
            setIsWaitingForDouble(true)
            setShowWaitingDouble(true)
            forceRender()
          } else {
            hasDoubled = true;
          }
        }
      } else if (tempOnlineTurn.type === 'GIVE_UP') {
        if (localPlayerId !== tempOnlineTurn.playerId) {
          setIsLoadingGame(false)
          setTimeout(() => {
            setGameOver({ gameover: true, winner: localPlayerId, reason: 'GIVE_UP' });
          }, 100);
          return
        } else {
          setIsLoadingGame(false)
          setTimeout(() => {
            setGameOver({ gameover: true, winner: opponentPlayerId, reason: 'GIVE_UP' });
          }, 100);
          return
        }
      }
    }
    // After all turns are processed
    const copyOfGame = currentGame!.deepCopy();
    setGame(copyOfGame);
    setDoubleDice(tempDoubleDice);
    setPositions(copyOfGame.getCurrentPositions());
    await checkForLegalMove(false, copyOfGame);

    if (copyOfGame.getCurrentPlayer() !== iAm) {
      setDisableScreen(true);
    } else {
      setDisableScreen(false);
    }
    setIsLoadingGame(false)

  };

  const setUpGame = async () => {
    if (game) {
      if (isOnlineGame() && onlineTurns) {
        const iAm = await getWhoAmI();
        setWhoAmI(iAm);
      }
      setPositions(game.getCurrentPositions());
      doStartingPhase();
    }
  };

  // #endregion

  // #region Utility Functions
  
  
  const disabledScreen = (currentGame: Game): boolean => {
    if(!currentGame) return false
    if (gamemode === GAME_TYPE.COMPUTER) {
      return currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK;
    } else if (isOnlineGame()) {
      if(isWaitingForDouble === true) return true
      return whoAmI !== currentGame.getCurrentPlayer();
    }
    return false;
  };
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
    disabledScreen,
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
