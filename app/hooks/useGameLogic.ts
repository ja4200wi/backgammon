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

export const useGameLogic = (gameId: string, localPlayerId: string) => {
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
  const [gameOver, setGameOver] = useState({
    gameover: false,
    winner: PLAYER_COLORS.NAP,
  });
  const [gameIsRunning,setGameIsRunning] = useState(false)
  // #region Online Variables
  const [onlineTurns, setOnlineTurns] = useState<OnlineTurn[]>();
  const [whoAmI,setWhoAmI] = useState<PLAYER_COLORS>()
  // #endregion
  const bot = new Bot(BOT_DIFFICULTY.MEDIUM);


  // #region UseEffects
  useEffect(() => {
    console.log('server triggered',gameId)
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
    if((gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY) && game && !gameIsRunning) {
      setGameIsRunning(true)
      setUpGame()
    }
  }, [gamemode,game])

  useEffect(() => {
    if(gamemode === GAME_TYPE.ONLINE && game && onlineTurns && onlineTurns.length > 0 && !gameIsRunning) {
      setGameIsRunning(true)
      console.log('SETTING UP GAME NOW')
      setUpGame()
    }
  }, [gamemode,game,onlineTurns])

  useEffect(() => {
    console.log('I AM:',whoAmI)
  },[whoAmI])
  useEffect(() => {
    if(onlineTurns && onlineTurns.length > 0) {
      runOnline()
    }
  },[onlineTurns])
  // #endregion
  
  // #region game Logic
  const startGame = async (gamemode: GAME_TYPE, newOnlineTurns?:OnlineTurn[]) => {
    if(newOnlineTurns) {
      startOnline(gamemode,newOnlineTurns)
    } else {
      startOffline(gamemode)
    }
  };
  const startOnline = (gamemode: GAME_TYPE, newOnlineTurns?:OnlineTurn[]) => {
      const onlineDice = getOnlineDice(newOnlineTurns!)
      setDice(onlineDice)
      setGameMode(gamemode)
      const startPlayer = onlineDice[0] > onlineDice[1] ? PLAYER_COLORS.WHITE : PLAYER_COLORS.BLACK
      const newGame = new Game(startPlayer,onlineDice)
      setGame(newGame)
  }
  const startOffline = (gamemode: GAME_TYPE) => {
      setGameMode(gamemode);
      const newGame = new Game();
      setGame(newGame);
  }



  const setUpGame = async () => {
    if (game) {
      if(gamemode === GAME_TYPE.ONLINE && onlineTurns) {
        setDice(getOnlineDice(onlineTurns))
        const iAm = await getWhoAmI()
        setWhoAmI(iAm)
      }
      console.log('in setupgame')
      setPositions(game.getCurrentPositions());
      setPipCount(GAME_SETTINGS.startScores);
      setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
      doStartingPhase();
    }
  };
  const doStartingPhase = async () => {
    console.log('in startingphase doing',gamemode)
    if(game && isOfflineGame()) {
      if (game.getDice()[0] > game.getDice()[1]) {
        game.setPlayer(PLAYER_COLORS.WHITE);
        setDice(game.getDice());
        setTimeout(() => setStartingPhase(false), 2250);
      } else {
        game.setPlayer(PLAYER_COLORS.BLACK);
        setDice(game.getDice());
        setTimeout(() => {setStartingPhase(false);runGame()}, 2250);
      }
    } else if (gamemode === GAME_TYPE.ONLINE && game) {
      const iAM =  await getWhoAmI()
      if(iAM === game.getCurrentPlayer()) {
        console.log('WHO AM I in my turn',iAM)
        setTimeout(() => {setStartingPhase(false);}, 2250);
      } else {
        console.log('WHO AM I in not my turn',iAM)
        setTimeout(() => {setStartingPhase(false)}, 2250);
      }
    }
    
  }
  const onMoveChecker = async (
    sourceIndex: number,
    targetIndex: number
  ): Promise<boolean> => {
    if (game) {
      console.log(whoAmI,': is in onMoveChecker')
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
  const runGame = () => {
    if(!gamemode || !game) return
    switch (gamemode) {
      case GAME_TYPE.PASSPLAY:
        break;
      case GAME_TYPE.COMPUTER:
        runBot();
        break;
      case GAME_TYPE.ONLINE:
        console.log(whoAmI,':in rungame type ONLINE')
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
  const switchplayer = async () => {
    console.log(whoAmI,': switching player; Current player:',game?.getCurrentPlayer())
    if (game && !game.isGameOver() && (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY)) {
      game.switchPlayer()
      setDice(game.getDice());
      if (disableScreen) {
        setDisableScreen(false);
      }
      console.log(whoAmI,'in offline switchplayer: checking for legal move')
      await checkForLegalMove(false);
      runGame();
    } else if (game && !game.isGameOver() && gamemode === GAME_TYPE.ONLINE && whoAmI === game.getCurrentPlayer()) {
      console.log(whoAmI,': in online switch; after my turn currentplayer:',game.getCurrentPlayer())
      const turn = game.getTurnAfterMove()
      console.log(whoAmI,': this is the turn I send to the server:',turn)
      const newOnlineDice = await sendTurnToServer(turn) 
      const newLocalDice = transformOnlineDice(newOnlineDice)
      console.log(whoAmI,': sent turn to server and got new dice:',newLocalDice)
      game.onlineSwitchPlayer(newLocalDice)
      setDice(newLocalDice)
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
    } else if(game && !game.isGameOver() && gamemode === GAME_TYPE.ONLINE && whoAmI !== game.getCurrentPlayer() && onlineTurns) {
      console.log(whoAmI,'in switchplayer; not my turn')
      const newdice = getOnlineDice(onlineTurns)
      setDice(newdice)
      game.onlineSwitchPlayer(newdice)
      if (disableScreen) {
        setDisableScreen(false);
      } else {
        setDisableScreen(true);
      }
      const deepCopy = game.deepCopy()
      console.log(whoAmI,'switched player, now it is MY TURN and i have a legal move?:',game.hasLegalMove(),deepCopy.hasLegalMove())
      await checkForLegalMove(false,game);
      //take latest onlineturn and take dice
      //set dice in game and normally
      //switch player
    }
  };
  // #endregion
  
  // #region onlineTurns
  const sendTurnToServer = async (turn: Turn): Promise<OnlineDice> => {
    const turnToSend:SendableTurn = transformLocalTurnToOnlineTurn(turn)
    const nextDice: OnlineDice | null | undefined = await sendTurn(turnToSend);
    if(nextDice === null || nextDice === undefined) {
      return {dieOne: 0, dieTwo:0}
    } else {
      return nextDice
    }
  };
  const isOfflineGame = () => {
    return (gamemode === GAME_TYPE.COMPUTER || gamemode === GAME_TYPE.PASSPLAY)
  }
  const transformLocalTurnToOnlineTurn = (turn:Turn, turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT'):SendableTurn => {
    const moves = []
    while (turn.hasMoves()) {
      const tmpMove = turn.nextMove()
      moves.push({from: tmpMove!.getFrom(), to:tmpMove!.getTo() })
    }
    return {
      gameId: gameId,
      playerId: localPlayerId,
      moves: moves,
      type: turnType? turnType : 'MOVE'
    }
  }
  const transformOnlineTurnToLocalTurn = (turn: OnlineTurn): Turn => {
    if (turn) {
        const tempOnlineMoves = turn.moves;
        const tempLocalMoves: Move[] = [];

        // Iterate over tempOnlineMoves
        while (tempOnlineMoves && tempOnlineMoves.length > 0) {
            const currentMove = tempOnlineMoves.shift(); // Remove the first element from the array

            if (currentMove && currentMove.from !== undefined && currentMove.to !== undefined) {
                // Assuming Move type has properties 'start' and 'end'
                const localMove: Move = new Move(currentMove.from,currentMove.to)
                tempLocalMoves.push(localMove);
            }
        }

        // Return a new Turn object
        return new Turn(tempLocalMoves)
    }

    // Return a default Turn if the input is null or undefined
    return new Turn()
};
const getOnlineDice = (turns:OnlineTurn[]):[number,number] => {
  const latestTurn = turns.at(-1);  
    if(latestTurn)
    if (latestTurn.diceForNextTurn) {
      return transformOnlineDice(latestTurn.diceForNextTurn)
}
return[0,0]
}
const transformOnlineDice = (onlineDice: OnlineDice): [number, number] => {
if (onlineDice) {
  const diceForNextTurn = [
    onlineDice.dieOne ?? 0, 
    onlineDice.dieTwo ?? 0  
  ];
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
    return PLAYER_COLORS.WHITE;
  } else {
    return PLAYER_COLORS.BLACK;
  }
};
const getLatestOnlineTurn = (latestTurn:OnlineTurn[]) => {
  return latestTurn.at(-1); 
}
const runOnline = async () => { 
  const latestTurn = getLatestOnlineTurn(onlineTurns!)
  if(localPlayerId === latestTurn?.playerId) {
    return
  }
  if(latestTurn?.type === 'MOVE' && localPlayerId !== latestTurn?.playerId) {
    const localTurn = transformOnlineTurnToLocalTurn(latestTurn!)
    console.log(whoAmI,': in making latest move to update game; got the turn',localTurn,'from the server')
    makeTurn(localTurn)
    console.log(whoAmI,'CHECKFORLEGAL: runonline')
  } 
}
// #endregion
  
  // #region helper Methods
  const setUpEndBoard = async () => {
    if (game && isOfflineGame()) {
      setPositions(game.getCurrentPositions());
      updateHomeCheckers(game);
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
    } else if(game && whoAmI === game.getCurrentPlayer()) {
      const turn = game!.getTurnAfterMove()
      const newOnlineDice = await sendTurnToServer(turn) 
    }
  };
  const updateGameState = () => {
    if (game) {
      setPositions(game.getCurrentPositions());
      const distances = game.getDistances();
      updatePipCount(distances.distBlack, distances.distWhite);
      updateHomeCheckers(game);
      if(gamemode === GAME_TYPE.ONLINE && whoAmI !== game.getCurrentPlayer()) {
        return
      }
      console.log(whoAmI,'CHECKFORLEGAL: updategamestate')
      checkForLegalMove(true,game);
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
    setGameIsRunning(false)
    setStartingPhase(true);
    setFirstRoll(true);
    setDisableScreen(true);
    setHomeCheckers(GAME_SETTINGS.startHomeCheckerCount);
    setDoubleDice(new DoubleDice());
  };
  const disabledScreen = (currentGame: Game): boolean => {
    if(gamemode === GAME_TYPE.COMPUTER) {
      return currentGame.getCurrentPlayer() === PLAYER_COLORS.BLACK
    } else if(gamemode === GAME_TYPE.ONLINE){
      return whoAmI !== currentGame.getCurrentPlayer()
    }
    return false
  };
  const checkForLegalMove = async (fastSwitch: boolean,currentGame?:Game) => {
    console.log(whoAmI,': checkForLegalMove with currentgame:',currentGame?.getCurrentPlayer())
    if(currentGame && !currentGame.hasLegalMove()) {
      if (fastSwitch) {
        console.log(whoAmI,':no legal move with CURRENTGAME, switching plyer')
        switchplayer();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(whoAmI,':no legal move with CURRENTGAME, switching plyer')
        switchplayer();
      }
    }
    else if (!currentGame && game && !game.hasLegalMove()) {
      console.log(whoAmI,':currentgame is not defined:',currentGame)
      if (fastSwitch) {
        console.log(whoAmI,':no legal move with real game, switching plyer')
        switchplayer();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(whoAmI,':no legal move with real game, switching plyer')
        switchplayer();
      }
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
      console.log('setting first roll false')
      setFirstRoll(false);
    }
    if (game) {
      console.log(whoAmI,':move is over, switching player')
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
  // #endregion
  
  // #region Bot Functions
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
    onlineTurns,
  };
};
