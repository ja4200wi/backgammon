import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { getCurrentUser } from 'aws-amplify/auth';
import { APP_COLORS, GAME_TYPE } from '../utils/constants';
import { getPlayerName } from '../service/profileService';
import StartFriendGame from './StartFriendGame';
import { initGame } from '../service/gameService';
import GameListItem from './GameListItem';

const client = generateClient<Schema>();

const selectionSet = [
  'id',
  'playerOneID',
  'playerTwoID',
  'gameType',
  'isGameStarted',
] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

export default function FriendGameList({
  navigation,
  localPlayerId,
}: {
  navigation: any;
  localPlayerId: string;
}) {
  const [games, setGames] = useState<Session[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const sub = client.models.Session.observeQuery({
      filter: {
        or: [
          {
            and: [
              { playerOneID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
          {
            and: [
              { playerTwoID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        setGames([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const renderGameList = (gameList: Session[], title: string) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.listTitle}>{title}</Text>
      {gameList.length === 0 ? (
        <Text style={styles.noGamesText}>No games available.</Text>
      ) : (
        <FlatList
          data={gameList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameListItem
              navigation={navigation}
              localPlayerId={localPlayerId}
              item={item}
            />
          )}
        />
      )}
    </View>
  );

  const handleStartGameWithFriend = () => async () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {renderGameList(
        games.filter((game) => game.isGameStarted),
        'Current Games'
      )}
      {renderGameList(
        games.filter((game) => !game.isGameStarted),
        'Open requests '
      )}
      <Button
        title={'Start New Game'}
        buttonStyle={styles.startNewButton}
        onPress={handleStartGameWithFriend()}
      />
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Pick a Friend to play
              </Text>
              <Button
                title={'X'}
                buttonStyle={styles.closeButton}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <StartFriendGame localPlayerId={localPlayerId} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    zIndex: 3,
    backgroundColor: '#f5f5f5',
  },
  gameItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gameText: {
    fontSize: 16,
    color: '#333',
  },
  noGamesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startNewButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: APP_COLORS.appBlue,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 120,
  },
  modalView: {
    margin: 5,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'darkred',
    color: 'black',
    padding: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
