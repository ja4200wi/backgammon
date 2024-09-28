import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { GAME_TYPE } from '../utils/constants';

type SendableTurn = {
  gameId: string;
  playerId: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};
type Dice = Schema['Dice']['type'];

const client = generateClient<Schema>();

export async function initGame(gameId: string, userId: string): Promise<void> {
  const response = await client.mutations
    .makeTurn({
      gameId,
      userId,
      moves: '[]',
      type: 'INIT',
    })
    .catch((err) => {
      console.error('Error from makeTurn call in initGame: ', err);
      return 'Failed to init game';
    });
  await client.models.Session.update({
    id: gameId,
    isGameStarted: true,
  });
}

export async function saveGameStats(
  gameId: string,
  winnerId: string,
  gameType: GAME_TYPE,
  duration: number,
  numTurns: number,
  bet: number,
  scores: { white: number; black: number },
  doubleDiceValue: number,
  reason: 'GIVE_UP' | 'DOUBLE' | 'TIMEOUT' | 'GAME_OVER'
): Promise<void> {
  let gameTypeConversion: 'ELO' | 'RANDOM' | 'FRIENDLIST' | 'COMPUTER';
  gameTypeConversion = gameType as 'ELO' | 'RANDOM' | 'FRIENDLIST' | 'COMPUTER';
  const response = client.models.SessionStat.create({
    gameId,
    gameType: gameTypeConversion,
    winnerId,
    scores,
    doubleDiceValue,
    duration,
    reason,
    numTurns,
    bet,
  });
}

export async function sendTurn(
  turn: SendableTurn
): Promise<Dice | null | undefined> {
  if (turn.playerId == undefined) {
    console.error('playerId is undefined');
    return null;
  }
  const response = await client.mutations
    .makeTurn({
      gameId: turn.gameId,
      userId: turn.playerId,
      moves: JSON.stringify(turn.moves),
      type: turn.type,
    })
    .catch((err) => {
      console.error('Error from makeTurn call in sendTurn: ', err);
      return null;
    });
  if (response == undefined) {
    console.error('response is undefined');
    return null;
  }
  return response.data;
}

export async function createSession(
  playerOneId: string,
  gameType: 'ELO' | 'RANDOM' | 'FRIENDLIST' | 'COMPUTER',
  playerTwoId?: string
): Promise<string> {
  const response = await client.models.Session.create({
    playerOneID: playerOneId,
    playerTwoID: playerTwoId || 'EMPTY',
    gameType: gameType || 'COMPUTER',
    isGameOver: false,
    isGameStarted: false,
  });
  if (response.data === null) {
    console.error('Failed to create session:', response);
    return 'Fail';
  }
  return response.data.id;
}

export default function endGame(gameId: string): void {
  client.models.Session.update({
    id: gameId,
    isGameOver: true,
  });
}

export async function joinSession(
  gameId: string,
  playerId: string
): Promise<String> {
  await client.models.Session.update({
    id: gameId,
    isGameStarted: true,
  });
  const response = await client.mutations
    .joinGame({
      gameId,
      userId: playerId,
    })
    .catch((err) => {
      console.error('Error from joinGame call in joinSession: ', err);
      return 'Failed to join session';
    });
  return response.toString();
}
