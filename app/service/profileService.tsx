import { generateClient, SelectionSet } from 'aws-amplify/api';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const selectionSet = ['id', 'name', 'createdAt', 'updatedAt'] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

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

export async function getUserNickname(): Promise<string> {
  const { nickname } = await fetchUserAttributes();
  return nickname || getUserName();
}
