import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { Card, Icon, Button, Tooltip } from '@rneui/themed';
import { DIMENSIONS } from '../utils/constants';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Friends from '../images/group.svg';

export default function Profile({navigation}: {navigation: any}) {
  return(
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}>
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        </ImageBackground>

<NavBar navigation={navigation} />
</SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
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
