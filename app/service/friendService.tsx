import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { Alert } from 'react-native';

const client = generateClient<Schema>();

export const confirmFriend = async (friendId: string) => {
  await client.models.Friends.update({
    id: friendId,
    isConfirmed: true,
  });
};

export const removeFriend = async (friendId: string) => {
  await client.models.Friends.delete({ id: friendId });
};

export const inviteFriend = async (localPlayerId: string, playerId: string) => {
  // Check if the friendship already exists
  const { data: friends, errors } = await client.models.Friends.list({
    filter: {
      or: [
        {
          and: [
            { userIdOne: { eq: localPlayerId } },
            { userIdTwo: { eq: playerId } },
          ],
        },
        {
          and: [
            { userIdOne: { eq: playerId } },
            { userIdTwo: { eq: localPlayerId } },
          ],
        },
      ],
    },
  });
  if (errors) {
    console.error(errors);
    return;
  }
  if (friends.length > 0) {
    Alert.alert('Friendship already exists');
    return;
  }
  // Prevent befriending yourself
  if (localPlayerId === playerId) {
    Alert.alert('You cannot befriend yourself');
    return;
  }
  await client.models.Friends.create({
    userIdOne: localPlayerId,
    userIdTwo: playerId,
    isConfirmed: false,
  });
};
