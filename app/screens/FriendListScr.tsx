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

type Friend = {
  friend: PlayerInfo;
  friendShip: Friendship;
};

const playerSelectionSet = [
  'id',
  'name',
  'country',
  'emoji',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<
  Schema['Player']['type'],
  typeof playerSelectionSet
>;

const friendshipSelectionSet = [
  'id',
  'userIdOne',
  'userIdTwo',
  'isConfirmed',
  'createdAt',
] as const;
type Friendship = SelectionSet<
  Schema['Friends']['type'],
  typeof friendshipSelectionSet
>;

const client = generateClient<Schema>();

export default function FriendList({ navigation }: { navigation: any }) {
  const { userInfo, friends } = useUser();
  const localPlayerId = userInfo?.id;

  if (friends === null) {
    return <Text>Loading...</Text>;
  }

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
              .filter((friend) => friend.friendShip.isConfirmed)
              .map((friend) => {
                return (
                  <Friend
                    key={friend.friend.id}
                    friendId={friend.friend.id}
                    friendName={friend.friend.name}
                    friendshipId={friend.friendShip.id}
                    friendsSince={friend.friendShip.createdAt}
                    navigation={navigation}
                  />
                );
              })}
          </View>
          <Headline headline='Open Requests' />
          <View style={{ backgroundColor: APP_COLORS.backgroundColor }}>
            {friends
              .filter((friend) => !friend.friendShip.isConfirmed)
              .map((friend) => {
                const didISendRequest =
                  friend.friendShip.userIdOne === localPlayerId;
                if (didISendRequest) {
                  return (
                    <SentRequest
                      key={friend.friend.id}
                      friendId={friend.friend.id}
                      friendName={friend.friend.name}
                      requestSent={friend.friendShip.createdAt}
                    />
                  );
                } else {
                  return (
                    <OpenRequest
                      key={friend.friend.id}
                      friendId={friend.friend.id}
                      friendName={friend.friend.name}
                      friendshipId={friend.friendShip.id}
                      requestSent={friend.friendShip.createdAt}
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
