import { generateClient, SelectionSet } from 'aws-amplify/api';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Schema } from '../../amplify/data/resource';
import { getUserName } from '../service/profileService';

const client = generateClient<Schema>();

const selectionSet = ['id', 'userIdOne', 'userIdTwo'] as const;
type Friends = SelectionSet<Schema['Friends']['type'], typeof selectionSet>;

export default function FriendListScreen() {
  const [friends, setFriends] = useState<Friends[]>();

  const fetchFriends = async () => {
    const localUserId = await getUserName();
    const { data: friends, errors } = await client.models.Friends.list({
      filter: {
        or: [
          {
            userIdOne: { eq: localUserId },
          },
          {
            userIdTwo: { eq: localUserId },
          },
        ],
      },
      selectionSet: selectionSet,
    });
    if (errors) {
      console.error(errors);
    } else {
      setFriends(friends);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return <View style={styles.container}></View>;
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
