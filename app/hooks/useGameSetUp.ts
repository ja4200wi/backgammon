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
import { Double } from "react-native/Libraries/Types/CodegenTypes";

type OnlineTurn = Schema['Turns']['type'];

export const useGameSetup = (
  runGame: () => void,
  makeTurn: (turn: Turn, quickTurn?: boolean, game?: Game) => Promise<Game | undefined>,
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
    const {
      isOnlineGame, 
      isOfflineGame,
      forceRender,
      CHECKS,
    } = useGameHelper()

    const startGame = async () => {
        if (isOnlineGame()) {
          startOnline();
        } else {
          startOffline()
        }
      };
      const startOnline = () => {
        const onlineDice = getOnlineDice(onlineTurns, 0);
        const startPlayer =
          onlineDice[0] > onlineDice[1] ? PLAYER_COLORS.WHITE : PLAYER_COLORS.BLACK;
        setGame(new Game(startPlayer, onlineDice))
      };
      const startOffline = () => {
        setGame(new Game());
      };
      const doStartingPhase = async () => {
        setPositions(game.getCurrentPositions());
        if (isOfflineGame()) {
          if (CHECKS.WHITE_IS_STARTING()) {
            game.setPlayer(PLAYER_COLORS.WHITE);
            setTimeout(() => setStartingPhase(false), 2250);
          } else {
            setTimeout(() => {
              setStartingPhase(false);
              runGame();
            }, 2250);
          }
        } else if (isOnlineGame()) {
          setTimeout(() => {
            setStartingPhase(false);
          }, 2250);
        }
      };
      const resetGame = () => {
        //only needed at gamescr (remove all other imports in usegamelogic)
        setGame(null);
        setGameIsRunning(false);
        setStartingPhase(true);
        setFirstRoll(true);
        setDisableScreen(true);
        setDoubleDice(new DoubleDice());
      };

      const loadGame = async () => {
            await processTurn();
      };
      
      const processTurn = async (
      ) => {
        let hasDoubled = false;
        let tempDoubleDice = new DoubleDice();
    
        while (onlineTurns.length > 0) {
          const tempOnlineTurn = onlineTurns.shift();
    
          if (!tempOnlineTurn) continue;
          const tempLocalTurn = transformOnlineTurnToLocalTurn(tempOnlineTurn);
          const nextMoveDice = transformOnlineDice(tempOnlineTurn.diceForNextTurn); // Use the remaining moves for the next dice roll
          if (tempOnlineTurn.type === 'MOVE') {
            handleLoadMove(tempLocalTurn,nextMoveDice)
          } else if (tempOnlineTurn.type === 'DOUBLE') {
            ({tempDoubleDice, hasDoubled} = handleLoadDouble(hasDoubled,tempDoubleDice,tempOnlineTurn))
            forceRender()
          } else if (tempOnlineTurn.type === 'GIVE_UP') {
            handleGiveUp(tempOnlineTurn)
          }
        }
        // After all turns are processed
        setDoubleDice(tempDoubleDice);
        setPositions(game.getCurrentPositions());
        await checkForLegalMove(false, game);
        setGame(game);
        setIsLoadingGame(false)
    
        if (game.getCurrentPlayer() !== whoAmI && whoAmI !== PLAYER_COLORS.NAP) {
          setDisableScreen(true);
        } else {
          setWaitingOnLocalPlayer(true)
          setDisableScreen(false);
        }
        forceRender()
      };

      const handleLoadMove = (tempLocalTurn: Turn, nextMoveDice: [number, number]) => {
        makeTurn(tempLocalTurn, true, game);
        game.onlineSwitchPlayer(nextMoveDice);
        forceRender()
      }
      const handleLoadDouble = (
        hasDoubled: boolean,
        tempDoubleDice: DoubleDice,
        tempOnlineTurn: any
      ): { tempDoubleDice: DoubleDice; hasDoubled: boolean } => {
        if (hasDoubled) {
          //case 1: Second double in a row - doubling
          tempDoubleDice = game.double();
          hasDoubled = false;
          return { tempDoubleDice, hasDoubled };
        } else {
          if (
            onlineTurns.length === 0 &&
            localPlayerId !== tempOnlineTurn.playerId
          ) {
            //case 2: Last opponent move was a double - waiting for decicion
            setDoubleAlertVisible(true);
            return { tempDoubleDice, hasDoubled };
          } else if (
            onlineTurns.length === 0 &&
            localPlayerId === tempOnlineTurn.playerId
          ) {
            //case 3: Last local move was double - waiting for opponent
            setIsWaitingForDouble(true);
            setShowWaitingDouble(true);
            return { tempDoubleDice, hasDoubled };
          } else {
            //case 4: Memorizing double to recognize case 1 in next iteration
            hasDoubled = true;
            return { tempDoubleDice, hasDoubled };
          }
        }
      };
      const handleGiveUp = (tempOnlineTurn:any) => {
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
      
    
    return {
      startGame,
      startOffline,
      startOnline,
      resetGame,
      doStartingPhase,
      loadGame,
    }
}