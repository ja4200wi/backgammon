import { useReducer } from 'react';
import { Game } from '../gameLogic/backgammon';
import { GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { useGameState } from './GameStateContext';

export const useGameHelper = (
) => {


    const {
      gamemode,
      setDisableScreen,
      game,
      setPositions,
      whoAmI,
      isWaitingForDouble,
      gameIsRunning,
      onlineTurns,
      isLoadingGame,
      isStartingPhase,
      waitingOnLocalPlayer
    } = useGameState()

    const forceRenderReducer = (x: number) => x + 1;
    const [ignored, forceRender] = useReducer(forceRenderReducer, 0);

    const isOnlineGame = (gameMode?: GAME_TYPE) => {
        if (gameMode) {
          return (
            gameMode === GAME_TYPE.RANDOM ||
            gameMode === GAME_TYPE.ELO ||
            gameMode === GAME_TYPE.FRIENDLIST
          );
        } else {
          return (
            gamemode === GAME_TYPE.RANDOM ||
            gamemode === GAME_TYPE.ELO ||
            gamemode === GAME_TYPE.FRIENDLIST
          );
        }
      };
      const isOfflineGame = () => {
        return gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY;
      };
      const handleDisableScreen = (bool: boolean) => {
        setDisableScreen(bool);
      };
      const legalMovesFrom = (from: number): number[] => {
        if (game) {
          return game?.getLegalMovesFrom(from) ?? [];
        } else return [];
      };
      const setUpEndBoard = async (currentGame: Game) => {
        if (currentGame) {
          setPositions(currentGame.getCurrentPositions());
          if (currentGame && whoAmI === currentGame.getCurrentPlayer()) {
            const turn = currentGame.getTurnAfterMove();
          }
        }
      };

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

      const CHECKS = {
        READY_START_OFFLINE: ():boolean => (
          isOfflineGame() && 
          game && 
          !gameIsRunning
        ),
        READY_START_ONLINE: ():boolean => (
          isOnlineGame() &&
          game &&
          onlineTurns &&
          onlineTurns.length === 1 &&
          !gameIsRunning
        ),
        READY_LOAD_ONLINE_GAME: ():boolean => (
          isOnlineGame() &&
          game &&
          onlineTurns &&
          onlineTurns.length > 1 &&
          !gameIsRunning
        ),
        READY_RUN_ONLINE: ():boolean => (
          onlineTurns &&
          onlineTurns.length > 0 &&
          !isLoadingGame &&
          !waitingOnLocalPlayer
        ),
        READY_SET_LOADED_GAME: ():boolean => (
          !isLoadingGame && 
          !isStartingPhase
        ),
        OFFLINE_SWITCH: ():boolean => (
          game &&
          !game.isGameOver() &&
          isOfflineGame()
        ),
        COMPURTERS_TURN: ():boolean => (
          game.getCurrentPlayer() === PLAYER_COLORS.BLACK &&
          gamemode === GAME_TYPE.COMPUTER
        ),
        ONLINE_SWITCH_AFTER_LOCAL_MOVE: ():boolean => (
          game &&
          !game.isGameOver() &&
          isOnlineGame() &&
          whoAmI === game.getCurrentPlayer()
        ),
        ONLINE_SWITCH: ():boolean => (
          game &&
          !game.isGameOver() &&
          isOnlineGame()
        ),
        LOCAL_PLAYER_HAS_TURN: ():boolean => (
          whoAmI === game.getCurrentPlayer()
        ),
        WHITE_IS_STARTING: ():boolean => (
          game.getDice()[0] > game.getDice()[1]
        ),
      }

  return {
    isOnlineGame,
    isOfflineGame,
    handleDisableScreen,
    legalMovesFrom,
    setUpEndBoard,
    disabledScreen,
    forceRender,
    forceRenderReducer,
    CHECKS,
  };
};
