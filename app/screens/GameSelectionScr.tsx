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
import { Card, Button } from '@rneui/themed';
import {
  APP_COLORS,
  DIMENSIONS,
  ICONS,
  GAME_TYPE,
  BOARD_TYPE,
  BOT_NAMES,
} from '../utils/constants';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { createSession } from '../service/gameService';
import { getUserName } from '../service/profileService';
import AvatarWithPuzzle from '../components/misc/AvatarWithPuzzle';
import { DifficultyDisplay } from '../components/misc/SmallComponents';

const client = generateClient<Schema>();

export default function GameSelectionScr({ navigation }: { navigation: any }) {
  const [selectedMode, setSelectedMode] = useState<GAME_TYPE>(
    GAME_TYPE.FRIENDLIST
  ); // Default selection
  const [selectedBot, setSelectedBot] = useState<BOT_NAMES>(BOT_NAMES.RIANA);
  const handleSelectMode = (mode: GAME_TYPE) => {
    if (selectedMode !== mode) {
      setSelectedMode(mode);
    }
  };
  function EloGameCard({ League, Elo }: { League: string; Elo: number }) {
    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.ELO)}
        disabled={selectedMode === GAME_TYPE.ELO}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.ELO && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.ELO && ICONS.TrophyIcon}
              <Text
                style={[
                  GLOBAL_STYLES.headline,
                  selectedMode !== GAME_TYPE.ELO && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Elo Game
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.ELO && (
            <>
              <View style={styles.cardDetailContainer}>
                <Text style={[GLOBAL_STYLES.lineItems]}>{League}</Text>
                <Text style={GLOBAL_STYLES.lineItems}>{Elo} GP</Text>
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
    );
  }
  function OnlineGameCard({ navigation }: { navigation: any }) {
    const [userName, setUserName] = useState(''); // To store the profile name

    const handleCreateSession = async () => {
      const userName = await getUserName();
      const gameId = await createSession(userName, GAME_TYPE.RANDOM);
      navigation.navigate('OnlineMatching', {
        gameId,
        localPlayerId: userName,
      });
    };

    const listSessions = async () => {
      const userName = await getUserName();
      navigation.navigate('OnlineMatching', { localPlayerId: userName });
    };

    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.RANDOM)}
        disabled={selectedMode === GAME_TYPE.RANDOM}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.RANDOM && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.RANDOM && ICONS.WifiIcon}
              <Text
                style={[
                  GLOBAL_STYLES.headline,
                  selectedMode !== GAME_TYPE.RANDOM && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Friendly Game
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.RANDOM && (
            <>
              <View style={styles.cardDetailContainer}>
                <Text style={GLOBAL_STYLES.lineItems}>
                  No Rankings, Just Fun!
                </Text>
              </View>
              <Button
                title='Start Game'
                buttonStyle={styles.startButton}
                onPress={() => handleCreateSession()}
              />
              <Button
                title='Join Game'
                buttonStyle={styles.startButton}
                onPress={() => listSessions()}
              />
            </>
          )}
        </Card>
      </TouchableOpacity>
    );
  }
  function FriendsGameCard() {
    const playWithFriends = async () => {
      const userName = await getUserName();
      navigation.navigate('PlayFriend', { localPlayerId: userName });
    };
    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.FRIENDLIST)}
        disabled={selectedMode === GAME_TYPE.FRIENDLIST}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.FRIENDLIST && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.FRIENDLIST && ICONS.PeopleIcon}
              <Text
                style={[
                  styles.cardTitle,
                  selectedMode !== GAME_TYPE.FRIENDLIST && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Play a Friend
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.FRIENDLIST && (
            <>
              <View style={styles.cardDetailContainer}>
                <Text style={GLOBAL_STYLES.lineItems}>
                  Invite a friend to play!
                </Text>
              </View>
              <Button
                title='Start Game'
                buttonStyle={styles.startButton}
                onPress={() => playWithFriends()}
              />
            </>
          )}
        </Card>
      </TouchableOpacity>
    );
  }
  function ComputerGameCard() {
    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.COMPUTER)}
        disabled={selectedMode === GAME_TYPE.COMPUTER}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.COMPUTER && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.COMPUTER && ICONS.ComputerIcon}
              <Text
                style={[
                  styles.cardTitle,
                  selectedMode !== GAME_TYPE.COMPUTER && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Play vs. Computer
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.COMPUTER && (
            <>
              <View style={{ flexDirection: 'column' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedBot(BOT_NAMES.RIANA);
                  }}
                  style={styles.robotContainer}
                >
                  <Text style={{ fontSize: 32 }}>{'🧠'}</Text>
                  <Text
                    style={[
                      styles.name,
                      {
                        fontWeight: 700,
                        fontSize: 24,
                        color:
                          selectedBot === BOT_NAMES.RIANA
                            ? APP_COLORS.appGreen
                            : '#FFF',
                      },
                    ]}
                  >
                    Riana
                  </Text>
                  <View style={styles.difficultyContainer}>
                    <DifficultyDisplay level={3} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setSelectedBot(BOT_NAMES.LARRY);
                  }}
                  style={styles.robotContainer}
                >
                  <Text style={{ fontSize: 32 }}>{'🤖'}</Text>
                  <Text
                    style={[
                      styles.name,
                      {
                        fontWeight: 700,
                        fontSize: 24,
                        color:
                          selectedBot === BOT_NAMES.LARRY
                            ? APP_COLORS.appGreen
                            : '#FFF',
                      },
                    ]}
                  >
                    Larry
                  </Text>
                  <View style={styles.difficultyContainer}>
                    <DifficultyDisplay level={1} />
                  </View>
                </TouchableOpacity>
              </View>
              <Button
                title={`Play vs ${selectedBot}`}
                buttonStyle={styles.startButton}
                onPress={() =>
                  navigation.navigate('Game', {
                    gameMode: GAME_TYPE.COMPUTER,
                    botType: selectedBot,
                  })
                }
              />
            </>
          )}
        </Card>
      </TouchableOpacity>
    );
  }
  function PassAndPlayGameCard() {
    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.PASSPLAY)}
        disabled={selectedMode === GAME_TYPE.PASSPLAY}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.PASSPLAY && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.PASSPLAY && ICONS.SwapHorizIcon}
              <Text
                style={[
                  styles.cardTitle,
                  selectedMode !== GAME_TYPE.PASSPLAY && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Pass & Play
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.PASSPLAY && (
            <>
              <View style={styles.cardDetailContainer}>
                <Text style={GLOBAL_STYLES.lineItems}>
                  Play with someone nearby!
                </Text>
              </View>
              <Button
                title='Start Game'
                buttonStyle={styles.startButton}
                onPress={() =>
                  navigation.navigate('Game', { gameMode: GAME_TYPE.PASSPLAY })
                }
              />
            </>
          )}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      {/* Back Button */}
      <HeaderSecondary navigation={navigation} headline='Select Game Mode' />
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        <View style={styles.overlaySquare} />
        {/* Body */}
        <View style={styles.bodyContent}>
          <FriendsGameCard />
          <ComputerGameCard />
          <PassAndPlayGameCard />
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
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: APP_COLORS.headerBackGroundColor,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'flex-start',
    zIndex: 2, // Ensure body content and cards are above overlay
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 15,
    borderColor: APP_COLORS.cardBackgroundColor,
    backgroundColor: APP_COLORS.darkGrey,
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
  cardDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  startButton: {
    marginTop: 8,
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
  robotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  name: {
    marginLeft: 16,
    flexShrink: 1,
  },
  difficultyContainer: {
    marginLeft: 'auto',
  },
});
