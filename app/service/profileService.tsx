import { generateClient, SelectionSet } from 'aws-amplify/api';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Schema } from '../../amplify/data/resource';
import { APP_COLORS, COUNTRIES } from '../utils/constants';

const client = generateClient<Schema>();

const selectionSet = [
  'id',
  'name',
  'country',
  'emoji',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

export const getEnumFromKey = (key: string | null | undefined): COUNTRIES => {
  if (key === null || key == undefined) return COUNTRIES.GERMANY;
  const countryEnumValue = Object.entries(COUNTRIES).find(
    ([, value]) => value === key
  )?.[1] as COUNTRIES;
  return countryEnumValue;
};

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

export async function getCountry(playerId: string): Promise<string> {
  const country = await client.models.Player.get({ id: playerId });
  return country.data?.country || 'de';
}

export async function getEmoji(playerId: string): Promise<string> {
  const emoji = await client.models.Player.get({ id: playerId });
  return emoji.data?.emoji || '👤';
}

export async function getColor(playerId: string): Promise<string> {
  const color = await client.models.Player.get({ id: playerId });
  return color.data?.profilePicColor || APP_COLORS.appGreen;
}

// Update Data
export async function updatePlayerName(
  playerId: string,
  newName: string
): Promise<void> {
  await client.models.Player.update({ id: playerId, name: newName });
}

export async function updateCountry(
  playerId: string,
  newCountry: string
): Promise<void> {
  await client.models.Player.update({ id: playerId, country: newCountry });
}

export async function updateEmoji(
  playerId: string,
  newEmoji: string
): Promise<void> {
  const response = await client.models.Player.update({
    id: playerId,
    emoji: newEmoji,
  });
}

export async function updateColor(
  playerId: string,
  newColor: string
): Promise<void> {
  await client.models.Player.update({
    id: playerId,
    profilePicColor: newColor,
  });
}
