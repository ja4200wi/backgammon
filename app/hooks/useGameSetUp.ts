import { Schema } from "../../amplify/data/resource";
import { Game } from "../gameLogic/backgammon";
import { Bot } from "../gameLogic/bot";
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from "../utils/constants";
import { useGameState } from "./GameStateContext"
import { getOnlineDice } from "../gameLogic/gameUtils";
import { useGameHelper } from "./useGameLogicHelper";
import { DoubleDice } from "../gameLogic/doubleDice";

type OnlineTurn = Schema['Turns']['type'];

export const useGameSetup = (
  getWhoAmI: () => Promise<PLAYER_COLORS>,
  runGame: () => void,

) => {

    const {setGameMode, setGame , setBot , onlineTurns, setWhoAmI, setPositions, setStartingPhase,game,setGameIsRunning,setFirstRoll,setDisableScreen,setDoubleDice} = useGameState()
    const {isOnlineGame, isOfflineGame} = useGameHelper()

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
      const doStartingPhase = async () => {
        if (game && isOfflineGame()) {
          console.log('doing starting phase now')
          if (game.getDice()[0] > game.getDice()[1]) {
            game.setPlayer(PLAYER_COLORS.WHITE);
            setTimeout(() => setStartingPhase(false), 2250);
          } else {
            setTimeout(() => {
              setStartingPhase(false);
              runGame();
            }, 2250);
          }
        } else if (isOnlineGame() && game) {
          const iAM = await getWhoAmI();
          if (iAM === game.getCurrentPlayer()) {
            setTimeout(() => {
              setStartingPhase(false);
            }, 2250);
          } else {
            setTimeout(() => {
              setStartingPhase(false);
            }, 2250);
          }
        }
      };
      const resetGame = () => {
        setGame(null);
        setGameIsRunning(false);
        setStartingPhase(true);
        setFirstRoll(true);
        setDisableScreen(true);
        setDoubleDice(new DoubleDice());
      };
    
    return {
      startGame,
      startOffline,
      startOnline,
      resetGame,
      doStartingPhase,
      setUpGame,
    }
}