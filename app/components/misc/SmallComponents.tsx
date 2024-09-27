import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

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
        <AvatarWithFlag country={country} emoji='🦊' />
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
  nickname,
  extraInfo,
  country,
}: {
  friendId: string;
  nickname: string;
  extraInfo: string;
  country: COUNTRIES;
}) {
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag country={country} emoji='🦊' />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{nickname}</Text>
            <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
              {timeAgo.format(new Date(extraInfo))}
            </Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => confirmFriend(friendId)}
          >
            <Icon name='check-circle' color={APP_COLORS.appGreen} size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => removeFriend(friendId)}
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
  nickname,
  country,
  extraInfo,
}: {
  friendId: string;
  nickname: string;
  country: COUNTRIES;
  extraInfo?: string;
}) {
  // confirm remove friend modal
  const confirmRemoveFriend = () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${nickname} as a friend?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => removeFriend(friendId),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag country={country} emoji='🦊' />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{nickname}</Text>
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

export function SentRequest({
  nickname,
  country,
  extraInfo,
}: {
  nickname: string;
  country: COUNTRIES;
  extraInfo?: string;
}) {
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <AvatarWithFlag country={country} emoji='🦊' />
          <View style={{ marginLeft: 16 }}>
            <Text style={GLOBAL_STYLES.headline}>{nickname}</Text>
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
});
