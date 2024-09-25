import { generateClient, SelectionSet } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';

const selectionSet = ['id', 'userIdOne', 'userIdTwo', 'isConfirmed'] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;

const client = generateClient<Schema>();

export default function FriendList({
  localPlayerId,
}: {
  localPlayerId: string;
}) {
  const [friends, setFriends] = useState<Friends[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  const fetchUserNames = async (userIds: (string | null | undefined)[]) => {
    // Filter out null or undefined values
    const validUserIds = userIds.filter(
      (id): id is string => id !== null && id !== undefined
    );

    const nameMapping: { [key: string]: string } = {};
    for (const userId of validUserIds) {
      const { data: player, errors } = await client.models.Player.get({
        id: userId,
      });
      if (errors) {
        console.error(errors);
      } else if (player) {
        // Ensure player.name is a string, use a fallback if it's null or undefined
        nameMapping[userId] = player.name ?? 'Unknown Player';
      }
    }
    setUserNames((prevState) => ({ ...prevState, ...nameMapping }));
  };

  const confirmFriend = async (friendId: string) => {
    // only let second player (the one who was invited) confirm the friendship
    if (
      friends.find((friend) => friend.id === friendId)?.userIdTwo !==
      localPlayerId
    ) {
      return;
    }
    await client.models.Friends.update({
      id: friendId,
      isConfirmed: true,
    });
  };

  const removeFriend = async (friendId: string) => {
    await client.models.Friends.delete({ id: friendId });
  };

  useEffect(() => {
    if (!localPlayerId) return;
    const sub = client.models.Friends.observeQuery({
      filter: {
        or: [
          {
            userIdOne: { eq: localPlayerId },
          },
          {
            userIdTwo: { eq: localPlayerId },
          },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        setFriends([...items]);
        // Fetch user names for all the friends
        const userIds = items
          .flatMap((item) => [item.userIdOne, item.userIdTwo])
          .filter((id) => id !== localPlayerId);

        // Remove duplicates
        const uniqueUserIds = Array.from(new Set(userIds));
        await fetchUserNames(uniqueUserIds);
      },
    });
    return () => sub.unsubscribe();
  }, [localPlayerId]);

  return (
    <View>
      {friends.map((friend) => {
        // Determine the correct friend ID
        const friendId =
          friend.userIdOne === localPlayerId
            ? friend.userIdTwo
            : friend.userIdOne;

        // Check that friendId is not null or undefined before using it
        if (!friendId) {
          return null; // Skip rendering this item if friendId is invalid
        }

        const friendName = userNames[friendId] || 'Unknown Player'; // Fallback to 'Unknown Player' if name is missing

        return (
          <View key={friend.id} style={styles.gameItem}>
            <Text style={styles.gameText}>{friendName}</Text>
            {friend.isConfirmed || friend.userIdOne === localPlayerId ? (
              <Button
                title={'Remove'}
                buttonStyle={styles.removeButton}
                onPress={() => removeFriend(friend.id)}
              />
            ) : (
              <Button
                title={'Confirm'}
                buttonStyle={styles.confirmButton}
                onPress={() => confirmFriend(friend.id)}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    zIndex: 3,
    backgroundColor: '#f5f5f5',
  },
  gameItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gameText: {
    fontSize: 16,
    color: '#333',
  },
  inviteButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#AA0000',
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
});
