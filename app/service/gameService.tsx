import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

type Turn = {
  gameId: string;
  playerId?: string;
  moves: { from: number; to: number }[];
  type: 'MOVE' | 'GIVE_UP' | 'DOUBLE' | 'INIT';
};
type Dice = Schema['Dice']['type'];
const client = generateClient<Schema>();

export async function initGame(gameId: string, userId: string): Promise<void> {
  console.log('initGame:', gameId, userId);
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
}

export async function sendTurn(turn: Turn): Promise<Dice | null | undefined> {
  console.log('sendTurn:', turn);
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

export async function createSession(playerOneId: string): Promise<string> {
  const response = await client.models.Session.create({
    playerOneID: playerOneId,
    playerTwoID: 'EMPTY',
  });
  if (response.data === null) {
    console.error('Failed to create session:', response);
    return 'Fail';
  }
  return response.data.id;
}

export async function joinSession(
  gameId: string,
  playerId: string
): Promise<String> {
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
