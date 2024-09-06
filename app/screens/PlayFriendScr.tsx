import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { DIMENSIONS } from '../utils/constants';
import GameListScreen from '../components/GameList';
import HeaderSecondary from '../components/navigation/HeaderSecondary';

export default function PlayFriend({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
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
        <GameListScreen navigation={navigation} />
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
