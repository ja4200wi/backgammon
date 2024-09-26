import { generateClient, SelectionSet } from 'aws-amplify/api';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const selectionSet = ['id', 'name', 'createdAt', 'updatedAt'] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

// Get Data
export async function getUserName(): Promise<string> {
  const { username } = await getCurrentUser();
  return username;
}

export async function getPlayerName(playerId: string): Promise<string> {
  const player = await client.models.Player.get({ id: playerId });
  return player.data?.name || 'Unknown';
}

export async function getPlayerInfo(
  playerId: string
): Promise<PlayerInfo | null> {
  const player = await client.models.Player.get(
    { id: playerId },
    {
      selectionSet,
    }
  );
  return player.data;
}

export async function getEmail(): Promise<string> {
  const user = await fetchUserAttributes();
  return user.email || 'Unknown';
}

// Update Data
export async function updatePlayerName(
  playerId: string,
  newName: string
): Promise<void> {
  await client.models.Player.update({ id: playerId, name: newName });
}
