import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { getCurrentUser } from 'aws-amplify/auth';
import { GAME_TYPE } from '../utils/constants';
import { getPlayerName } from '../service/profileService';

const client = generateClient<Schema>();

const selectionSet = ['id', 'playerOneID'] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

export default function GameListScreen({ navigation }: { navigation: any }) {
  const [games, setGames] = useState<Session[]>();

  const joinGame = async (gameId: string) => {
    const { userId } = await getCurrentUser();
    const { errors, data } = await client.mutations.joinGame({
      gameId,
      userId,
    });
    console.log('joinGame:', userId);
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
    const sub = client.models.Session.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setGames([...items]);
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
      <Text style={styles.gameText}>Player One ID: {playerName || ''}</Text>
    );
  };

  const renderItem = ({ item }: { item: Session }) => (
    <View style={styles.gameItem}>
      <Text style={styles.gameText}>
        <PlayerNameText playerId={item.playerOneID} />
      </Text>
      <Text style={styles.gameText}>Game ID: {item.id}</Text>
      {/* Join button */}
      <Button
        title='Join Game'
        buttonStyle={styles.startButton}
        onPress={() => joinGame(item.id)}
      />
    </View>
  );

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
    padding: 16,
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
  startButton: {
    marginTop: 10,
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
});
