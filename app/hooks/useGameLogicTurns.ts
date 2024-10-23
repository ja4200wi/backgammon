import { useState, useEffect, useRef } from 'react';
import { Bot } from '../gameLogic/bot';
import { Game } from '../gameLogic/backgammon';
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { useGameState } from './GameStateContext';
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameHelper } from './useGameLogicHelper';


export const useGameTurns = (
  updateGameState: () => Promise<void>,
  updateMoveIsOver: () => void,
  isGameOver: () => boolean
) => {

    const {game, setDoubleDice, setGameOver, whoAmI,localPlayerId,opponentPlayerId,boardRef} = useGameState()
    const {setUpEndBoard,isOnlineGame,isOfflineGame} = useGameHelper()

    const updatePositionHandler = async (
      sourceIndex: number,
      targetIndex: number,
      type?: 'UNDO' | 'DISTRIBUTE'
    ) => {
      if (boardRef.current) {
        boardRef.current.updatePosition(sourceIndex, targetIndex, type);
        return true;
      }
      return false;
    };
    const onMoveChecker = async (
      sourceIndex: number,
      targetIndex: number
    ): Promise<boolean> => {
      if (game) {
        const success = game.moveStone(sourceIndex, targetIndex);
        if (success) {
          if (!isGameOver()) {
            updateGameState();
          } else {
            setUpEndBoard(game);
          }
          return success;
        } else {
          return success;
        }
      }
      return false;
    };
    const doPlayerTwoMove = async (turn: Turn) => {
      const move = turn.nextMove();
      if (move) {
        await updatePositionHandler(move.getFrom(), move.getTo());
        await onMoveChecker(move.getFrom(), move.getTo());
        makeTurn(turn);
      }
    };
    const doQuickMove = async (turn: Turn, game: Game) => {
      const move = turn.nextMove();
  
      if (move && game) {
        try {
          const success = game.moveStone(move.getFrom(), move.getTo());
          if (success) {
            await makeTurn(turn, true, game);
          } else {
          }
        } catch (error) {
          console.error('Error during moveStone:', error);
        }
      }
    };

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
      const undoMove = async () => {
        if (game) {
          game.undoMove();
          await updateGameState();
          await updatePositionHandler(0, 0, 'UNDO');
        }
      };


  return {
    double,
    giveUp,
    makeTurn,
    updatePositionHandler,
    undoMove,
    onMoveChecker,
  };
};
