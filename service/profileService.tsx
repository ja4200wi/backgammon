import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export async function getUserName(): Promise<string> {
  const { username } = await getCurrentUser();
  return username;
}

export async function getUserNickname(): Promise<string> {
  const { nickname } = await fetchUserAttributes();
  return nickname || getUserName();
}
