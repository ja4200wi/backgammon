import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  GestureResponderEvent,
  ActionSheetIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvatarWithFlag from './AvatarWithFlag'; // Assuming this is a separate component you already have
import {
  APP_COLORS,
  COUNTRIES,
  DIMENSIONS,
  GAME_TYPE,
  ICONS,
} from '../../utils/constants';
import { GLOBAL_STYLES } from '../../utils/globalStyles';
import { Button } from '@rneui/base';
import LetterIcon from '../../images/letter.svg';
import { confirmFriend, removeFriend } from '../../service/friendService';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useUser } from '../../utils/UserContent';
import { getEnumFromKey, getPlayerInfo } from '../../service/profileService';
import { useEffect, useState } from 'react';
import { SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { createGameWithFriend } from '../StartFriendGame';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const selectionSet = [
  'id',
  'name',
  'country',
  'emoji',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

// Headline Component
export function Headline({ headline }: { headline: string }) {
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

export function PlayerName({ playerId }: { playerId: string }) {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>();

  const fetchPlayerInfo = async () => {
    const playerInfoNew = await getPlayerInfo(playerId);
    if (playerInfoNew) {
      setPlayerInfo(playerInfoNew);
    } else {
      setPlayerInfo(undefined); // Or handle this case as needed
    }
  };

  useEffect(() => {
    fetchPlayerInfo();
  }, [playerId]);
  return (
    <View style={{ zIndex: 2 }}>
      <Text style={[{ color: 'white', fontWeight: 700 }]}>
        {playerInfo && playerInfo.name}
      </Text>
    </View>
  );
}

// UserProfile Component
export function UserProfile({
  nickname,
  extraInfo,
  country,
}: {
  nickname: string;
  extraInfo: string;
  country: COUNTRIES;
}) {
  const { userInfo } = useUser();
  //add online logic if necessary
  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: APP_COLORS.backgroundColor,
        }}
      >
        <AvatarWithFlag playerId={userInfo?.id!} />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 16,
          }}
        >
          <Text style={GLOBAL_STYLES.headline}>{nickname}</Text>
          <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
            {extraInfo}
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
export function OpenRequest({
  friendId,
  friendshipId,
  extraInfo,
}: {
  friendId: string;
  friendshipId: string;
  extraInfo: string;
}) {
  const [friendInfo, setFriendInfo] = useState<PlayerInfo | null>(null);

  const updatePlayer = async () => {
    const friendInfoNew = await getPlayerInfo(friendId);
    setFriendInfo(friendInfoNew);
  };

  useEffect(() => {
    updatePlayer();
  }, [friendId]);
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag playerId={friendId} />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{friendInfo?.name}</Text>
            <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
              {timeAgo.format(new Date(extraInfo))}
            </Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => confirmFriend(friendshipId)}
          >
            <Icon name='check-circle' color={APP_COLORS.appGreen} size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => removeFriend(friendshipId)}
          >
            <Icon name='cancel' color={APP_COLORS.appRed} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export function Friend({
  friendId,
  friendshipId,
  extraInfo,
}: {
  friendId: string;
  friendshipId: string;
  extraInfo?: string;
}) {
  const [friendInfo, setFriendInfo] = useState<PlayerInfo | null>(null);

  const updatePlayer = async () => {
    const friendInfoNew = await getPlayerInfo(friendId);
    setFriendInfo(friendInfoNew);
  };

  useEffect(() => {
    updatePlayer();
  }, [friendId]);

  const confirmRemoveFriend = () => {
    const options = ['Cancel', 'Challange Friend', 'Remove Friend'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          console.log('THIS IS MISSING');
          //createGameWithFriend(userIdOne,friendId)
        } else if (buttonIndex === 2) {
          removeFriend(friendshipId);
        }
      }
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag playerId={friendId} />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{friendInfo?.name}</Text>
            <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
              {extraInfo && (
                <>
                  {'friends since '}
                  {timeAgo.format(new Date(extraInfo), 'twitter')}
                </>
              )}
            </Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => confirmRemoveFriend()}
          >
            <Icon name='pending' color={APP_COLORS.iconGrey} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function AddFriend({
  friendId,
  addFriend,
}: {
  friendId: string;
  addFriend: () => void;
}) {
  const [friendInfo, setFriendInfo] = useState<PlayerInfo | null>(null);

  const updatePlayer = async () => {
    const friendInfoNew = await getPlayerInfo(friendId);
    setFriendInfo(friendInfoNew);
  };

  useEffect(() => {
    updatePlayer();
  }, [friendId]);

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag playerId={friendId} />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{friendInfo?.name}</Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => addFriend()}
          >
            <Icon name='add-circle' color={APP_COLORS.appGreen} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export function DifficultyDisplay({ level }: { level: number }) {
  const boxes = [];

  for (let i = 0; i < 4; i++) {
    boxes.push(
      <View
        key={i}
        style={[
          styles.box,
          { backgroundColor: i < level ? APP_COLORS.appBlue : 'grey' },
        ]}
      />
    );
  }

  return <View style={styles.levelCcontainer}>{boxes}</View>;
}
export function SentRequest({
  friendId,
  extraInfo,
}: {
  friendId: string;
  extraInfo?: string;
}) {
  const [friendInfo, setFriendInfo] = useState<PlayerInfo | null>(null);

  const updatePlayer = async () => {
    const friendInfoNew = await getPlayerInfo(friendId);
    setFriendInfo(friendInfoNew);
  };

  useEffect(() => {
    updatePlayer();
  }, [friendId]);
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag playerId={friendId} />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{friendInfo?.name}</Text>
            <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
              {extraInfo && timeAgo.format(new Date(extraInfo))}
            </Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ color: APP_COLORS.standardGrey, fontSize: 18 }}>
            {'...waiting'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function InviteFriend() {
  return (
    <View
      style={{
        alignItems: 'center',
        paddingHorizontal: 'auto',
        marginVertical: 16,
      }}
    >
      <Button
        radius='sm'
        type='solid'
        title='Invite Friends'
        buttonStyle={{
          backgroundColor: APP_COLORS.darkGrey,
          borderColor: APP_COLORS.cardBackgroundColor,
          borderWidth: 1,
          borderRadius: 15,
          height: 60,
        }}
        containerStyle={{
          width: DIMENSIONS.screenWidth - 32,
        }}
        titleStyle={{
          fontSize: 22,
          fontWeight: '700',
        }}
        icon={<LetterIcon width={32} height={32} style={{ marginRight: 8 }} />}
        onPress={() => {
          console.log('sending invite');
        }}
      />
    </View>
  );
}

export function HistoryLineItem({
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

export function ProfileContent({
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
  levelCcontainer: {
    flexDirection: 'row',
  },
  box: {
    width: 16,
    height: 16,
    marginRight: 3,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
  },
});
