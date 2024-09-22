import { generateClient, SelectionSet } from 'aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Schema } from '../../amplify/data/resource';
import { getUserName } from '../service/profileService';
import { Button, Divider, SearchBar } from '@rneui/themed';

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
  const [friends, setFriends] = useState<Friends[]>();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>();

  useEffect(() => {
    if (!localPlayerId) return;
    const sub = client.models.Friends.observeQuery({
      filter: {
        or: [
          {
            userIdOne: { eq: localPlayerId },
          },
          {
            userIdTwo: { eq: localPlayerId },
          },
        ],
      },
    }).subscribe({
      next: ({ items, isSynced }) => {
        setFriends([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, [localPlayerId]);

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
      console.log(player);
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

  const confirmFriend = async (friendId: string) => {
    await client.models.Friends.update({
      id: friendId,
      isConfirmed: true,
    });
  };

  const removeFriend = async (friendId: string) => {
    await client.models.Friends.delete({ id: friendId });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder='Type Here...'
        onChangeText={handleSearchTyping}
        value={search}
        style={{ borderRadius: 10 }}
      />
      {searchResults?.map((player) => {
        return (
          <View key={player.id} style={styles.gameItem}>
            <Text style={styles.gameText}>{player.name}</Text>
            <Button
              title={'Invite'}
              buttonStyle={styles.inviteButton}
              onPress={() => {
                handleInvite(player.id);
              }}
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
      {friends?.map((friend) => {
        return (
          <View key={friend.id} style={styles.gameItem}>
            <Text style={styles.gameText}>
              {friend.userIdOne === localPlayerId
                ? friend.userIdTwo
                : friend.userIdOne}
            </Text>
            {friend.isConfirmed ? (
              <Button
                title={'Remove'}
                buttonStyle={styles.removeButton}
                onPress={() => removeFriend(friend.id)}
              />
            ) : (
              <Button
                title={'Confirm'}
                buttonStyle={styles.confirmButton}
                onPress={() => confirmFriend(friend.id)}
              />
            )}
          </View>
        );
      })}
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
