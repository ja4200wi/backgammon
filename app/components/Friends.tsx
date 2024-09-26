import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Divider, SearchBar } from '@rneui/themed';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import FriendList from './FriendList';

const client = generateClient<Schema>();

const selectionSet = ['id', 'userIdOne', 'userIdTwo', 'isConfirmed'] as const;
const selectionSetPlayer = ['id', 'name'] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;
type Player = SelectionSet<Schema['Player']['type'], typeof selectionSetPlayer>;

export default function FriendListScreen({
  localPlayerId,
}: {
  localPlayerId: string;
}) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);

  const searchPlayers = async (search: string) => {
    const { data: player, errors } = await client.models.Player.list({
      filter: {
        name: {
          contains: search,
        },
      },
      selectionSet: selectionSetPlayer,
    });
    if (errors) {
      console.error(errors);
    } else {
      setSearchResults(player);
    }
  };

  const handleSearchTyping = (search: string) => {
    setSearch(search);
    if (search.length > 0) {
      searchPlayers(search);
    }
  };

  const handleInvite = async (playerId: string) => {
    await client.models.Friends.create({
      userIdOne: localPlayerId,
      userIdTwo: playerId,
      isConfirmed: false,
    });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder='Type Here...'
        onChangeText={handleSearchTyping}
        value={search}
        style={{ borderRadius: 10 }}
      />
      {searchResults.map((player) => {
        return (
          <View key={player.id} style={styles.gameItem}>
            <Text style={styles.gameText}>{player.name}</Text>
            <Button
              title={'Invite'}
              buttonStyle={styles.inviteButton}
              onPress={() => handleInvite(player.id)}
            />
          </View>
        );
      })}
      <Divider
        style={{
          backgroundColor: 'black',
          height: 2,
          marginVertical: 5,
          opacity: 0.5,
        }}
      />
      <FriendList localPlayerId={localPlayerId} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  inviteButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#AA0000',
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
  },
});
