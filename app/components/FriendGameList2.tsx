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
  SentRequest,
} from '../components/misc/SmallComponents';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useUser } from '../utils/UserContent';
import SearchPlayer from '../components/friends/SearchPlayer';
import { Button } from '@rneui/themed';
import StartFriendGame from './StartFriendGame';
import GameListItem from './GameListItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const localPlayerId = userInfo?.id;
  const [games, setGames] = useState<Session[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
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
              isLargePlayButton={true}
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
        title='Start New Game'
        loading={false}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={styles.playButton}
        titleStyle={{ fontWeight: 'bold', fontSize: 24 }}
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
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>
                Pick a Friend to play
              </Text>
              <View style={{ position: 'absolute', right: -10 }}>
                <Button
                  title={'Close'}
                  type='clear'
                  titleStyle={{ fontWeight: '700', color: '#FFF' }}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon name='cancel' size={24} color={'#FFF'} />
                </Button>
              </View>
            </View>
            <StartFriendGame
              closeModal={closeModal}
              localPlayerId={localPlayerId || ''}
            />
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
    marginTop: DIMENSIONS.screenHeight * 0.15,
  },
  modalView: {
    margin: 5,
    width: '95%',
    backgroundColor: APP_COLORS.darkGrey,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', // Center the title
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    position: 'relative', // Required for positioning the button absolutely
  },
  closeButton: {
    color: '#FFF',
  },
  startNewButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    zIndex: 3,
  },
  playButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    height: 60,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  noGamesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
