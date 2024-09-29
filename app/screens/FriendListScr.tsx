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
  AddFriend,
} from '../components/misc/SmallComponents';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useUser } from '../utils/UserContent';
import SearchPlayer from '../components/friends/SearchPlayer';
import { Divider } from '@rneui/base';

const selectionSet = [
  'id',
  'userIdOne',
  'userIdTwo',
  'isConfirmed',
  'createdAt',
] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;

const client = generateClient<Schema>();

export default function FriendList({ navigation }: { navigation: any }) {
  const { userInfo } = useUser();
  const localPlayerId = userInfo?.id;

  const [friends, setFriends] = useState<Friends[]>([]);

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
      },
    });
    return () => sub.unsubscribe();
  }, []);

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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          style={{ zIndex: 2, flex: 1 }}
          alwaysBounceVertical={false}
        >
          <InviteFriend />
          <Headline headline='Friends' />
          <SearchPlayer />
          <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
            {friends
              .filter((friend) => friend.isConfirmed)
              .map((friend) => {
                const friendId =
                  friend.userIdOne === localPlayerId
                    ? friend.userIdTwo
                    : friend.userIdOne;
                if (!friendId) {
                  return null;
                }
                return (
                  <Friend
                    key={friend.id}
                    friendId={friendId}
                    friendshipId={friend.id}
                    extraInfo={friend.createdAt}
                    navigation={navigation}
                  />
                );
              })}
          </View>
          <Headline headline='Open Requests' />
          <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
            {friends
              .filter((friend) => !friend.isConfirmed)
              .map((friend) => {
                const friendId =
                  friend.userIdOne === localPlayerId
                    ? friend.userIdTwo
                    : friend.userIdOne;
                if (!friendId) {
                  return null;
                }
                const didISendRequest = friend.userIdOne === localPlayerId;
                if (didISendRequest) {
                  return (
                    <SentRequest
                      key={friend.id}
                      friendId={friendId}
                      extraInfo={friend.createdAt}
                    />
                  );
                } else {
                  return (
                    <OpenRequest
                      key={friend.id}
                      friendId={friendId}
                      friendshipId={friend.id}
                      extraInfo={friend.createdAt}
                    />
                  );
                }
              })}
          </View>
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
