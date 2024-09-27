import { useState, useEffect, useRef } from 'react';
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
import { sendTurn, saveGameStats } from '../service/gameService';
import { on } from 'events';

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
  setIsWaitingForDouble: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // #region State Management
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [isStartingPhase, setStartingPhase] = useState<boolean>(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [pipCount, setPipCount] = useState(GAME_SETTINGS.startScores);
  const [doubleDice, setDoubleDice] = useState<DoubleDice>(new DoubleDice());
  const [firstRoll, setFirstRoll] = useState(true);
  const [lastturn, setLastTurn] = useState<Turn>();
  const [disableScreen, setDisableScreen] = useState<boolean>(false);
  const [gamemode, setGameMode] = useState<GAME_TYPE>();
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount
  );
  const [gameOver, setGameOver] = useState<{
    gameover: boolean;
    winner: PLAYER_COLORS | string;
    reason?: 'GIVE_UP' | 'DOUBLE' | 'TIMEOUT' | 'GAME_OVER';
  }>({
    gameover: false,
    winner: PLAYER_COLORS.NAP,
  });
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [onlineTurns, setOnlineTurns] = useState<OnlineTurn[]>();
  const [whoAmI, setWhoAmI] = useState<PLAYER_COLORS>();
  const [opponentPlayerId, setOpponentPlayerId] = useState<string>('');
  const [isLoadingGame,setIsLoadingGame] = useState<boolean>(false)
  const bot = new Bot(BOT_DIFFICULTY.CUSTOM, BOT_NAMES.RIANA);
  const boardRef = useRef<any>(null); // Define a ref for the Board component
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
    if (
      (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY) &&
      game &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
    }
  }, [gamemode, game]);

  useEffect(() => {
    if (
      isOnlineGame() &&
      game &&
      onlineTurns &&
      onlineTurns.length > 0 &&
      onlineTurns.length < 2 &&
      !gameIsRunning
    ) {
      setGameIsRunning(true);
      setUpGame();
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
  // #endregion

  // #region Game Actions
  const startGame = async (
    gamemode: GAME_TYPE,
    newOnlineTurns?: OnlineTurn[]
  ) => {
    if (newOnlineTurns) {
      startOnline(gamemode, newOnlineTurns);
    } else {
      startOffline(gamemode);
    }
  };
  const startOnline = (gamemode: GAME_TYPE, newOnlineTurns?: OnlineTurn[]) => {
    const onlineDice = getOnlineDice(newOnlineTurns!,0);
    setDice(onlineDice);
    setGameMode(gamemode);
    const startPlayer =
      onlineDice[0] > onlineDice[1] ? PLAYER_COLORS.WHITE : PLAYER_COLORS.BLACK;
    const newGame = new Game(startPlayer, onlineDice);
    setGame(newGame);
  };
  const startOffline = (gamemode: GAME_TYPE) => {
    setGameMode(gamemode);
    const newGame = new Game();
    setGame(newGame);
  };
  const loadGame = async () => {
    if(game) {
      if (isOnlineGame() && onlineTurns) {
        setDice(getOnlineDice(onlineTurns,0));
        const iAm = await getWhoAmI();
        setWhoAmI(iAm);
      }
      let hasDoubled = false
      let tempDoubleDice = new DoubleDice()
      const copyOnlineTurns = onlineTurns
      if(copyOnlineTurns) {
        for(let i = 1; i < copyOnlineTurns.length ; i++) {
          const tempOnlineTurn = copyOnlineTurns[i]
          const tempLocalTurn = transformOnlineTurnToLocalTurn(tempOnlineTurn!)
          const nextMoveDice = getOnlineDice(copyOnlineTurns,i)
          if(tempOnlineTurn.type === 'MOVE') {
            const updatedGame = await makeTurn(tempLocalTurn,true,game)
            if(updatedGame) {
              updatedGame.onlineSwitchPlayer(nextMoveDice)
              setDice(nextMoveDice)
            }
          } else if(tempOnlineTurn.type === 'DOUBLE') {
            if(hasDoubled) {
              tempDoubleDice = game.double();
              hasDoubled = false
            } else {
              hasDoubled = true
            }
          } else if (
            tempOnlineTurn.type === 'GIVE_UP'
          ) {
            setIsWaitingForDouble(false);
            if(localPlayerId !== tempOnlineTurn.playerId) {
              setGameOver({ gameover: true, winner: localPlayerId, reason:'GIVE_UP' });
            } else {
              setGameOver({ gameover: true, winner: opponentPlayerId , reason:'GIVE_UP'});
            }
          }
        }
        if(game.getCurrentPlayer() !== whoAmI) {setDisableScreen(true)}
        else {setDisableScreen(false)}
        setDoubleDice(tempDoubleDice)
        setPositions(game.getCurrentPositions());
        const distances = game.getDistances();
        updatePipCount(distances.distBlack, distances.distWhite);
        updateHomeCheckers(game);
        checkForLegalMove(false, game);
        setIsLoadingGame(false)
      }
    }
  }
  const setUpGame = async () => {
    if (game) {
      if (isOnlineGame() && onlineTurns) {
        setDice(getOnlineDice(onlineTurns,0));
        const iAm = await getWhoAmI();
        setWhoAmI(iAm);
      }
      setPositions(game.getCurrentPositions());
      setPipCount(GAME_SETTINGS.startScores);
      setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
      doStartingPhase();
    }
  };
  const setUpLoadingGame = () => {
    
  }
  const doStartingPhase = async () => {
    if (game && isOfflineGame()) {
      if (game.getDice()[0] > game.getDice()[1]) {
        game.setPlayer(PLAYER_COLORS.WHITE);
        setDice(game.getDice());
        setTimeout(() => setStartingPhase(false), 2250);
      } else {
        setDice(game.getDice());
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
        runBot();
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
    type?: 'UNDO'
  ) => {
    if (boardRef.current) {
      boardRef.current.updatePosition(sourceIndex, targetIndex, type);
      return true;
    }
    return false;
  };
  const switchplayer = async () => {
    if (
      game &&
      !game.isGameOver() &&
      (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY)
    ) {
      game.switchPlayer();
      setDice(game.getDice());
      if (disableScreen) {
        setDisableScreen(false);
      }
      const didswitch = await checkForLegalMove(false);
      if (
        game.getCurrentPlayer() === PLAYER_COLORS.BLACK &&
        gamemode === GAME_TYPE.COMPUTER &&
        !didswitch
      ) {
        runGame();
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
      setDice(newLocalDice);
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
    } else if (
      game &&
      !game.isGameOver() &&
      isOnlineGame() &&
      whoAmI !== game.getCurrentPlayer() &&
      onlineTurns
    ) {
      const newdice = getOnlineDice(onlineTurns);
      setDice(newdice);
      game.onlineSwitchPlayer(newdice);
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
      await checkForLegalMove(false, game);
    }
  };
  const resetGame = () => {
    setGame(null);
    setGameIsRunning(false);
    setStartingPhase(true);
    setFirstRoll(true);
    setDisableScreen(true);
    setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
    setDoubleDice(new DoubleDice());
  };
  const giveUp = (looser: PLAYER_COLORS) => {
    if (game) {
      game.giveUp(looser);
      const winner =
        looser === PLAYER_COLORS.WHITE
          ? PLAYER_COLORS.BLACK
          : PLAYER_COLORS.WHITE;
      if (isOfflineGame()) {
        console.log(whoAmI, 'setting game over with', winner, 'GIVE_UP');
        setGameOver({ gameover: true, winner: winner, reason: 'GIVE_UP' });
      } else if (isOnlineGame()) {
        console.log(
          whoAmI,
          'setting game over with',
          looser === whoAmI ? opponentPlayerId : localPlayerId,
          'GIVE_UP'
        );
        setGameOver({
          gameover: true,
          winner: looser === whoAmI ? opponentPlayerId : localPlayerId,
          reason: 'GIVE_UP',
        });
      }
      setUpEndBoard(game);
    }
  };
  const double = () => {
    if (game) {
      const newDoubleDice = game.double();
      setDoubleDice(newDoubleDice);
    }
  };
  const makeTurn = async (turn: Turn, quickTurn?:boolean,game?:Game) => {
    if(quickTurn && game) {
      if(turn.hasMoves()) {
        doQuickMove(turn,game)
      } else {
        return game
      }
    }
    if (turn.hasMoves()) {
      setTimeout(() => doPlayerTwoMove(turn), 750);
    } else {
      setTimeout(() => updateMoveIsOver(), 750);
    }
  };
  const doPlayerTwoMove = async (turn: Turn) => {
    const move = turn.nextMove();
    if (move) {
      await onMoveChecker(move.getFrom(), move.getTo())
      await updatePositionHandler(move.getFrom(), move.getTo());
      await makeTurn(turn);
    }
  };
  const doQuickMove = async (turn:Turn,game:Game) => {
    const move = turn.nextMove();
    if(move && game) {
      game.moveStone(move.getFrom(), move.getTo())
      makeTurn(turn,true,game)
    }
  }
  // #endregion

  // #region Online Game Logic
  const sendTurnToServer = async (
    turn: Turn,
    turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT'
  ): Promise<OnlineDice> => {
    const turnToSend: SendableTurn = transformLocalTurnToOnlineTurn(
      turn,
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
    reason: 'GIVE_UP' | 'DOUBLE' | 'TIMEOUT' | 'GAME_OVER'
  ) => {
    if (game) {
      const distWhite = game.getDistances().distWhite;
      const distBlack = game.getDistances().distBlack;
      const doubleDiceValue = doubleDice.getMultiplicator();
      console.log(
        whoAmI,
        'safing game stats:',
        distWhite,
        distBlack,
        doubleDiceValue,
        reason,
        winnerId
      );
      saveGameStats(
        gameId,
        winnerId,
        gamemode!,
        0,
        0,
        1,
        { white: distWhite, black: distBlack },
        doubleDiceValue,
        reason
      );
    }
  };

  const runOnline = async () => {
    const latestTurn = getLatestOnlineTurn(onlineTurns!);
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
        double();
      }
    } else if (
      latestTurn?.type === 'GIVE_UP' &&
      localPlayerId !== latestTurn?.playerId
    ) {
      setIsWaitingForDouble(false);
      setGameOver({ gameover: true, winner: localPlayerId });
    }
  };
  // #endregion

  // #region Utility Functions

  const transformLocalTurnToOnlineTurn = (
    turn: Turn,
    turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT'
  ): SendableTurn => {
    const moves = [];
    while (turn.hasMoves()) {
      const tmpMove = turn.nextMove();
      moves.push({ from: tmpMove!.getFrom(), to: tmpMove!.getTo() });
    }
    return {
      gameId: gameId,
      playerId: localPlayerId,
      moves: moves,
      type: turnType ? turnType : 'MOVE',
    };
  };
  const transformOnlineTurnToLocalTurn = (turn: OnlineTurn): Turn => {
    if (turn) {
      const tempOnlineMoves = turn.moves;
      const tempLocalMoves: Move[] = [];

      // Iterate over tempOnlineMoves
      while (tempOnlineMoves && tempOnlineMoves.length > 0) {
        const currentMove = tempOnlineMoves.shift(); // Remove the first element from the array

        if (
          currentMove &&
          currentMove.from !== undefined &&
          currentMove.to !== undefined
        ) {
          // Assuming Move type has properties 'start' and 'end'
          const localMove: Move = new Move(currentMove.from, currentMove.to);
          tempLocalMoves.push(localMove);
        }
      }

      // Return a new Turn object
      return new Turn(tempLocalMoves);
    }

    // Return a default Turn if the input is null or undefined
    return new Turn();
  };
  const getOnlineDice = (turns: OnlineTurn[],getDiceAt?:number): [number, number] => {
    const latestTurn = getDiceAt ? turns.at(getDiceAt) : turns.at(-1);
    if (latestTurn)
      if (latestTurn.diceForNextTurn) {
        return transformOnlineDice(latestTurn.diceForNextTurn);
      }
    return [0, 0];
  };
  const transformOnlineDice = (onlineDice: OnlineDice): [number, number] => {
    if (onlineDice) {
      const diceForNextTurn = [onlineDice.dieOne ?? 0, onlineDice.dieTwo ?? 0];
      return [diceForNextTurn[0], diceForNextTurn[1]];
    }
    return [0, 0];
  };
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
  const getLatestOnlineTurn = (latestTurn: OnlineTurn[]) => {
    return latestTurn.at(-1);
  };
  const setUpEndBoard = async (currentGame: Game) => {
    if (currentGame) {
      setPositions(currentGame.getCurrentPositions());
      updateHomeCheckers(currentGame);
      const distances = currentGame.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      if (currentGame && whoAmI === currentGame.getCurrentPlayer()) {
        const turn = currentGame.getTurnAfterMove();
        await sendTurnToServer(turn); // ad gameover type here
      }
    }
  };
  const isOfflineGame = () => {
    return gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY;
  };
  const isOnlineGame = (gameMode?:GAME_TYPE) => {
    if(gameMode) {
      return(
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
  const updateGameState = async () => {
    if (game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
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
  const isGameOver = (): boolean => {
    if (game) {
      if (game.isGameOver()) {
        if (isOfflineGame()) {
          const winner = game.whoIsWinner();
          console.log(whoAmI, 'setting game over with', winner, 'GAME_OVER');
          setGameOver({ gameover: true, winner: winner, reason: 'GAME_OVER' });
          return true;
        } else if (isOnlineGame() && onlineTurns) {
          const onlineWinner =
            game.whoIsWinner() === whoAmI ? localPlayerId : opponentPlayerId;
          console.log(
            whoAmI,
            'setting game over with',
            onlineWinner,
            'GAME_OVER'
          );
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
    if (gamemode === GAME_TYPE.COMPUTER) {
      return currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK;
    } else if (isOnlineGame()) {
      return whoAmI !== currentGame.getCurrentPlayer();
    }
    return false;
  };
  const checkForLegalMove = async (fastSwitch: boolean, currentGame?: Game) => {
    if (currentGame && !currentGame.hasLegalMove()) {
      if (fastSwitch) {
        switchplayer();
        return true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        switchplayer();
        return true;
      }
    } else if (!currentGame && game && !game.hasLegalMove()) {
      if (fastSwitch) {
        switchplayer();
        return true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        switchplayer();
        return true;
      }
    }
    return false;
  };
  const showAcceptMoveButton = (currentGame: Game) => {
    if (game) {
      return !(currentGame.getMovesLeft().length === 0);
    }
    return true;
  };
  const showUndoMoveButton = (currentGame: Game) => {
    if (game === null) {
      return true;
    }
    return currentGame.getLastMoves().length === 0;
  };
  const updatePipCount = (distBlack: number, distWhite: number) => {
    setPipCount([distWhite, distBlack]);
  };
  const updateMoveIsOver = () => {
    if (firstRoll) {
      setFirstRoll(false);
    }
    if (game) {
      switchplayer();
    }
  };
  const updateHomeCheckers = (game: Game) => {
    if (game) {
      setHomeCheckers([
        game.getHomeCheckers(PLAYER_COLORS.WHITE),
        game.getHomeCheckers(PLAYER_COLORS.BLACK),
      ]);
    }
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
  const runBot = async () => {
    if (game) {
      if (game.getMovesLeft().length === 0) {
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
  // #endregion

  return {
    game,
    dice,
    positions,
    pipCount,
    homeCheckers,
    boardRef,
    onMoveChecker,
    startGame,
    showAcceptMoveButton,
    updateMoveIsOver,
    showUndoMoveButton,
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
  };
};
