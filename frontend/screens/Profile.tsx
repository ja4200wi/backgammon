import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import { Button, Card, Icon, Divider } from '@rneui/themed';
import AvatarWithFlag from '../components/AvatarWithFlag';
import AvatarWithPuzzle from '../components/AvatarWithPuzzle';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DIMENSIONS } from '../utils/constants';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { GLOBAL_STYLES } from '../utils/globalStyles';


export default function Profile({navigation}: {navigation: any}) {
    return(
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
    </ImageBackground>
    <NavBar navigation={navigation} selectedScreen='Profile'/>
    </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#312F2C',
    },
    headerContainer: {
      paddingRight: 16,
      paddingLeft: 16,
      backgroundColor: '#312F2C',
      zIndex: 2
    },
    bodyContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    headerText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    overlaySquare: {
      position: 'absolute',
      width: DIMENSIONS.screenWidth,
      height: DIMENSIONS.screenHeight,
      backgroundColor: 'rgba(48, 46, 43, .9)',
      zIndex: 1,
    },
    card: {
      borderRadius: 15,
      borderColor: 'transparent',
      backgroundColor: 'rgba(84, 80, 75, 0.9)',
      padding: 16,
      marginBottom: 20,
      zIndex: 2,
      elevation: 0, // Remove elevation on Android
      shadowColor: 'transparent', // Remove shadow color on iOS
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    puzzleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      color: 'white',
      fontSize: 24,
      fontWeight: '500',
      marginLeft: 16,
      flex: 1,
      fontFamily: 'Roboto-Regular',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statsText: {
      color: 'white',
      fontSize: 16,
    },
    statsValue: {
      color: '#FFF',
      fontSize: 16,
    },
    divider: {
      backgroundColor: 'gray',
      marginVertical: 4,
    },
    playButtonContainer: {
      marginTop: 'auto', // Push the button to the bottom of the container
      marginBottom: 24, // Add margin above the footer
      zIndex: 2,
    },
    playButton: {
      backgroundColor: '#6B9C41',
      borderRadius: 5,
      height: 60,
    },
    buttonContainer: {
      marginTop: 'auto',   // Pushes the button to the bottom of the container
      marginBottom: 0,    // Adds a 24px margin above the footer
      zIndex: 2,           // Ensures the button is above the overlay square
    },
  });
  