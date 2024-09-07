import { useState, useEffect } from 'react';
import { Game } from '../gameLogic/backgammon';
import { GAME_SETTINGS, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { Move } from '../gameLogic/move';
import { custom_resources } from 'aws-cdk-lib';

export const useGameLogic = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [isStartingPhase, setStartingPhase] = useState<boolean>(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [pipCount, setPipCount] = useState(GAME_SETTINGS.startScores);
  const [firstRoll, setFirstRoll] = useState(true);
  const [lastturn, setLastTurn] = useState<Turn>()
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount
  );

  useEffect(() => {
    //here to make sure moves and turnes are getting updated in time
    console.log('sending lastturn to server:',lastturn)
  }, [lastturn])

  const startGame = (gamemode: GAME_TYPE) => {
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        setUpGame()
        break;
  
      case GAME_TYPE.COMPUTER:
        console.log('Starting Computer Game...');
        // Initialize game against computer logic here
      case GAME_TYPE.ONLINE:
        console.log('Starting Online Game...');
        // Initialize online game logic here
        break;
  
      case GAME_TYPE.FRIENDLIST:
        console.log('Starting FriendList Game...');
        // Initialize game with friends logic here
        break;
  
      case GAME_TYPE.ELO:
        console.log('Starting Elo Game...');
        // Initialize Elo ranked game logic here
        break;
  
      default:
        console.log(`Starting ${gamemode} Game...`);
        break;
    }
  };
  
  const setUpGame = () => {
    const newGame = new Game();
        setGame(newGame);
        setPositions(newGame.getCurrentPositions());
        doStartingPhase(newGame);
  }

  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
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
  const doStartingPhase = (currentGame: Game) => {
    if (currentGame.getDice()[0] > currentGame.getDice()[1]) {
      currentGame.setPlayer(PLAYER_COLORS.WHITE);
      setDice(currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    } else {
      currentGame.setPlayer(PLAYER_COLORS.BLACK);
      setDice(currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    }
  }
  const updateGameState = () => {
    if(game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
      checkForLegalMove(game, true);
    }
  }
  const checkForLegalMove = async (currentGame: Game, fastSwitch: boolean) => {
    if (!currentGame.hasLegalMove()) {
      if (fastSwitch) {
        console.log('No legal move, fastswitching...')
        switchplayer(currentGame)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        switchplayer(currentGame)
      }
    }
  };
  const switchplayer = (currentgame: Game) => {
    console.log('Switching player...safing turn')
    const turn = currentgame.switchPlayer();
    setLastTurn(turn)
    setDice(currentgame.getDice());
    checkForLegalMove(currentgame, false)
  }
  const showAcceptMoveButton = (currentGame: Game) => {
    if(game) {return !(currentGame.getMovesLeft().length === 0);}
    return true
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
    if(game) {
      switchplayer(game)
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
    if(game) {
      game.undoMove();
      updateGameState()
  };
}
  const legalMovesFrom = (from: number): number[] => {
    if(game) {return game?.getLegalMovesFrom(from) ?? [];}
    else return []
  };

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
    isStartingPhase,
    firstRoll,
  };
};
