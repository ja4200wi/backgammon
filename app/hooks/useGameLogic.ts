
import {
  GAME_TYPE,
  PLAYER_COLORS,
} from '../utils/constants';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useGameState } from '../hooks/GameStateContext';
import { useGameLogicComputer } from './useGameLogicComputer';
import { getOnlineDice, transformOnlineDice} from '../gameLogic/gameUtils';
import { useEffect, useReducer } from 'react';
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameTurns } from './useGameLogicTurns';
import { useGameHelper } from './useGameLogicHelper';
import { useGameSetup } from './useGameSetUp';
import { useGameLogicOnline } from './useGameLogicOnline';
import { useGameEffects } from './useGameEffects';

const client = generateClient<Schema>();

export const useGameLogic = (
) => {

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
        break;
      case GAME_TYPE.ELO:
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

  // CONSTANTS

  const { 
    setStartingPhase, 
    setFirstRoll, 
    disableScreen, 
    setDisableScreen, 
    isLoadingGame, 
    setIsLoadingGame, 
    setGameIsRunning, 
    game, 
    setGame,
    gamemode,
    onlineTurns,
    gameId,
    whoAmI,
    setWaitingOnLocalPlayer,
    } = useGameState()

  const {
    isOnlineGame, 
    isOfflineGame, 
    handleDisableScreen,
    legalMovesFrom,
    forceRender,
    CHECKS,
  } = useGameHelper()

  const {
    syncOnlineTunrs,
    setLocalPlayerColor,
  } = useGameEffects()

  const {
    updateGameState,
    checkForLegalMove,
    updateMoveIsOver,
    isGameOver
  } = useStateManagement(switchplayer)

  const {
    double,
    giveUp,
    makeTurn,
    updatePositionHandler,
    undoMove,
    onMoveChecker
    } = useGameTurns(updateGameState,updateMoveIsOver,isGameOver)

  const {
    sendTurnToServer,
    sendFinalGameStateToServer,
    runOnline
  } = useGameLogicOnline(makeTurn,double)

  const { runBot } = useGameLogicComputer(game,makeTurn)

  const {
    startGame,
    resetGame,
    setUpGame,
    loadGame,
  } = useGameSetup(runGame,makeTurn,checkForLegalMove)

  // #region Effects
  useEffect(() => {
    syncOnlineTunrs()
  }, [,gameId]);

  useEffect(() => {
    setLocalPlayerColor()
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
    onMoveChecker,
    startGame,
    updateMoveIsOver,
    undoMove,
    legalMovesFrom,
    giveUp,
    double,
    resetGame,
    sendTurnToServer,
    sendFinalGameStateToServer,
    handleDisableScreen,
  };
};
