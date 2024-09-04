// hooks/useGameLogic.ts
import {useState, useEffect} from 'react';
import {Game} from '../gameLogic/backgammon';
import {GAME_SETTINGS, PLAYER_COLORS} from '../utils/constants';

export const useGameLogic = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [moveIsOver, setMoveIsOver] = useState(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [scores, setScores] = useState(GAME_SETTINGS.startScores);
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount,
  );

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newGame = new Game();
    setGame(newGame);
    setPositions(newGame.getCurrentPositions());
    runGame(newGame);
  };

  const runGame = async (currentGame: Game) => {
    const distances = currentGame.getDistances();
    updateScores(distances.distBlack, distances.distWhite);
    if (currentGame.isGameOver()) return;

    checkForLegalMoveHelper(currentGame);

    if (currentGame.getMovesLeft().length === 0 && moveIsOver) {
      setMoveIsOver(false);
      currentGame.switchPlayer();
      setDice(currentGame.getDice());
      // checks already for next player if a legal moves exists
      checkForLegalMoveHelper(currentGame);
    }
  };

  const checkForLegalMoveHelper = async (game: Game) => {
    if (!game.hasLegalMove()) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      game.switchPlayer();
      setDice(game.getDice());
    }
  };

  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
    if (game) {
      runGame(game);
      const success = game.moveStone(sourceIndex, targetIndex);
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updateScores(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game!);

      return success;
    }
    return false;
  };

  const hasMovesLeft = (currentGame: Game) => {
    if (game === null) {
      return true;
    }
    return !(currentGame.getMovesLeft().length === 0);
  };
  const undoMoveButtonState = (currentGame: Game) => {
    if (game === null) {
      return true;
    }
    return currentGame.getLastMoves().length === 0;
  };

  const updateScores = (distBlack: number, distWhite: number) => {
    setScores([distWhite, distBlack]);
  };
  const updateMoveIsOver = () => {
    setMoveIsOver(true);
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
    game?.undoMove();
    setPositions(game!.getCurrentPositions());
    const distances = game!.getDistances();
    updateScores(distances.distBlack, distances.distWhite);
    updateHomeCheckers(game!);
  };

  const legalMovesFrom = (from: number): number[] => {
    return game?.getLegalMovesFrom(from) ?? [];
  };

  return {
    game,
    dice,
    moveIsOver,
    positions,
    scores,
    homeCheckers,
    onMoveChecker,
    startGame,
    runGame,
    hasMovesLeft,
    updateMoveIsOver,
    undoMoveButtonState,
    undoMove,
    legalMovesFrom,
  };
};