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
import { APP_COLORS, DIMENSIONS, ICONS, GAME_TYPE } from '../utils/constants';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export default function GameSelectionScr({ navigation }: { navigation: any }) {
  const [selectedMode, setSelectedMode] = useState<GAME_TYPE>(GAME_TYPE.ELO); // Default selection
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

    const fetchUserData = async () => {
      const { username } = await getCurrentUser();
      setUserName(username);
    };
    const createSession = async () => {
      fetchUserData();
      const { errors, data: game } = await client.models.Session.create({
        playerOneID: userName,
        playerTwoID: 'filler',
        gameState: {
          board: [
            { index: 1, color: 'WHITE', count: 2 },
            { index: 6, color: 'BLACK', count: 5 },
            { index: 8, color: 'BLACK', count: 3 },
            { index: 12, color: 'WHITE', count: 5 },
            { index: 13, color: 'BLACK', count: 5 },
            { index: 17, color: 'WHITE', count: 3 },
            { index: 19, color: 'WHITE', count: 5 },
            { index: 24, color: 'BLACK', count: 2 },
          ],
          dice: { dieOne: 1, dieTwo: 2 },
          currentPlayer: 'WHITE',
        },
        turns: [],
      });
      navigation.navigate('Online', { gameId: game!.id });
    };

    const listSessions = () => {
      navigation.navigate('PlayFriend');
    };
    return (
      <TouchableOpacity
        onPress={() => handleSelectMode(GAME_TYPE.ONLINE)}
        disabled={selectedMode === GAME_TYPE.ONLINE}
      >
        <Card
          containerStyle={[
            styles.card,
            selectedMode === GAME_TYPE.ONLINE && styles.selectedCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignContent: 'flex-start' }}>
              {selectedMode !== GAME_TYPE.ONLINE && ICONS.WifiIcon}
              <Text
                style={[
                  GLOBAL_STYLES.headline,
                  selectedMode !== GAME_TYPE.ONLINE && {
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
              >
                Friendly Game
              </Text>
            </View>
          </View>
          {selectedMode === GAME_TYPE.ONLINE && (
            <>
              <View style={styles.cardDetailContainer}>
                <Text style={GLOBAL_STYLES.lineItems}>
                  No Rankings, Just Fun!
                </Text>
              </View>
              <Button
                title='Start Game'
                buttonStyle={styles.startButton}
                onPress={() => createSession()}
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
                onPress={() => console.log('Start Game')}
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
              <View style={styles.cardDetailContainer}>
                <Text style={GLOBAL_STYLES.lineItems}>Challenge the AI!</Text>
              </View>
              <Button
                title='Start Game'
                buttonStyle={styles.startButton}
                onPress={() => navigation.navigate('Game', {gameMode: GAME_TYPE.COMPUTER})}
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
                onPress={() => navigation.navigate('Game', {gameMode: GAME_TYPE.PASSPLAY})}
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
          <EloGameCard Elo={1342} League='Gold League' />
          <OnlineGameCard navigation={navigation} />
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
});
