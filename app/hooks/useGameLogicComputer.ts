import { useState, useEffect } from 'react';
import { Bot } from '../gameLogic/bot';
import { Game } from '../gameLogic/backgammon';
import { BOT_NAMES, PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { useGameState } from './GameStateContext';

/* 
Use GameState now for statemanagement (reduce board 4since it can get all states from there in future?)
Cannot use hook inside of useGamelogiccomputer!!!

Next steps:
Take a look at whether functions are a better way of extracting logic
Extract logic also for playonline
simplify usegamelogic and make code readable!!! (ask chat for help)

*/

export const useGameLogicComputer = (
  game: Game | null,
  makeTurn: (turn: Turn, quickTurn?: boolean, game?: Game) => Promise<Game | undefined>,
) => {

    const {setDisableScreen,bot} = useGameState()

    const runBot = async () => {
      if (game) {
        if (game.getMovesLeft().length === 0) { return
        } else {
          if (game.getCurrentPlayer() === PLAYER_COLORS.BLACK) {
            setDisableScreen(true);
            await makeBotMove();
          }
        }
      }
    };

    const makeBotMove = async () => {
      if (game) {
        //const botTurn = bot.tempTurnEasyBot(game);
        const botTurn = bot.makeMove(game);
        if (botTurn) {
          await makeTurn(botTurn);
        } else console.log('FAILED');
      }
    };

  return {
    runBot,
  };
};
