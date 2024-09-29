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
import { Button, Card } from '@rneui/themed';
import StartFriendGame from './StartFriendGame';
import GameListItem from './GameListItem';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GLOBAL_STYLES } from '../utils/globalStyles';

const selectionSet = [
  'id',
  'playerOneID',
  'playerTwoID',
  'gameType',
  'isGameStarted',
  'createdAt',
] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;

const client = generateClient<Schema>();

export default function LastGame({ navigation }: { navigation: any }) {
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
        // get last element of items array
        const lastItem = items[items.length - 1];
        setGames([lastItem]);
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
              isLargePlayButton={false}
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
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      {/* Body with Background Image */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'white',
          marginLeft: 12,
        }}
      >
        Last Game
      </Text>
      {renderGameList(games.filter((game) => game.isGameStarted))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: APP_COLORS.headerBackGroundColor,

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
