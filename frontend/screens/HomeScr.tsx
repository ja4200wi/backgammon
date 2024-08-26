import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import { Button, Card, Icon, Divider } from '@rneui/themed';
import AvatarWithFlag from '../components/AvatarWithFlag';
import AvatarWithPuzzle from '../components/AvatarWithPuzzle';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DIMENSIONS } from '../utils/constants';

export default function HomeScr({navigation}: {navigation: any}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Icon name="people" type="material" color="white" size={30} />
          <Text style={styles.headerText}>Gammon.com</Text>
          <Icon name="settings" type="material" color="white" size={30} />
        </View>
      </View>

      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />

        {/* User Info Card */}
        <Card containerStyle={styles.card}>
          <View style={styles.userRow}>
            <AvatarWithFlag />
            <Text style={styles.username}>GubiGammer</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>ELO</Text>
            <Text style={styles.statsValue}>1023 GP</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>Coins</Text>
            <Text style={styles.statsValue}>325</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>Global Ranking</Text>
            <Text style={styles.statsValue}>22354</Text>
          </View>
        </Card>

        {/* Daily Puzzle Card */}
        <Card containerStyle={styles.card}>
          <View style={styles.puzzleRow}>
            <AvatarWithPuzzle />
            <Text style={styles.username}>Daily Puzzle</Text>
          </View>
        </Card>

        {/* Play Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Play"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={styles.playButton}
            titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
            containerStyle={styles.playButtonContainer}
            onPress={() => navigation.navigate('Game')}
          />
        </View>
      </ImageBackground>

      {/* Bottom Navigation */}
      <View style={styles.footerContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="home" type="material" color="#6B9C41" size={45} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Study')}>
            <Icon name="school" type="material" color="white" size={45} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Friends')}>
            <Icon name="person" type="material" color="white" size={45} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
    zIndex: 1,
  },
  headerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: '#312F2C',
    zIndex: 1,
  },
  bodyContainer: {
    flexGrow: 1, // Allow the body to grow to take up space
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
    zIndex: 2,
  },
  card: {
    borderRadius: 15,
    borderColor: 'transparent',
    backgroundColor: 'rgba(84, 80, 75, 0.9)',
    padding: 16,
    marginBottom: 20,
    zIndex: 3,
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
    zIndex: 3,
  },
  playButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
    height: 60,
  },
  footerContainer: {
    backgroundColor: '#302E2B',
    padding: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#302E2B',
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: 'auto',   // Pushes the button to the bottom of the container
    marginBottom: 0,    // Adds a 24px margin above the footer
    zIndex: 3,           // Ensures the button is above the overlay square
  },
});
