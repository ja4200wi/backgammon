import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import {
  APP_COLORS,
  DIMENSIONS,
  ICONS,
  GAME_TYPE,
  COUNTRIES,
} from '../utils/constants';
import Header from '../components/navigation/Header';
import AvatarWithFlag from '../components/misc/AvatarWithFlag';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import {
  getPlayerInfo,
  getUserName,
  getUserNickname,
} from '../service/profileService';
import { SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const selectionSet = ['id', 'name', 'createdAt', 'updatedAt'] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

function UserProfile({ dateJoined }: { dateJoined: Date }) {
  const formattedDate = dateJoined.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [player, setPlayer] = useState<PlayerInfo>();

  const fetchUserData = async () => {
    const playerInfo = await getPlayerInfo(await getUserName());
    playerInfo && setPlayer(playerInfo);
  };

  fetchUserData();

  return (
    <View style={[styles.content, { padding: 16 }]}>
      <View style={styles.userRow}>
        <AvatarWithFlag country={COUNTRIES.JAPAN} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 16,
          }}
        >
          <Text style={[GLOBAL_STYLES.headline]}>{player?.name}</Text>
          <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
            Joined {new Date(player?.createdAt!).toLocaleDateString()}
          </Text>
        </View>
        <Icon
          name='edit'
          color={APP_COLORS.iconGrey}
          size={24}
          style={{ marginLeft: 'auto' }}
        />
      </View>
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
  // Determine which icon to show based on the GameType
  const renderIcon = () => {
    switch (GameType) {
      case GAME_TYPE.ELO:
        return ICONS.TrophyIcon;
      case GAME_TYPE.ONLINE:
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
        <Text style={GLOBAL_STYLES.lineItems}>{Opponent}</Text>
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

function ProfileContent({
  GamesPlayed,
  Wins,
  Gammons,
  Backgammons,
  ELO,
  League,
  Coins,
}: {
  GamesPlayed: string;
  Wins: string;
  Gammons: string;
  Backgammons: string;
  ELO: string;
  League: string;
  Coins: string;
}) {
  return (
    <View style={[styles.content, { padding: 16 }]}>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Games Played</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{GamesPlayed}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Wins</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{Wins}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Gammons</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{Gammons}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Backgammons</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{Backgammons}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>ELO</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{ELO}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>League</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{League}</Text>
      </View>
      <View style={GLOBAL_STYLES.rowLineItems}>
        <Text style={GLOBAL_STYLES.lineItems}>Coins</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{Coins}</Text>
      </View>
    </View>
  );
}
function HistoryContent() {
  return (
    <View>
      <HistoryLineItem
        GameType={GAME_TYPE.ELO}
        Opponent='DaddyGammer'
        Win={true}
      />
      <HistoryLineItem
        GameType={GAME_TYPE.PASSPLAY}
        Opponent='MiaTurtle'
        Win={false}
      />
      <HistoryLineItem
        GameType={GAME_TYPE.COMPUTER}
        Opponent='ChampJann'
        Win={false}
      />
      <HistoryLineItem
        GameType={GAME_TYPE.ONLINE}
        Opponent='Peterpan'
        Win={true}
      />
      <HistoryLineItem
        GameType={GAME_TYPE.ELO}
        Opponent='Guest28395'
        Win={true}
      />
      <HistoryLineItem
        GameType={GAME_TYPE.FRIENDLIST}
        Opponent='IwinYouLose'
        Win={false}
      />
    </View>
  );
}

export default function Profile({ navigation }: { navigation: any }) {
  const [nickname, setProfileName] = useState('');

  const fetchUserData = async () => {
    const nickname = await getUserNickname();
    setProfileName(nickname);
  };

  fetchUserData();
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
        <ScrollView style={{ zIndex: 2 }}>
          <UserProfile dateJoined={new Date('2018-03-11')} />
          <Headline headline='Statistics' />
          <ProfileContent
            GamesPlayed='243'
            Wins='183'
            Gammons='23'
            Backgammons='1'
            ELO='1245 GP'
            League='Gold League'
            Coins='395'
          />
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
});
