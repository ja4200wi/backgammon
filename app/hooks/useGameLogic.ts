import { useState, useEffect, useRef, useReducer } from 'react';
import { Game } from '../gameLogic/backgammon';
import {
  BOT_DIFFICULTY,
  BOT_NAMES,
  GAME_SETTINGS,
  GAME_TYPE,
  PLAYER_COLORS,
} from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { Bot } from '../gameLogic/bot';
import { DoubleDice } from '../gameLogic/doubleDice';
import { Move } from '../gameLogic/move';
import { del, generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import endGame, { sendTurn, saveGameStats } from '../service/gameService';
import { on } from 'events';
import { copy } from 'aws-amplify/storage';
import { G } from 'react-native-svg';
import { useGameState } from '../hooks/GameStateContext';
import { useGameLogicComputer } from './useGameLogicComputer';
import { getOnlineDice, transformOnlineDice, pause, transformLocalTurnToOnlineTurn, transformOnlineTurnToLocalTurn, getLatestOnlineTurn} from '../gameLogic/gameUtils';
import { useStateManagement } from './useGameLogicStateManagement';
import { useGameTurns } from './useGameLogicTurns';

const client = generateClient<Schema>();

type OnlineTurn = Schema['Turns']['type'];

type SendableTurn = {
  gameId: string;
  playerId: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};

type OnlineDice = Schema['Dice']['type'];

interface GameScrProps {
  navigation: any;
  route: any;
}

export const useGameLogic = (
  gameId: string,
  localPlayerId: string,
  setDoubleAlertVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isWaitingForDouble: boolean,
  setIsWaitingForDouble: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWaitingDouble:React.Dispatch<React.SetStateAction<boolean>>
) => {
  // #region State Management

  const [onlineTurns, setOnlineTurns] = useState<OnlineTurn[]>();
  const [whoAmI, setWhoAmI] = useState<PLAYER_COLORS>();
  const [opponentPlayerId, setOpponentPlayerId] = useState<string>('');

  const { 
    isStartingPhase,
    setStartingPhase, 
    firstRoll,
    setFirstRoll, 
    disableScreen, 
    setDisableScreen, 
    isLoadingGame, 
    setIsLoadingGame, 
    gameIsRunning, 
    setGameIsRunning, 
    game, 
    setGame,
    positions,
    setPositions,
    doubleDice,
    setDoubleDice,
    gamemode,
    setGameMode,
    gameOver,
    setGameOver,
    bot,
    setBot} = useGameState()

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

    const switchplayer = async () => {
      if (
        game &&
        !game.isGameOver() &&
        isOfflineGame()
      ) {
        game.switchPlayer();
        forceRender()
        if (disableScreen) {
          setDisableScreen(false);
        }
        const didswitch = await checkForLegalMove(false);
        if (
          game.getCurrentPlayer() === PLAYER_COLORS.BLACK &&
          gamemode === GAME_TYPE.COMPUTER &&
          !didswitch
        ) {
          runGame()
        }
      } else if (
        game &&
        !game.isGameOver() &&
        isOnlineGame() &&
        whoAmI === game.getCurrentPlayer()
      ) {
        const turn = game.getTurnAfterMove();
        const newOnlineDice = await sendTurnToServer(turn);
        const newLocalDice = transformOnlineDice(newOnlineDice);
        game.onlineSwitchPlayer(newLocalDice);
        if (disableScreen) {
          setDisableScreen(false);
        } else {
          setDisableScreen(true);
        }
        const copyGame = game.deepCopy()
        setGame(copyGame)
      } else if (
        game &&
        !game.isGameOver() &&
        isOnlineGame() &&
        whoAmI !== game.getCurrentPlayer() &&
        onlineTurns
      ) {
        const newdice = getOnlineDice(onlineTurns);
        forceRender()
        game.onlineSwitchPlayer(newdice);
        if (disableScreen) {
          setDisableScreen(false);
        } else {
          setDisableScreen(true);
        }
        await checkForLegalMove(false, game);
      }
    };
    const setUpEndBoard = async (currentGame: Game) => {
      if (currentGame) {
        setPositions(currentGame.getCurrentPositions());
        if (currentGame && whoAmI === currentGame.getCurrentPlayer()) {
          const turn = currentGame.getTurnAfterMove();
        }
      }
    };

  const {forceRenderReducer, updateGameState, checkForLegalMove,updateMoveIsOver} = useStateManagement(switchplayer,)
  const {double,giveUp} = useGameTurns(isOfflineGame,isOnlineGame,opponentPlayerId,localPlayerId,setUpEndBoard)

const [ignored, forceRender] = useReducer(forceRenderReducer, 0);
  const boardRef = useRef<any>(null); // Define a ref for the Board component
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
  const { runBot } = useGameLogicComputer(game,makeTurn)

  // #endregion

  // #region Effects
  useEffect(() => {
    if (gameId !== undefined && gameId !== null) {
      const sub = client.models.Turns.observeQuery({
        filter: { gameId: { eq: gameId } },
      }).subscribe({
        next: ({ items, isSynced }) => {
          setOnlineTurns([...items]);
        },
      });

      return () => sub.unsubscribe();
    }
  }, []);
  useEffect(() => {
    console.log('isloadingGame',isLoadingGame)
  },[isLoadingGame])
  useEffect(() => {
    if (
      (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY) &&
      game &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game]);
  useEffect(() => {
    if (
      isOnlineGame() &&
      game &&
      onlineTurns &&
      onlineTurns.length === 1 &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
      setIsLoadingGame(false);
    }
  }, [gamemode, game, onlineTurns]);
  //Case game just needs to load:
  useEffect(() => {
    if (
      isOnlineGame() &&
      game &&
      onlineTurns &&
      onlineTurns.length > 1 &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setIsLoadingGame(true);
      setStartingPhase(false);
      setFirstRoll(false);
      loadGame();
    }
  }, [gamemode, game, onlineTurns]);
  useEffect(() => {
    if (onlineTurns && onlineTurns.length > 0 && !isLoadingGame) {
      runOnline();
    }
  }, [onlineTurns]);

  useEffect(() => {
    if (!isLoadingGame && !isStartingPhase) {
      updatePositionHandler(0, 0, 'DISTRIBUTE');
      setIsLoadingGame(false);
    }
  }, [isLoadingGame]);
  // #endregion

  // #region Game Actions
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
  useEffect(() => {
  },[whoAmI])
  const loadGame = async () => {
    if (game) {
      if (isOnlineGame() && onlineTurns) {
        const startingDice = getOnlineDice(onlineTurns, 0);
        const iAm = await getWhoAmI();
        setWhoAmI(iAm);
        const copyOnlineTurns = [...onlineTurns]; // Create a copy of the onlineTurns array
        await processTurn(copyOnlineTurns, game, iAm, startingDice);
        await pause(1000);
      }
    }
  };
  
  const processTurn = async (
    copyOnlineTurns: OnlineTurn[],
    game: Game,
    iAm: PLAYER_COLORS,
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

    if (copyOfGame.getCurrentPlayer() !== iAm) {
      setDisableScreen(true);
    } else {
      setDisableScreen(false);
    }
    setIsLoadingGame(false)

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
  const runGame = () => {
    if (!gamemode || !game) return;
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        break;
      case GAME_TYPE.COMPUTER:
        runBot()
        break;
      case GAME_TYPE.RANDOM:
        runOnline();
        break;
      case GAME_TYPE.FRIENDLIST:
        // Initialize game with friends logic here
        break;
      case GAME_TYPE.ELO:
        // Initialize Elo ranked game logic here
        break;
      default:
        break;
    }
  };
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
  
  const resetGame = () => {
    setGame(null);
    setGameIsRunning(false);
    setStartingPhase(true);
    setFirstRoll(true);
    setDisableScreen(true);
    setDoubleDice(new DoubleDice());
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

  // #endregion

  // #region Online Game Logic
  const sendTurnToServer = async (
    turn: Turn,
    turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT'
  ): Promise<OnlineDice> => {
    if (!turn.hasMoves && turnType === undefined)
      return { dieOne: 0, dieTwo: 0 };
    const turnToSend: SendableTurn = transformLocalTurnToOnlineTurn(
      turn,
      gameId,
      localPlayerId,
      turnType
    );
    const nextDice: OnlineDice | null | undefined = await sendTurn(turnToSend);
    if (nextDice === null || nextDice === undefined) {
      return { dieOne: 0, dieTwo: 0 };
    } else {
      return nextDice;
    }
  };

  const sendFinalGameStateToServer = async (
    winnerId: string,
    loserId: string,
    reason: 'GIVE_UP' | 'DOUBLE' | 'TIMEOUT' | 'GAME_OVER'
  ) => {
    if (game) {
      const distWhite = game.getDistances().distWhite;
      const distBlack = game.getDistances().distBlack;
      const doubleDiceValue = doubleDice.getMultiplicator();
      saveGameStats(
        gameId,
        winnerId,
        loserId,
        gamemode!,
        0,
        0,
        1,
        { white: distWhite, black: distBlack },
        doubleDiceValue,
        reason
      );
      endGame(gameId);
    }
  };

  const runOnline = async () => {
    const latestTurn = getLatestOnlineTurn(onlineTurns!)
    if (localPlayerId === latestTurn?.playerId) {
      return;
    }
    if (latestTurn?.type === 'MOVE' && localPlayerId !== latestTurn?.playerId) {
      const localTurn = transformOnlineTurnToLocalTurn(latestTurn!);
      makeTurn(localTurn);
    } else if (
      latestTurn?.type === 'DOUBLE' &&
      localPlayerId !== latestTurn?.playerId
    ) {
      if (!isWaitingForDouble) {
        setDoubleAlertVisible(true);
      } else {
        setIsWaitingForDouble(false);
        setShowWaitingDouble(false);
        double();
      }
    } else if (
      latestTurn?.type === 'GIVE_UP' &&
      localPlayerId !== latestTurn?.playerId
    ) {
      setIsWaitingForDouble(false);
      setShowWaitingDouble(false)
      setGameOver({ gameover: true, winner: localPlayerId, reason: 'GIVE_UP' });
    }
  };
  // #endregion

  // #region Utility Functions


  const getWhoAmI = async () => {
    const { data: session, errors } = await client.models.Session.get({
      id: gameId,
    });
    if (session === null || session === undefined) {
      return PLAYER_COLORS.NAP;
    }
    if (session.playerOneID === localPlayerId) {
      setOpponentPlayerId(
        session.playerTwoID === null ? '' : session.playerTwoID
      );
      return PLAYER_COLORS.WHITE;
    } else {
      setOpponentPlayerId(
        session.playerOneID === null ? '' : session.playerOneID
      );
      return PLAYER_COLORS.BLACK;
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
  const disabledScreen = (currentGame: Game): boolean => {
    if(!currentGame) return false
    if (gamemode === GAME_TYPE.COMPUTER) {
      return currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK;
    } else if (isOnlineGame()) {
      if(isWaitingForDouble) return true
      return whoAmI !== currentGame.getCurrentPlayer();
    }
    return false;
  };
  
  
  const handleDisableScreen = (bool: boolean) => {
    setDisableScreen(bool);
  };
  const undoMove = async () => {
    if (game) {
      game.undoMove();
      await updateGameState();
      await updatePositionHandler(0, 0, 'UNDO');
    }
  };
  const legalMovesFrom = (from: number): number[] => {
    if (game) {
      return game?.getLegalMovesFrom(from) ?? [];
    } else return [];
  };
  // #endregion

  return {
    game,
    positions,
    boardRef,
    onMoveChecker,
    startGame,
    updateMoveIsOver,
    undoMove,
    legalMovesFrom,
    disabledScreen,
    giveUp,
    isStartingPhase,
    firstRoll,
    disableScreen,
    gameOver,
    setGameOver,
    doubleDice,
    double,
    resetGame,
    onlineTurns,
    sendTurnToServer,
    isOfflineGame,
    sendFinalGameStateToServer,
    opponentPlayerId,
    isOnlineGame,
    handleDisableScreen,
    isLoadingGame,
  };
};
