import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import { DIMENSIONS } from '../utils/constants';
import GameListScreen from '../components/GameList';
import HeaderSecondary from '../components/HeaderSecondary';
import { generateClient } from '@aws-amplify/api';
import { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

export default function PlayFriend({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const gameId = route?.params?.gameId;

  const deleteSession = async () => {
    const toBeDeletedSession = {
      id: gameId,
    };
    const { data: deletedTodo, errors } = await client.models.Session.delete(
      toBeDeletedSession
    );
    if (errors) {
      console.error('Error deleting session:', errors);
    } else {
      console.log('Deleted session:', deletedTodo);
    }
  };

  useEffect(() => {
    // Listen to the 'blur' event to detect when the screen is no longer active
    const unsubscribe = navigation.addListener('blur', () => {
      // Delete session when the screen is unfocused (when the user navigates away)
      deleteSession();
    });

    return unsubscribe; // Cleanup listener on component unmount
  }, [navigation, gameId]);

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
        <Text style={{ color: 'white', zIndex: 3 }}>
          Game ID:{'\n'}
          {gameId}
        </Text>
        <GameListScreen />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
    color: '#FFFFFF',
    zIndex: 3,
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
});
