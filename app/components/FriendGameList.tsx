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

const client = generateClient<Schema>();

const selectionSet = ['id', 'playerOneID', 'playerTwoID', 'gameType'] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

interface TurnInfo {
  player: string;
  date: string;
}

export default function FriendGameList({
  navigation,
  localPlayerId,
}: {
  navigation: any;
  localPlayerId: string;
}) {
  const [games, setGames] = useState<Session[]>();
  const [modalVisible, setModalVisible] = useState(false);

  const [lastTurns, setLastTurns] = useState<{ [key: string]: TurnInfo }>({});

  const fetchLastTurns = async (sessionIds: (string | null | undefined)[]) => {
    // Filter out null or undefined values
    const validGameIds = sessionIds.filter(
      (id): id is string => id !== null && id !== undefined
    );

    const gameMapping: { [key: string]: TurnInfo } = {};
    for (const gameId of validGameIds) {
      const { data: allTurns, errors: allErrors } =
        await client.models.Turns.list({ filter: { gameId: { eq: gameId } } });
      if (allErrors) {
        console.error(allErrors);
      }
      const numTurns = allTurns?.length ?? 0;
      if (numTurns === 0) {
        gameMapping[gameId] = {
          player: 'Unknown Player',
          date: 'Unknown Date',
        };
        continue;
      }
      if (numTurns === 1) {
        gameMapping[gameId] = {
          player: 'Game started',
          date: allTurns[0].createdAt,
        };
        continue;
      }
      const { data: turn, errors } = await client.models.Turns.get({
        gameId: gameId,
        turnNumber: numTurns - 1,
      });
      if (errors) {
        console.error(errors);
      } else if (turn) {
        // Ensure player.name is a string, use a fallback if it's null or undefined
        gameMapping[gameId] = {
          player:
            ((await fetchPlayerName(turn.playerId!)) as string) ??
            'Unknown Player',
          date: turn.createdAt,
        };
      }
    }
    setLastTurns((prevState) => ({ ...prevState, ...gameMapping }));
  };

  const joinGame = async (gameId: string) => {
    const { userId } = await getCurrentUser();
    const { errors, data } = await client.mutations.joinGame({
      gameId,
      userId,
    });
    navigation.navigate('Game', {
      gameId,
      localPlayerId: userId,
      gameMode: GAME_TYPE.ONLINE,
    });
  };

  const fetchPlayerName = async (playerId: string): Promise<String> => {
    return await getPlayerName(playerId);
  };

  useEffect(() => {
    const sub = client.models.Session.observeQuery({
      filter: {
        or: [
          {
            and: [
              { playerOneID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
            ],
          },
          {
            and: [
              { playerTwoID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
            ],
          },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        setGames([...items]);
        await fetchLastTurns(items.map((item) => item.id));
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const PlayerNameText = ({
    playerId,
  }: {
    playerId: string | null | undefined;
  }) => {
    const [playerName, setPlayerName] = useState<String>('');

    useEffect(() => {
      const fetchName = async () => {
        if (playerId === null || playerId === undefined) {
          setPlayerName('');
        } else {
          const name = await fetchPlayerName(playerId);
          setPlayerName(name);
        }
      };

      fetchName();
    }, [playerId]);

    return (
      <Text style={styles.gameText}>
        Play against{' '}
        <Text style={{ fontWeight: 'bold' }}>{playerName || ''}</Text>
      </Text>
    );
  };

  const renderItem = ({ item }: { item: Session }) => {
    const turnInfo = lastTurns[item.id]; // Get the object containing player and date
    const hasGameStarted = turnInfo && turnInfo.player !== 'Unknown Player';
    const isPlayerOne = item.playerOneID === localPlayerId;
    const buttonTitle = hasGameStarted ? 'Continue' : 'Start Game';
    // disable button if playerOne and game has not started yet
    const disabled = !hasGameStarted && isPlayerOne;
    return (
      <View style={styles.gameItem}>
        <Text style={styles.gameText}>
          {/* Display the player name */}
          {localPlayerId === item.playerOneID ? (
            <PlayerNameText playerId={item.playerTwoID} />
          ) : (
            <PlayerNameText playerId={item.playerOneID} />
          )}
        </Text>
        <Text>
          Last Move:{' '}
          {turnInfo ? `${turnInfo.player} on ${turnInfo.date}` : 'Loading...'}
        </Text>
        {/* Join button */}
        <Button
          title={buttonTitle}
          buttonStyle={
            hasGameStarted ? styles.continueButton : styles.startButton
          }
          disabled={disabled}
          onPress={() => joinGame(item.id)}
        />
      </View>
    );
  };

  const handleStartGameWithFriend = () => async () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {games?.length === 0 ? (
        <Text style={styles.noGamesText}>No games available.</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item, index) => index.toString()} // Assuming `id` is a unique key for each game
          renderItem={renderItem}
        />
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
});
