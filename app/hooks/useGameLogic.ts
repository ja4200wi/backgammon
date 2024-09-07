import { useState, useEffect } from 'react';
import { Game } from '../gameLogic/backgammon';
import { BOT_DIFFICULTY, GAME_SETTINGS, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Turn } from '../gameLogic/turn';
import { Move } from '../gameLogic/move';
import { custom_resources } from 'aws-cdk-lib';
import { Bot } from '../gameLogic/bot';
import { run } from 'jest';

export const useGameLogic = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [dice, setDice] = useState<number[]>(GAME_SETTINGS.startDice);
  const [isStartingPhase, setStartingPhase] = useState<boolean>(true);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [pipCount, setPipCount] = useState(GAME_SETTINGS.startScores);
  const [firstRoll, setFirstRoll] = useState(true);
  const [lastturn, setLastTurn] = useState<Turn>();
  const [disableScreen, setDisableScreen] = useState<boolean>(false);
  const [gamemode, setGameMode] = useState<GAME_TYPE>(GAME_TYPE.PASSPLAY)
  const [homeCheckers, setHomeCheckers] = useState(
    GAME_SETTINGS.startHomeCheckerCount
  );
const bot = new Bot(BOT_DIFFICULTY.EASY)

  useEffect(() => {
    if(gamemode && game) {
      setUpGame()
    }
  }, [gamemode,game])

  const startGame = async (gamemode: GAME_TYPE) => {
    setGameMode(gamemode)
    const newGame = new Game();
    setGame(newGame);
  };
  const runGame = (currentGame: Game,gamemode: GAME_TYPE) => {
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        break;
      case GAME_TYPE.COMPUTER:
        console.log('in run game; gamemode:',gamemode)
        if(currentGame){
          console.log('in run game, game is not null:')
          if(currentGame.getMovesLeft().length === 0) {
            console.log('not bots turn, switchin players')
            switchplayer(currentGame)
          } else {
            if(currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK) {
              console.log('BOTS turn, doing moves players; Moves Left:',currentGame.getMovesLeft(),'firstroll:',firstRoll)
              setDisableScreen(true)
              setTimeout(() => makeBotMove(currentGame),1000)
            }
          }
        }
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
  }
  const makeBotMove = (game:Game) => {
    const move = bot.makeMove(game)
    console.log('this move is in useGameLogic:',move)
    if(!move) {
      throw new Error('Could not get Move from Bot');
    }
    console.log('go into movechecker')
    onMoveChecker(move.getFrom(),move.getTo())
  }
  const setUpGame = () => {
    if(game) {
      setPositions(game.getCurrentPositions());
      doStartingPhase(game,gamemode);
    }
  }

  const disabledScreen = (currentGame:Game): boolean => {
    return (currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK)
  }

  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
    console.log('in onmovechecker: GAME is',game)
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
  const doStartingPhase = (currentGame: Game,gamemode: GAME_TYPE) => {
    console.log('doing starting phase')
    if (currentGame.getDice()[0] > currentGame.getDice()[1]) {
      currentGame.setPlayer(PLAYER_COLORS.WHITE);
      setDice(currentGame.getDice());
      setTimeout(() => setStartingPhase(false), 2250);
    } else {
      console.log('bot starts')
      currentGame.setPlayer(PLAYER_COLORS.BLACK);
      setDice(currentGame.getDice());
      setTimeout(() => {setStartingPhase(false); console.log('starting phase is over');runGame(currentGame, gamemode)}, 2250);
    }
  }
  const updateGameState = () => {
    if(game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
      checkForLegalMove(game, true);
      if(game.getCurrentPlayer() === PLAYER_COLORS.BLACK) {
        runGame(game,gamemode)
      }
    }
  }
  const checkForLegalMove = async (currentGame: Game, fastSwitch: boolean) => {
    if (!currentGame.hasLegalMove()) {
      if (fastSwitch) {
        switchplayer(currentGame)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        switchplayer(currentGame)
      }
    }
  };
  const switchplayer = async (currentgame: Game) => {
    const turn = currentgame.switchPlayer();
    setLastTurn(turn)
    setDice(currentgame.getDice());
    if(disableScreen) {
      setDisableScreen(false)
    }
    await checkForLegalMove(currentgame, false)
    runGame(currentgame,gamemode)
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
    disabledScreen,
    isStartingPhase,
    firstRoll,
    disableScreen,
  };
};
