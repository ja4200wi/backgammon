import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
  Modal,
} from 'react-native';
import { APP_COLORS, DIMENSIONS, ICONS, GAME_TYPE } from '../utils/constants';
import Header from '../components/navigation/Header';
import AvatarWithFlag from '../components/misc/AvatarWithFlag';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import {
  getEnumFromKey,
  getPlayerName,
  getUserName,
} from '../service/profileService';
import EditProfileForm from '../components/profile/EditProfileForm';
import { useUser } from '../utils/UserContent';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function UserProfile() {
  const { userInfo } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.content, { padding: 16 }]}>
      <View style={styles.userRow}>
        <AvatarWithFlag playerId={userInfo?.id!} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 16,
          }}
        >
          <Text style={[GLOBAL_STYLES.headline]}>{userInfo?.name}</Text>
          <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
            Joined {new Date(userInfo?.createdAt!).toLocaleDateString()}
          </Text>
        </View>
        <Icon
          name='edit'
          color={APP_COLORS.iconGrey}
          size={24}
          style={{ marginLeft: 'auto' }}
          onPress={() => setModalVisible(true)}
        />
      </View>
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
            {/* Pass setModalVisible as a prop to close the modal */}
            <EditProfileForm onSubmit={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Headline({ headline }: { headline: string }) {
  return (
    <View style={{ backgroundColor: APP_COLORS.darkGrey, zIndex: 2 }}>
      <Text
        style={[
          GLOBAL_STYLES.headline,
          { marginLeft: 16, paddingBottom: 8, paddingTop: 8 },
        ]}
      >
        {headline}
      </Text>
    </View>
  );
}
function HistoryLineItem({
  GameType,
  Opponent,
  Win,
}: {
  GameType: GAME_TYPE;
  Opponent: string;
  Win: boolean;
}) {
  const [opponentUserName, setOpponentUserName] = useState<string>('');

  const updateOpponentUserName = async () => {
    const username = await getPlayerName(Opponent);
    setOpponentUserName(username);
  };

  useEffect(() => {
    updateOpponentUserName();
  }, []);
  // Determine which icon to show based on the GameType
  const renderIcon = () => {
    switch (GameType) {
      case GAME_TYPE.ELO:
        return ICONS.TrophyIcon;
      case GAME_TYPE.RANDOM:
        return ICONS.WifiIcon;
      case GAME_TYPE.FRIENDLIST:
        return ICONS.PeopleIcon;
      case GAME_TYPE.COMPUTER:
        return ICONS.ComputerIcon;
      case GAME_TYPE.PASSPLAY:
        return ICONS.SwapHorizIcon;
      default:
        return null; // or a default icon
    }
  };

  return (
    <View style={[styles.content]}>
      <View
        style={[
          GLOBAL_STYLES.rowLineItems,
          { marginLeft: 16, marginRight: 16, paddingTop: 8 },
        ]}
      >
        {renderIcon()}
        <Text style={GLOBAL_STYLES.lineItems}>{opponentUserName}</Text>
        <Icon
          name='circle'
          color={Win ? APP_COLORS.appGreen : APP_COLORS.appRed}
          size={24}
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </View>
  );
}

function ProfileContent({}: {}) {
  const { userInfo } = useUser();
  const [gameHistory, setGameHistory] = useState<HistoryGame[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [winByGiveUp, setWinByGiveUp] = useState(0);
  const [lossByGiveUp, setlossByGiveUp] = useState(0);
  const [favoriteOpp, setFavoriteOpp] = useState('');
  useEffect(() => {
    const sub = client.models.SessionStat.observeQuery().subscribe({
      next: async ({ items, isSynced }) => {
        setGameHistory([...items]);
        setGamesPlayed(items.length);
        setWins(items.filter((game) => game.winnerId === userInfo?.id).length);
        setWinByGiveUp(
          items.filter(
            (game) =>
              game.reason === 'GIVE_UP' && game.winnerId === userInfo?.id
          ).length
        );
        setlossByGiveUp(
          items.filter(
            (game) => game.reason === 'GIVE_UP' && game.loserId === userInfo?.id
          ).length
        );
        setFavoriteOpp(await getPlayerName(getMostOftenId(items)));
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const getMostOftenId = (items: HistoryGame[]): string => {
    const ids = items.map((game) => game.winnerId);
    const counts: Record<string, number> = {};
    let compare = 0;
    let mostFrequent: string | undefined;

    for (let i = 0, len = ids.length; i < len; i++) {
      const id = ids[i];
      if (id == null) {
        continue;
      }
      if (counts[id] === undefined) {
        counts[id] = 1;
      } else {
        counts[id] = counts[id] + 1;
      }

      if (counts[id] > compare) {
        compare = counts[id];
        mostFrequent = id;
      }
    }
    return mostFrequent || '';
  };

  return (
    <View style={[styles.content, { padding: 16 }]}>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Games Played</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{gamesPlayed}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Wins</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{wins}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Games won via GIVE UP</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{winByGiveUp}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Games lost via GIVE UP</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{lossByGiveUp}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Most games against</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{favoriteOpp}</Text>
      </View>
    </View>
  );
}

const selectionSet = [
  'gameId',
  'gameType',
  'winnerId',
  'loserId',
  'reason',
] as const;
type HistoryGame = SelectionSet<
  Schema['SessionStat']['type'],
  typeof selectionSet
>;

const client = generateClient<Schema>();

function HistoryContent() {
  const { userInfo } = useUser();
  const [history, setHistory] = useState<HistoryGame[]>([]);

  useEffect(() => {
    const sub = client.models.SessionStat.observeQuery({
      filter: {
        or: [
          { winnerId: { eq: userInfo?.id } },
          { loserId: { eq: userInfo?.id } },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        setHistory([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);
  return (
    <View>
      {history.map((game) => (
        <HistoryLineItem
          key={game.gameId}
          GameType={game.gameType as GAME_TYPE}
          Opponent={
            game.winnerId === userInfo?.id ? game.loserId! : game.winnerId!
          }
          Win={game.winnerId === userInfo?.id}
        />
      ))}
    </View>
  );
}

export default function Profile({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          style={{ zIndex: 2, flex: 1 }}
          alwaysBounceVertical={false}
        >
          <UserProfile />
          <Headline headline='Statistics' />
          <ProfileContent />
          <Headline headline='Game History' />
          <HistoryContent />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
