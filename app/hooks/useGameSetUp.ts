import { Schema } from "../../amplify/data/resource";
import { Game } from "../gameLogic/backgammon";
import { Bot } from "../gameLogic/bot";
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from "../utils/constants";
import { useGameState } from "./GameStateContext"

type OnlineTurn = Schema['Turns']['type'];

export const useGameSetup = () => {

    const {setGameMode, setGame , setBot } = useGameState()

    const startGame = async (
        gamemode: GAME_TYPE,
        newOnlineTurns?: OnlineTurn[],
        botType?: BOT_NAMES
      ) => {
        // Übergabe von onlineturns ist hier unnötig; und mit globalGameState auch die anderen beiden
        if (newOnlineTurns) {
          startOnline(gamemode, newOnlineTurns);
        } else {
          if (botType) startOffline(gamemode, botType);
          else startOffline(gamemode);
        }
      };
      const startOnline = (gamemode: GAME_TYPE, newOnlineTurns?: OnlineTurn[]) => {
        const onlineDice = getOnlineDice(newOnlineTurns!, 0);
        setGameMode(gamemode);
        const startPlayer =
          onlineDice[0] > onlineDice[1] ? PLAYER_COLORS.WHITE : PLAYER_COLORS.BLACK;
        const newGame = new Game(startPlayer, onlineDice);
        setGame(newGame);
      };
      const startOffline = (gamemode: GAME_TYPE, botTpye?: BOT_NAMES) => {
        setGameMode(gamemode);
        if (botTpye) {
          setBot(new Bot(botTpye))}
          ;
        const newGame = new Game();
        console.log('Setting game')
        setGame(newGame);
      };
    
    return {

    }
}