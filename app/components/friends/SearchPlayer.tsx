import { generateClient, SelectionSet } from 'aws-amplify/api';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Schema } from '../../../amplify/data/resource';
import { useUser } from '../../utils/UserContent';
import { SearchBar } from '@rneui/themed';
import { APP_COLORS, COUNTRIES, DIMENSIONS } from '../../utils/constants';
import { ScrollView } from 'react-native-gesture-handler';
import AvatarWithFlag from '../misc/AvatarWithFlag';
import { inviteFriend } from '../../service/friendService';
import { AddFriend } from '../misc/SmallComponents';
import { Divider } from '@rneui/base';

const selectionSetPlayer = ['id', 'name'] as const;
type Player = SelectionSet<Schema['Player']['type'], typeof selectionSetPlayer>;

const client = generateClient<Schema>();

export default function SearchPlayer() {
  const { userInfo } = useUser();
  const localPlayerId = userInfo?.id;
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

  const handleInviteFriend = async (
    localPlayerId: string,
    playerId: string
  ) => {
    await inviteFriend(localPlayerId!, playerId);
    setSearch('');
    setSearchResults([]);
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
          style={{ maxHeight: (DIMENSIONS.screenHeight)* 5 / 9 }}
          showsHorizontalScrollIndicator={false}
        >
          {searchResults.map((player) => {
            return (
              <View>
                <AddFriend
                  key={player.id}
                  friendId={player.id}
                  addFriend={() =>
                    handleInviteFriend(localPlayerId!, player.id)
                  }
                />
              </View>
            );
          })}
        </ScrollView>
      )}
      {searchResults.length > 0 && <Divider color={APP_COLORS.standardGrey} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.backgroundColor,
  },
  containerStyle: {
    backgroundColor: APP_COLORS.backgroundColor,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainerStyle: {
    backgroundColor: APP_COLORS.backgroundColor,
    borderColor: APP_COLORS.standardGrey,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  inputStyle: { color: 'white' },
  scrollStyle: {
    paddingHorizontal: 8, // Ensures the items aren't cut off
    paddingVertical: 16, // Padding for better spacing vertically
  },
  gameItem: {
    alignItems: 'center', // Center content (avatar + text) horizontally
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'transparent',
    padding: 10,
    width: 110, // Adjust to fit the size you want
    height: 110,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gameText: {
    marginTop: 10, // Add spacing between avatar and name
    fontSize: 16,
    color: 'white',
    textAlign: 'center', // Ensure text is centered below avatar
  },
});
