import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import { DIMENSIONS, GAME_TYPE } from '../utils/constants';
import GameListScreen from '../components/GameList';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { initGame } from '../service/gameService';

const client = generateClient<Schema>();

type Session = Schema['Session']['type'];

export default function OnlineMatching({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { gameId, localPlayerId, whoAmI } = route.params;
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(
    gameId !== undefined
  );

  useEffect(() => {
    if (gameId !== null && gameId !== undefined) {
      const sub = client.models.Session.observeQuery({
        filter: { id: { eq: gameId } },
      }).subscribe({
        next: ({ items, isSynced }) => {
          if (items[0]?.playerTwoID !== 'EMPTY') {
            setIsWaitingForOpponent(false);
            initGame(gameId, items[0]!.playerOneID!);
            console.log('Game started', localPlayerId);
            navigation.navigate('Game', {
              gameId,
              localPlayerId: localPlayerId,
              gameMode: GAME_TYPE.ONLINE,
              whoAmI: whoAmI,
            });
          }
        },
      });
      return () => sub.unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <HeaderSecondary navigation={navigation} headline='Play with a Friend' />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        {isWaitingForOpponent ? (
          <View
            style={{
              backgroundColor: 'white',
              zIndex: 3,
              borderRadius: 5,
              paddingVertical: 4,
              paddingHorizontal: 1,
            }}
          >
            <Text>Game ID: {gameId}</Text>
            <Text>Waiting for opponent...</Text>
          </View>
        ) : (
          <GameListScreen navigation={navigation} />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
    zIndex: 3,
  },
  bodyContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
});
