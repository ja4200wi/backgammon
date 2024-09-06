import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export async function getUserName(): Promise<string> {
  const { username } = await getCurrentUser();
  return username;
}

export async function getUserNickname(): Promise<string> {
  const { nickname } = await fetchUserAttributes();
  return nickname || getUserName();
}

export async function getUserJoined(): Promise<string> {
  const userAttributes = await fetchUserAttributes();
  return userAttributes.updated_at || 'Unknown'; //TODO: Change to created_at
}
