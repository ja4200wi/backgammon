import { generateClient, SelectionSet } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { createSession } from '../service/gameService';
import AvatarWithFlag from './misc/AvatarWithFlag';
import { APP_COLORS, COUNTRIES } from '../utils/constants';
import IngameAvatarWithFlag from './game/IngameAvatarWithFlag';

const selectionSet = ['id', 'userIdOne', 'userIdTwo', 'isConfirmed'] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;

const client = generateClient<Schema>();
export async function createGameWithFriend(
  userIdOne: string,
  friendId: string
) {
  // look if games with this player already exist
  const { data: sessions, errors } = await client.models.Session.list({
    filter: {
      or: [
        {
          and: [
            { playerOneID: { eq: friendId } },
            { isGameOver: { eq: false } },
          ],
        },
        {
          and: [
            { playerTwoID: { eq: friendId } },
            { isGameOver: { eq: false } },
          ],
        },
      ],
    },
  });

  if (sessions?.length > 0) {
    // game already exists
    Alert.alert('Game already exists');
    return false;
  }

  createSession(userIdOne, 'FRIENDLIST', friendId);
  return true;
}
export default function StartFriendGame({
  localPlayerId,
  closeModal,
}: {
  localPlayerId: string;
  closeModal: () => void;
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

        if (!friend.isConfirmed) {
          return null; // Skip rendering this item if friend is not confirmed
        }

        const friendName = userNames[friendId] || 'Unknown Player'; // Fallback to 'Unknown Player' if name is missing

        return (
          <View key={friend.id} style={styles.gameItem}>
            <AvatarWithFlag
              flagSize={12}
              playerId={friendId}
              size={48}
              fontSize={16}
            />
            <Text style={styles.gameText}>{friendName}</Text>
            <Button
              title={'Play'}
              buttonStyle={styles.confirmButton}
              titleStyle={{ fontWeight: '700' }}
              style={{ alignContent: 'flex-end' }}
              onPress={async () => {
                const success = await createGameWithFriend(
                  localPlayerId,
                  friendId
                );
                if (success === true) {
                  closeModal();
                }
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  gameItem: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: APP_COLORS.backgroundColor,
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
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 16,
    flex: 1, // This ensures the text takes up available space
  },
  confirmButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    flexShrink: 0, // Ensure the button doesn't shrink
  },
});
