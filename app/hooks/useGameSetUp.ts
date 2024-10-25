import { Schema } from "../../amplify/data/resource";
import { Game } from "../gameLogic/backgammon";
import { Bot } from "../gameLogic/bot";
import { BOT_NAMES, GAME_TYPE, PLAYER_COLORS } from "../utils/constants";
import { useGameState } from "./GameStateContext"
import { getOnlineDice, pause, transformOnlineDice, transformOnlineTurnToLocalTurn } from "../gameLogic/gameUtils";
import { useGameHelper } from "./useGameLogicHelper";
import { DoubleDice } from "../gameLogic/doubleDice";
import { Turn } from "../gameLogic/turn";
import { useReducer } from "react";

type OnlineTurn = Schema['Turns']['type'];

export const useGameSetup = (
  runGame: () => void,
  makeTurn: (turn: Turn, quickTurn?: boolean, game?: Game) => Promise<Game | undefined>,
  forceRenderReducer: (x: number) => number,
  checkForLegalMove: (fastSwitch: boolean, currentGame?: Game) => Promise<boolean>,
) => {

    const {
      setGameMode, 
      setGame, 
      setBot, 
      onlineTurns, 
      setWhoAmI, 
      setPositions, 
      setStartingPhase,
      game,
      setGameIsRunning,
      setFirstRoll,
      setDisableScreen,
      setDoubleDice,
      setGameId,
      setLocalPlayerId,
      localPlayerId,
      gameId,
      whoAmI,
      setIsLoadingGame,
      setDoubleAlertVisible,
      setIsWaitingForDouble,
      setShowWaitingDouble,
      setWaitingOnLocalPlayer,
      setGameOver,
      opponentPlayerId,
    } = useGameState()
    const {isOnlineGame, isOfflineGame} = useGameHelper()
    const [ignored, forceRender] = useReducer(forceRenderReducer, 0);

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
        setGameId(gameId)
        setLocalPlayerId(localPlayerId)
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
        setGame(newGame);
      };
      const setUpGame = async () => {
        if (game) {
          setPositions(game.getCurrentPositions());
          doStartingPhase();
        }
      };
      const doStartingPhase = async () => {
        if (game && isOfflineGame()) {
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
          if (whoAmI === game.getCurrentPlayer()) {
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

      const loadGame = async () => {
        if (game) {
          if (isOnlineGame() && onlineTurns) {
            const startingDice = getOnlineDice(onlineTurns, 0);
            const copyOnlineTurns = [...onlineTurns]; // Create a copy of the onlineTurns array
            await processTurn(copyOnlineTurns, game, startingDice);
            await pause(1000);
          }
        }
      };
      
      const processTurn = async (
        copyOnlineTurns: OnlineTurn[],
        game: Game,
        startingDice: [number, number]
      ) => {
        let hasDoubled = false;
        let tempDoubleDice = new DoubleDice();
        let currentGame: Game | undefined = game;
    
        while (copyOnlineTurns.length > 0) {
          const tempOnlineTurn = copyOnlineTurns.shift();
    
          if (!tempOnlineTurn) continue;
          const tempLocalTurn = transformOnlineTurnToLocalTurn(tempOnlineTurn);
    
          const nextMoveDice = transformOnlineDice(tempOnlineTurn.diceForNextTurn!); // Use the remaining moves for the next dice roll
          if (tempOnlineTurn.type === 'MOVE') {
            currentGame = await makeTurn(tempLocalTurn, true, currentGame);
            if (currentGame) {
              currentGame.onlineSwitchPlayer(nextMoveDice);
              forceRender()
            }
          } else if (tempOnlineTurn.type === 'DOUBLE'&& currentGame) {
            if (hasDoubled) {
              tempDoubleDice = currentGame.double();
              hasDoubled = false;
            } else {
              if (
                copyOnlineTurns.length === 0 &&
                localPlayerId !== tempOnlineTurn.playerId
              ) {
                setIsLoadingGame(false);
                setDoubleAlertVisible(true);
              } else if(copyOnlineTurns.length === 0 && localPlayerId === tempOnlineTurn.playerId) {
                setIsLoadingGame(false)
                setIsWaitingForDouble(true)
                setShowWaitingDouble(true)
                forceRender()
              } else {
                hasDoubled = true;
              }
            }
          } else if (tempOnlineTurn.type === 'GIVE_UP') {
            if (localPlayerId !== tempOnlineTurn.playerId) {
              setIsLoadingGame(false)
              setTimeout(() => {
                setGameOver({ gameover: true, winner: localPlayerId, reason: 'GIVE_UP' });
              }, 100);
              return
            } else {
              setIsLoadingGame(false)
              setTimeout(() => {
                setGameOver({ gameover: true, winner: opponentPlayerId, reason: 'GIVE_UP' });
              }, 100);
              return
            }
          }
        }
        // After all turns are processed
        const copyOfGame = currentGame!.deepCopy();
        setGame(copyOfGame);
        setDoubleDice(tempDoubleDice);
        setPositions(copyOfGame.getCurrentPositions());
        await checkForLegalMove(false, copyOfGame);
    
        if (copyOfGame.getCurrentPlayer() !== whoAmI && whoAmI !== PLAYER_COLORS.NAP) {
          setDisableScreen(true);
        } else {
          setWaitingOnLocalPlayer(true)
          setDisableScreen(false);
        }
        setIsLoadingGame(false)
    
      };
    
    return {
      startGame,
      startOffline,
      startOnline,
      resetGame,
      doStartingPhase,
      setUpGame,
      loadGame,
    }
}