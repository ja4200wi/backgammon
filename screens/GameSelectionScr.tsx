import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Card, Icon, Button } from '@rneui/themed';
import { APP_COLORS, DIMENSIONS } from '../utils/constants';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

type GameMode =
  | 'Elo Game'
  | 'Friendly Game'
  | 'Play a Friend'
  | 'Play vs. Computer'
  | 'Pass & Play';

export default function GameSelectionScr({ navigation }: { navigation: any }) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('Elo Game'); // Default selection

  const [userName, setUserName] = useState(''); // To store the profile name

  const fetchUserData = async () => {
    const { username } = await getCurrentUser();
    setUserName(username);
  };

  const createSession = async () => {
    fetchUserData();
    const { errors, data: game } = await client.models.Session.create({
      playerOneID: userName,
      playerTwoID: 'filler',
      gameState:
        '[{ "index": 0, "color": "WHITE", "count": 2 },{ "index": 11, "color": "WHITE", "count": 5 },{ "index": 16, "color": "WHITE", "count": 3 },{ "index": 18, "color": "WHITE", "count": 5 },{ "index": 23, "color": "BLACK", "count": 2 },{ "index": 12, "color": "BLACK", "count": 5 },{ "index": 7, "color": "BLACK", "count": 3 },{ "index": 5, "color": "BLACK", "count": 5 }]',
    });
    if (game?.id !== undefined) {
      navigation.navigate('PlayFriend', { gameId: game?.id });
    }
  };

  const handleSelectMode = (mode: GameMode) => {
    if (selectedMode !== mode) {
      setSelectedMode(mode);
    }
  };

  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      {/* Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon
            name='arrow-back'
            type='material'
            color={APP_COLORS.iconGrey}
            size={28}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Game Mode</Text>
      </View>
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        <View style={styles.overlaySquare} />
        {/* Body */}
        <View style={styles.bodyContent}>
          <TouchableOpacity
            onPress={() => handleSelectMode('Elo Game')}
            disabled={selectedMode === 'Elo Game'}
          >
            <Card
              containerStyle={[
                styles.card,
                selectedMode === 'Elo Game' && styles.selectedCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{ flexDirection: 'row', alignContent: 'flex-start' }}
                >
                  {selectedMode !== 'Elo Game' && (
                    <Icon
                      name='emoji-events'
                      type='material'
                      color='#597FD1'
                      size={24}
                      style={{ marginRight: 16 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedMode !== 'Elo Game' && {
                        fontSize: 20,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Elo Game
                  </Text>
                </View>
              </View>
              {selectedMode === 'Elo Game' && (
                <>
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardSubtitle}>Gold League</Text>
                    <Text style={styles.cardDetail}>1023 GP</Text>
                  </View>
                  <Button
                    title='Start Game'
                    buttonStyle={styles.startButton}
                    onPress={() => console.log('Start Game')}
                  />
                </>
              )}
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectMode('Friendly Game')}
            disabled={selectedMode === 'Friendly Game'}
          >
            <Card
              containerStyle={[
                styles.card,
                selectedMode === 'Friendly Game' && styles.selectedCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{ flexDirection: 'row', alignContent: 'flex-start' }}
                >
                  {selectedMode !== 'Friendly Game' && (
                    <Icon
                      name='wifi'
                      type='material'
                      color='#6B9C41'
                      size={24}
                      style={{ marginRight: 16 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedMode !== 'Friendly Game' && {
                        fontSize: 20,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Friendly Game
                  </Text>
                </View>
              </View>
              {selectedMode === 'Friendly Game' && (
                <>
                  <Text style={styles.cardDetail}>No Rankings, Just Fun!</Text>
                  <Button
                    title='Start Game'
                    buttonStyle={styles.startButton}
                    onPress={() => console.log('Start Game')}
                  />
                </>
              )}
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectMode('Play a Friend')}
            disabled={selectedMode === 'Play a Friend'}
          >
            <Card
              containerStyle={[
                styles.card,
                selectedMode === 'Play a Friend' && styles.selectedCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{ flexDirection: 'row', alignContent: 'flex-start' }}
                >
                  {selectedMode !== 'Play a Friend' && (
                    <Icon
                      name='people'
                      type='material'
                      color='#597FD1'
                      size={24}
                      style={{ marginRight: 16 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedMode !== 'Play a Friend' && {
                        fontSize: 20,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Play a Friend
                  </Text>
                </View>
              </View>
              {selectedMode === 'Play a Friend' && (
                <>
                  <Text style={styles.cardDetail}>
                    Invite a friend to play!
                  </Text>
                  <Button
                    title='Start Game'
                    buttonStyle={styles.startButton}
                    onPress={() => createSession()}
                  />
                </>
              )}
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectMode('Play vs. Computer')}
            disabled={selectedMode === 'Play vs. Computer'}
          >
            <Card
              containerStyle={[
                styles.card,
                selectedMode === 'Play vs. Computer' && styles.selectedCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{ flexDirection: 'row', alignContent: 'flex-start' }}
                >
                  {selectedMode !== 'Play vs. Computer' && (
                    <Icon
                      name='computer'
                      type='material'
                      color='#7E7E7E'
                      size={24}
                      style={{ marginRight: 16 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedMode !== 'Play vs. Computer' && {
                        fontSize: 20,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Play vs. Computer
                  </Text>
                </View>
              </View>
              {selectedMode === 'Play vs. Computer' && (
                <>
                  <Text style={styles.cardDetail}>Challenge the AI!</Text>
                  <Button
                    title='Start Game'
                    buttonStyle={styles.startButton}
                    onPress={() => console.log('Start Game')}
                  />
                </>
              )}
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSelectMode('Pass & Play')}
            disabled={selectedMode === 'Pass & Play'}
          >
            <Card
              containerStyle={[
                styles.card,
                selectedMode === 'Pass & Play' && styles.selectedCard,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{ flexDirection: 'row', alignContent: 'flex-start' }}
                >
                  {selectedMode !== 'Pass & Play' && (
                    <Icon
                      name='swap-horiz'
                      type='material'
                      color='#C7D159'
                      size={24}
                      style={{ marginRight: 16 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      selectedMode !== 'Pass & Play' && {
                        fontSize: 20,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    Pass & Play
                  </Text>
                </View>
              </View>
              {selectedMode === 'Pass & Play' && (
                <>
                  <Text style={styles.cardDetail}>
                    Play with someone nearby!
                  </Text>
                  <Button
                    title='Start Game'
                    buttonStyle={styles.startButton}
                    onPress={() => navigation.navigate('Game')}
                  />
                </>
              )}
            </Card>
          </TouchableOpacity>
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
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Makes the title take up the remaining space
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#312F2C',
    justifyContent: 'space-between',
    zIndex: 2, // Ensure the header is on top of the overlay
  },
  backButton: {
    zIndex: 2,
  },
  overlaySquare: {
    position: 'absolute',
    top: 0,
    left: 0, // Ensure overlay covers the entire screen
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1, // Keep this lower than the body content and cards
  },
  bodyContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    zIndex: 2, // Ensure body content and cards are above overlay
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 15,
    borderColor: '#54504B',
    backgroundColor: '#262522',
    padding: 16,
    marginBottom: 8,
    zIndex: 3, // Ensure cards are above the overlay and other content
    elevation: 0, // Remove elevation on Android
    shadowColor: 'transparent', // Remove shadow color on iOS
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: 24, // Font size for selected cards
    fontWeight: 'bold',
  },
  selectedCard: {
    backgroundColor: APP_COLORS.backgroundColorTransparent, // Slightly different background color when selected
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSubtitle: {
    color: 'gold',
    fontSize: 18,
  },
  cardDetail: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  startButton: {
    marginTop: 10,
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
});
