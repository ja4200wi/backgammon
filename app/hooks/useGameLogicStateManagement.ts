import { Schema } from '../../amplify/data/resource';
import { Game } from '../gameLogic/backgammon';
import { useGameState } from '../hooks/GameStateContext';
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { useGameHelper } from './useGameLogicHelper';

type OnlineTurn = Schema['Turns']['type'];

export const useStateManagement = (
    switchplayer: () => Promise<void>,
    opponentPlayerId:string,
) => {

    const {game,setPositions,gamemode,whoAmI,firstRoll,setFirstRoll,setGameOver,onlineTurns,localPlayerId} = useGameState()

    const {isOfflineGame,isOnlineGame} = useGameHelper()

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

      

      const isGameOver = (): boolean => {
        if (game) {
          if (game.isGameOver()) {
            if (isOfflineGame()) {
              const winner = game.whoIsWinner();
              if(gamemode === GAME_TYPE.COMPUTER) {
                const winnerText = winner === PLAYER_COLORS.BLACK ? BOT_NAMES.RIANA : 'You'
                setGameOver({ gameover: true, winner: winnerText, reason: 'GAME_OVER' });
              } else {
                setGameOver({ gameover: true, winner: winner, reason: 'GAME_OVER' });
              }
              return true;
            } else if (isOnlineGame() && onlineTurns) {
              const onlineWinner =
                game.whoIsWinner() === whoAmI ? localPlayerId : opponentPlayerId;
              setGameOver({
                gameover: true,
                winner: onlineWinner,
                reason: 'GAME_OVER',
              });
              return true;
            }
          }
          return false;
        }
        return false;
      };
      

  return {
    forceRenderReducer,
    updateGameState,
    checkForLegalMove,
    updateMoveIsOver,
    isGameOver,
  };
};
