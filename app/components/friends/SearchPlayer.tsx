import { generateClient, SelectionSet } from 'aws-amplify/api';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Schema } from '../../../amplify/data/resource';
import { useUser } from '../../utils/UserContent';
import { Button, SearchBar } from '@rneui/themed';
import { APP_COLORS, COUNTRIES } from '../../utils/constants';
import { ScrollView } from 'react-native-gesture-handler';
import AvatarWithFlag from '../misc/AvatarWithFlag';
import { inviteFriend } from '../../service/friendService';

const selectionSetPlayer = ['id', 'name'] as const;
type Player = SelectionSet<Schema['Player']['type'], typeof selectionSetPlayer>;

const client = generateClient<Schema>();

export default function SearchPlayer() {
  const { userInfo } = useUser();
  const localPlayerId = userInfo?.name;
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [search, setSearch] = useState('');

  const handleSearchTyping = (search: string) => {
    setSearch(search);
    if (search.length > 0) {
      searchPlayers(search);
    } else {
      setSearchResults([]);
    }
  };

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

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder='Type Here...'
        onChangeText={handleSearchTyping}
        value={search}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
      />
      {searchResults.length > 0 && (
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollStyle}
        >
          {searchResults.map((player) => {
            return (
              <View key={player.id} style={styles.gameItem}>
                <Text style={styles.gameText}>{player.name}</Text>
                <Button
                  title={'+'}
                  buttonStyle={styles.inviteButton}
                  onPress={() => inviteFriend(localPlayerId!, player.id)}
                />
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.backgroundColor,
  },
  containerStyle: {
    backgroundColor: APP_COLORS.backgroundColor,
  },
  inputContainerStyle: {
    backgroundColor: APP_COLORS.backgroundColor,
    borderColor: 'white',
    borderBottomWidth: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  inputStyle: { color: 'white' },
  scrollStyle: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    height: 130,
    paddingHorizontal: 8,
  },
  gameItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    height: 50,
    justifyContent: 'space-between',
    padding: 8,
    margin: 6,
    backgroundColor: APP_COLORS.backgroundColor,
    borderRadius: 8,
    shadowColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 1,
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
    color: 'white',
  },
  inviteButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
    padding: 5,
  },
});
