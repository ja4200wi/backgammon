import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import { APP_COLORS, DIMENSIONS, COUNTRIES } from '../utils/constants';
import Header from '../components/navigation/Header';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Headline,
  InviteFriend,
  OpenRequest,
  Friend,
  SentRequest,
} from '../components/misc/SmallComponents';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useUser } from '../utils/UserContent';
import SearchPlayer from '../components/friends/SearchPlayer';

const selectionSet = ['id', 'userIdOne', 'userIdTwo', 'isConfirmed'] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;

const client = generateClient<Schema>();

export default function FriendList({ navigation }: { navigation: any }) {
  const { user: localPlayerId } = useUser();
  const [hasOpenRequest, setHasOpenRequest] = useState<boolean>(true);
  const [hasSentRequest, setHasSentRequest] = useState<boolean>(true);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        <ScrollView style={{ zIndex: 2 }}>
          <InviteFriend />
          <SearchPlayer />
          {hasOpenRequest && (
            <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
              <Headline headline='Open Requests' />
              <OpenRequest
                nickname={'jacky'}
                extraInfo='sent request 3 days ago'
                country={COUNTRIES.BELGIUM}
              />
            </View>
          )}
          <Headline headline='Friends' />
          <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
            <Friend nickname={'JannProGamerHD'} country={COUNTRIES.MEXICO} />
          </View>
          {hasSentRequest && (
            <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
              <Headline headline='Sent Requests' />
              <SentRequest
                nickname={'captionJizz'}
                country={COUNTRIES.SOUTH_AFRICA}
                extraInfo='sent request 3 days ago'
              />
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: APP_COLORS.backgroundColor,
    flexDirection: 'column',
    zIndex: 2,
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: 'gray',
    marginVertical: 4,
  },
});
