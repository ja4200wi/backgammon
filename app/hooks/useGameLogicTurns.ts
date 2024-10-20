import { useState, useEffect } from 'react';
import { Bot } from '../gameLogic/bot';
import { Game } from '../gameLogic/backgammon';
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { useGameState } from './GameStateContext';
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameHelper } from './useGameLogicHelper';


export const useGameTurns = (
) => {

    const {game, setDoubleDice, setGameOver, whoAmI,localPlayerId,opponentPlayerId} = useGameState()
    const {setUpEndBoard,isOnlineGame,isOfflineGame} = useGameHelper()

    const double = () => {
        if (game) {
          const newDoubleDice = game.double();
          setDoubleDice(newDoubleDice);
        }
      };
      const giveUp = (looser: PLAYER_COLORS) => {
        if (game) {
          game.giveUp(looser);
          const winner =
            looser === PLAYER_COLORS.WHITE
              ? PLAYER_COLORS.BLACK
              : PLAYER_COLORS.WHITE;
          if (isOfflineGame()) {
            setGameOver({ gameover: true, winner: winner, reason: 'GIVE_UP' });
          } else if (isOnlineGame()) {
            setGameOver({
              gameover: true,
              winner: looser === whoAmI ? opponentPlayerId : localPlayerId,
              reason: 'GIVE_UP',
            });
          }
          setUpEndBoard(game);
        }
      };
      const makeTurn = async (
        turn: Turn,
        quickTurn?: boolean,
        game?: Game
      ): Promise<Game | undefined> => {
        if (quickTurn && game) {
          if (turn.hasMoves()) {
            await doQuickMove(turn, game);
          } else {
            return game;
          }
        } else if (turn.hasMoves()) {
          setTimeout(() => doPlayerTwoMove(turn), 750);
          return game;
        } else {
          setTimeout(() => updateMoveIsOver(), 750);
          return game;
        }
        return game;
      };


  return {
    double,
    giveUp,
    makeTurn,
  };
};
