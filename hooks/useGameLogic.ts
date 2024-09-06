import { useState, useEffect } from 'react';
import { Game } from '../gameLogic/backgammon';
import { GAME_SETTINGS, PLAYER_COLORS } from '../utils/constants';
import { custom_resources } from 'aws-cdk-lib';

export const useGameLogic = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [isStartingPhase, setStartingPhase] = useState<boolean>(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [pipCount, setPipCount] = useState(GAME_SETTINGS.startScores);
  const [firstRoll, setFirstRoll] = useState(true);
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount
  );

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newGame = new Game();
    setGame(newGame);
    setPositions(newGame.getCurrentPositions());
    console.log('Game started:');
    doStartingPhase(newGame)
  };

  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
    console.log('Attempting to move checker from', sourceIndex, 'to', targetIndex);
    if (game) {
      const success = game.moveStone(sourceIndex, targetIndex);
      if(success) {
        updateGameState()
        return success
      } else {
        return success
      }
    }
    return false;
  };
  const updateGameState = () => {
    if(game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
      checkForLegalMove(game, true);
    }
  }

  const doStartingPhase = (currentGame: Game) => {
    if (currentGame.getDice()[0] > currentGame.getDice()[1]) {
      currentGame.setPlayer(PLAYER_COLORS.WHITE);
      setDice(currentGame.getDice());
      console.log('White starts, dice:', currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    } else {
      currentGame.setPlayer(PLAYER_COLORS.BLACK);
      setDice(currentGame.getDice());
      console.log('Black starts, dice:', currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    }
  }
  const checkForLegalMove = async (currentGame: Game, fastSwitch: boolean) => {
    console.log('Checking for legal moves');
    if (!currentGame.hasLegalMove()) {
      console.log('No legal moves, switching player');
      if (fastSwitch) {
        switchplayer(currentGame)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        switchplayer(currentGame)
      }
    }
  };
  const switchplayer = (currentgame: Game) => {
    currentgame.switchPlayer();
    setDice(currentgame.getDice());
    checkForLegalMove(currentgame, true)
  }

  const hasMovesLeft = (currentGame: Game) => {
    console.log('Checking if moves left');
    if (game === null) {
      return true;
    }
    return !(currentGame.getMovesLeft().length === 0);
  };

  const undoMoveButtonState = (currentGame: Game) => {
    console.log('Checking undo button state');
    if (game === null) {
      return true;
    }
    return currentGame.getLastMoves().length === 0;
  };

  const updatePipCount = (distBlack: number, distWhite: number) => {
    console.log('Updating pipCount, Black:', distBlack, 'White:', distWhite);
    setPipCount([distWhite, distBlack]);
  };

  const updateMoveIsOver = () => {
    console.log('Updating move is over');
    if (firstRoll) {
      setFirstRoll(false);
    }
    if(game) {switchplayer(game)}
  };

  const updateHomeCheckers = (game: Game) => {
    if (game) {
      console.log('Updating home checkers');
      setHomeCheckers([
        game.getHomeCheckers(PLAYER_COLORS.WHITE),
        game.getHomeCheckers(PLAYER_COLORS.BLACK),
      ]);
    }
  };

  const undoMove = () => {
    console.log('Undoing move');
    game?.undoMove();
    setPositions(game!.getCurrentPositions());
    const distances = game!.getDistances();
    updatePipCount(distances.distBlack, distances.distWhite);
    updateHomeCheckers(game!);
  };

  const legalMovesFrom = (from: number): number[] => {
    console.log('Getting legal moves from', from);
    return game?.getLegalMovesFrom(from) ?? [];
  };

  return {
    game,
    dice,
    positions,
    pipCount,
    homeCheckers,
    onMoveChecker,
    startGame,
    hasMovesLeft,
    updateMoveIsOver,
    undoMoveButtonState,
    undoMove,
    legalMovesFrom,
    isStartingPhase,
    firstRoll,
  };
};
