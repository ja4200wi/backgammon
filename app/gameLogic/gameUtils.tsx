import { ReactElement } from 'react';
import Checker from '../components/game/Checker';
import {
  APP_COLORS,
  DIMENSIONS,
  GAME_SETTINGS,
  GAME_TYPE,
  PLAYER_COLORS,
} from '../utils/constants';
import { Schema } from '../../amplify/data/resource';
import { Turn } from './turn';
import { Move } from './move';
import { Game } from './backgammon';
import { sendTurn } from '../service/gameService';

type OnlineTurn = Schema['Turns']['type'];

type SendableTurn = {
  gameId: string;
  playerId: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};

type OnlineDice = Schema['Dice']['type'];

export const initializeSpikes = (): ReactElement[][] => {
  return new Array(26).fill(null).map(() => []);
};
export const initializeCheckers = (
  color: PLAYER_COLORS.WHITE | PLAYER_COLORS.BLACK
): ReactElement[] => {
  return new Array(GAME_SETTINGS.checkerCount)
    .fill(null)
    .map((_, index) => (
      <Checker
        key={`${color}-${index}`}
        color={color}
        width={DIMENSIONS.spikeWidth}
        height={DIMENSIONS.spikeWidth}
      />
    ));
};

export const distributeCheckersGame = (spikes: ReactElement[][]) => {
  const startingPositions = GAME_SETTINGS.startingPositions;

  startingPositions.forEach((position) => {
    const { index, color, count } = position;
    for (let i = 0; i < count; i++) {
      if (color === PLAYER_COLORS.WHITE) {
        const checker = whiteCheckers.pop();
        if (checker) spikes[index].push(checker);
      } else {
        const checker = blackCheckers.pop();
        if (checker) spikes[index].push(checker);
      }
    }
  });
};

const whiteCheckers = initializeCheckers(PLAYER_COLORS.WHITE);
const blackCheckers = initializeCheckers(PLAYER_COLORS.BLACK);

//functions

export const getOnlineDice = (
  turns: OnlineTurn[],
  getDiceAt?: number
): [number, number] => {
  const latestTurn =
    typeof getDiceAt === 'number' ? turns[getDiceAt] : turns.at(-1);
  if (latestTurn)
    if (latestTurn.diceForNextTurn) {
      return transformOnlineDice(latestTurn.diceForNextTurn);
    }
  return [0, 0];
};

export const transformOnlineDice = (onlineDice: OnlineDice): [number, number] => {
  if (onlineDice) {
    const diceForNextTurn = [onlineDice.dieOne ?? 0, onlineDice.dieTwo ?? 0];
    return [diceForNextTurn[0], diceForNextTurn[1]];
  }
  return [0, 0];
};

export const pause = async (duration: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const transformLocalTurnToOnlineTurn = (
  turn: Turn,
  gameId: string,
  localPlayerId:string,
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
export const transformOnlineTurnToLocalTurn = (turn: OnlineTurn): Turn => {
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

export const showAcceptMoveButton = (currentGame: Game) => {
  if (currentGame) {
    return !(currentGame.getMovesLeft().length === 0);
  }
  return true;
};
export const showUndoMoveButton = (currentGame: Game) => {
  if (currentGame === null) {
    return true;
  }
  return currentGame.getLastMoves().length === 0;
};

export const getLatestOnlineTurn = (latestTurn: OnlineTurn[]) => {
  return latestTurn.at(-1);
};

const sendTurnToServer = async (
  turn: Turn,
  gameId:string,
  localPlayerId:string,
  turnType?: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT',
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