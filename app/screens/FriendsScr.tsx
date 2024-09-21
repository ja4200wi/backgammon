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
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import FriendListScreen from '../components/FriendList';

export default function Friends({
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
        <FriendListScreen />
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
