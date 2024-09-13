import { useState, useEffect } from 'react';
import { Game } from '../gameLogic/backgammon';
import {
  BOT_DIFFICULTY,
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
import { sendTurn } from '../service/gameService';

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

export const useGameLogic = (gameId: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [isStartingPhase, setStartingPhase] = useState<boolean>(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [pipCount, setPipCount] = useState(GAME_SETTINGS.startScores);
  const [doubleDice, setDoubleDice] = useState<DoubleDice>(new DoubleDice());
  const [firstRoll, setFirstRoll] = useState(true);
  const [lastturn, setLastTurn] = useState<Turn>();
  const [disableScreen, setDisableScreen] = useState<boolean>(false);
  const [gamemode, setGameMode] = useState<GAME_TYPE>(GAME_TYPE.PASSPLAY);
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount
  );
  const [gameOver, setGameOver] = useState({
    gameover: false,
    winner: PLAYER_COLORS.NAP,
  });
  const [onlineTurns, setOnlineTurns] = useState<OnlineTurn[]>();
  const bot = new Bot(BOT_DIFFICULTY.EASY);

  useEffect(() => {
    if (gameId !== undefined || gameId !== null) {
      const sub = client.models.Turns.observeQuery({
        filter: { gameId: { eq: gameId } },
      }).subscribe({
        next: ({ items, isSynced }) => {
          setOnlineTurns(items);
        },
      });

      return () => sub.unsubscribe();
    }
  }, []);

  const sendTurnToServer = async (turnToSend: SendableTurn) => {
    const nextDice: OnlineDice | null | undefined = await sendTurn(turnToSend);
  };

  useEffect(() => {
    if (gamemode && game) {
      setUpGame();
    }
  }, [gamemode, game]);

  const startGame = async (gamemode: GAME_TYPE) => {
    setGameMode(gamemode);
    const newGame = new Game();
    setGame(newGame);
  };
  const setUpGame = () => {
    if (game) {
      setPositions(game.getCurrentPositions());
      setPipCount(GAME_SETTINGS.startScores);
      setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
      doStartingPhase(game, gamemode);
    }
  };
  const doStartingPhase = (currentGame: Game, gamemode: GAME_TYPE) => {
    if (currentGame.getDice()[0] > currentGame.getDice()[1]) {
      currentGame.setPlayer(PLAYER_COLORS.WHITE);
      setDice(currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    } else {
      currentGame.setPlayer(PLAYER_COLORS.BLACK);
      setDice(currentGame.getDice());
      setTimeout(() => {
        setStartingPhase(false);
        runGame(gamemode);
      }, 2250);
    }
  };
  const runGame = (gamemode: GAME_TYPE) => {
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        break;
      case GAME_TYPE.COMPUTER:
        if (game) {
          runBot();
        }
        break;
      case GAME_TYPE.ONLINE:
        // Initialize online game logic here
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
          setUpEndBoard();
        }
        return success;
      } else {
        return success;
      }
    }
    return false;
  };
  const setUpEndBoard = () => {
    if (game) {
      setPositions(game.getCurrentPositions());
      updateHomeCheckers(game);
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
    }
  };
  const updateGameState = () => {
    if (game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
      checkForLegalMove(game, true);
    }
  };
  const isGameOver = (): boolean => {
    if (game) {
      if (game.isGameOver()) {
        const winner = game.whoIsWinner();
        setGameOver({ gameover: true, winner: winner });
        return true;
      }
      return false;
    }
    return false;
  };
  const resetGame = () => {
    setGame(null);
    setStartingPhase(true);
    setFirstRoll(true);
    setDisableScreen(true);
    setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
    setDoubleDice(new DoubleDice());
  };
  const disabledScreen = (currentGame: Game): boolean => {
    return (
      currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK &&
      gamemode === GAME_TYPE.COMPUTER
    );
  };
  const checkForLegalMove = async (currentGame: Game, fastSwitch: boolean) => {
    if (!currentGame.hasLegalMove()) {
      if (fastSwitch) {
        switchplayer(currentGame);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        switchplayer(currentGame);
      }
    }
  };
  const switchplayer = async (currentgame: Game) => {
    if (game && !game.isGameOver()) {
      const turn = currentgame.switchPlayer();
      setLastTurn(turn);
      setDice(currentgame.getDice());
      if (disableScreen) {
        setDisableScreen(false);
      }
      await checkForLegalMove(currentgame, false);
      runGame(gamemode);
    }
  };
  const giveUp = (looser: PLAYER_COLORS) => {
    if (game) {
      game.giveUp(looser);
      const winner =
        looser === PLAYER_COLORS.WHITE
          ? PLAYER_COLORS.BLACK
          : PLAYER_COLORS.WHITE;
      setGameOver({ gameover: true, winner: winner });
      setUpEndBoard();
    }
  };
  const double = () => {
    if (game) {
      const newDoubleDice = game.double();
      setDoubleDice(newDoubleDice);
      console.log('doubled; new double dice:', newDoubleDice);
    }
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
      switchplayer(game);
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
  const undoMove = () => {
    if (game) {
      game.undoMove();
      updateGameState();
    }
  };
  const legalMovesFrom = (from: number): number[] => {
    if (game) {
      return game?.getLegalMovesFrom(from) ?? [];
    } else return [];
  };
  // #region BOT FUNCTIONS
  const runBot = () => {
    if (game) {
      if (game.getMovesLeft().length === 0) {
        setTimeout(() => updateMoveIsOver(), 1000);
      } else {
        if (game.getCurrentPlayer() === PLAYER_COLORS.BLACK) {
          setDisableScreen(true);
          makeBotMove();
        }
      }
    }
  };
  const makeBotMove = async () => {
    if (game) {
      const botTurn = bot.tempTurnEasyBot(game);
      await makeTurn(botTurn);
    }
  };

  const makeTurn = async (turn: Turn) => {
    if (turn.hasMoves()) {
      setTimeout(() => doPlayerTwoMove(turn), 1000);
    } else {
      setTimeout(() => updateMoveIsOver(), 1000);
    }
  };
  const doPlayerTwoMove = async (turn: Turn) => {
    const move = turn.nextMove();
    if (move) {
      await onMoveChecker(move.getFrom(), move.getTo());
      makeTurn(turn);
    }
  };
  // #endregion

  return {
    game,
    dice,
    positions,
    pipCount,
    homeCheckers,
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
  };
};
