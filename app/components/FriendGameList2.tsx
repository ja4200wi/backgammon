import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
  Modal,
  FlatList,
} from 'react-native';
import { APP_COLORS, DIMENSIONS, COUNTRIES } from '../utils/constants';
import Header from '../components/navigation/Header';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Headline,
  InviteFriend,
  OpenRequest,
  Friend,
  SentRequest,
} from '../components/misc/SmallComponents';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useUser } from '../utils/UserContent';
import SearchPlayer from '../components/friends/SearchPlayer';
import { Button } from '@rneui/themed';
import StartFriendGame from './StartFriendGame';
import GameListItem from './GameListItem';

const selectionSet = [
  'id',
  'playerOneID',
  'playerTwoID',
  'gameType',
  'isGameStarted',
] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

const client = generateClient<Schema>();

export default function FriendList2({ navigation }: { navigation: any }) {
  const { userInfo } = useUser();
  const localPlayerId = userInfo?.name;
  const [games, setGames] = useState<Session[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!localPlayerId) return;
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

  const renderGameList = (gameList: Session[]) => (
    <View style={{ zIndex: 3 }}>
      {gameList.length === 0 ? (
        <Text style={styles.noGamesText}>No games available.</Text>
      ) : (
        <FlatList
          data={gameList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameListItem
              navigation={navigation}
              localPlayerId={localPlayerId || ''}
              item={item}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Body with Background Image */}
      <View>
        <Headline headline='Current Games' />
        {renderGameList(games.filter((game) => game.isGameStarted))}

        <Headline headline='Open Requests' />
        {renderGameList(games.filter((game) => !game.isGameStarted))}
      </View>
      <Button
        title={'Start New Game'}
        buttonStyle={styles.startNewButton}
        onPress={() => setModalVisible(true)}
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
            <StartFriendGame localPlayerId={localPlayerId || ''} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#312F2C',
    zIndex: 3,
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: APP_COLORS.backgroundColor,
    flexDirection: 'column',
    zIndex: 2,
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: 'gray',
    marginVertical: 4,
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
  startNewButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    zIndex: 3,
  },
  noGamesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
