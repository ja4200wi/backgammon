import { Game } from '../gameLogic/backgammon';
import { useGameState } from '../hooks/GameStateContext';
import { GAME_TYPE, PLAYER_COLORS } from '../utils/constants';

export const useStateManagement = (
    switchplayer: () => Promise<void>,
) => {

    const {game,setPositions,gamemode,whoAmI,firstRoll,setFirstRoll} = useGameState()

    const forceRenderReducer = (x: number) => x + 1;

    const checkForLegalMove = async (fastSwitch: boolean, currentGame?: Game) => {
        if (currentGame && !currentGame.hasLegalMove()) {
          if (fastSwitch) {
            await switchplayer();
            return true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await switchplayer();
            return true;
          }
        } else if (!currentGame && game && !game.hasLegalMove()) {
          if (fastSwitch) {
            await switchplayer();
            return true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await switchplayer();
            return true;
          }
        }
        return false;
      };
    const updateGameState = async () => {
        if (game) {
          setPositions(game.getCurrentPositions()); // unneccecary becaue of new board logic
          if (isOnlineGame() && whoAmI !== game.getCurrentPlayer()) {
            return;
          }
          if (
            gamemode === GAME_TYPE.COMPUTER &&
            game.getCurrentPlayer() === PLAYER_COLORS.BLACK
          ) {
            return;
          }
          checkForLegalMove(true, game);
        }
      };
      const updateMoveIsOver = () => {
        if (firstRoll) {
          setFirstRoll(false);
        }
        if (game) {
          switchplayer();
        }
      };

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
      

  return {
    forceRenderReducer,
    updateGameState,
    checkForLegalMove,
    updateMoveIsOver,
  };
};
