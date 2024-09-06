import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

const selectionSet = ['id', 'playerOneID'] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

export default function GameListScreen({ navigation }: { navigation: any }) {
  const [games, setGames] = useState<Session[]>();

  const joinGame = async (gameId: string) => {
    const { userId } = await getCurrentUser();
    const { errors, data } = await client.queries.joinGame({ gameId, userId });
    navigation.navigate('Online', { gameId });
  };

  useEffect(() => {
    const sub = client.models.Session.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setGames([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Session }) => (
    <View className='p-2 mb-1 bg-cardBackgroundColor rounded-lg'>
      <Text className='text-white font-bold'>Player One ID</Text>
      <Text className='text-white'>{item.playerOneID}</Text>
      <Text className='text-white font-bold'>Game ID</Text>
      <Text className='text-white'>{item.id}</Text>
      <Button
        title='Join Game'
        buttonStyle={styles.startButton}
        onPress={() => joinGame(item.id)}
      />
    </View>
  );

  return (
    <View className='flex p-4 z-10 bg-background rounded-lg'>
      {games?.length === 0 ? (
        <Text className='text-white'>No games available.</Text>
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
  startButton: {
    marginTop: 10,
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
});
