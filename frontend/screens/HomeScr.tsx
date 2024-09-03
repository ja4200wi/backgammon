import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {Button, Card, Divider} from '@rneui/themed';
import AvatarWithFlag from '../components/AvatarWithFlag';
import AvatarWithPuzzle from '../components/AvatarWithPuzzle';
import { APP_COLORS, DIMENSIONS } from '../utils/constants';
import Header from '../components/Header';
import { GLOBAL_STYLES } from '../utils/globalStyles';

export default function HomeScr({navigation}: {navigation: any}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square for the overlay look */}
        <View style={styles.overlaySquare} />
        {/* User Info Card */}
        <Card containerStyle={[GLOBAL_STYLES.card, {zIndex: 2}]}>
          <View style={styles.userRow}>
            <AvatarWithFlag />
            <Text style={[GLOBAL_STYLES.headline,,{marginLeft: 16}]}>GubiGammer</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={GLOBAL_STYLES.lineItems}>ELO</Text>
            <Text style={GLOBAL_STYLES.lineItems}>1023 GP</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            <Text style={GLOBAL_STYLES.lineItems}>Coins</Text>
            <Text style={GLOBAL_STYLES.lineItems}>325</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            <Text style={GLOBAL_STYLES.lineItems}>Global Ranking</Text>
            <Text style={GLOBAL_STYLES.lineItems}>22354</Text>
          </View>
        </Card>
        {/* Daily Puzzle Card */}
        <Card containerStyle={[GLOBAL_STYLES.card, {zIndex: 2}]}>
          <View style={styles.puzzleRow}>
            <AvatarWithPuzzle />
            <Text style={[GLOBAL_STYLES.headline,,{marginLeft: 16}]}>Daily Puzzle</Text>
          </View>
        </Card>
        {/* Play Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Play"
            loading={false}
            loadingProps={{size: 'small', color: 'white'}}
            buttonStyle={styles.playButton}
            titleStyle={{fontWeight: 'bold', fontSize: 23}}
            onPress={() => navigation.navigate('GameSelection')}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.headerBackGroundColor,
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  puzzleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    color: '#FFF',
    fontSize: 16,
  },
  statsValue: {
    color: '#FFF',
    fontSize: 16,
  },
  divider: {
    backgroundColor: APP_COLORS.iconGrey,
    marginVertical: 4,
  },
  playButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    height: 60,
  },
  buttonContainer: {
    marginTop: 'auto', // Pushes the button to the bottom of the container
    marginBottom: 0, // Adds a 24px margin above the footer
    zIndex: 3, // Ensures the button is above the overlay square
  },
});
