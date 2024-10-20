import { Game } from '../gameLogic/backgammon';
import { GAME_TYPE } from '../utils/constants';
import { useGameState } from './GameStateContext';

export const useGameHelper = (
) => {


    const {gamemode,setDisableScreen,game,setPositions,whoAmI} = useGameState()

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

  return {
    isOnlineGame,
    isOfflineGame,
    handleDisableScreen,
    legalMovesFrom,
    setUpEndBoard,
  };
};
