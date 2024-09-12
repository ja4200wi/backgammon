import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { Turn } from '../gameLogic/turn';

const client = generateClient<Schema>();

export async function sendTurn(gameId: string, turn: Turn): Promise<void> {}

export async function createSession(playerOneId: string): Promise<string> {
  console.log('Creating session with playerOneId:', playerOneId);
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
  const { errors, data } = await client.mutations.joinGame({
    gameId,
    userId: playerId,
  });
  return 'Success';
}
