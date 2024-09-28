import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements'; // Ensure this is installed and set up
import CountryFlag from 'react-native-country-flag'; // Ensure this is installed and set up
import Profile from '../../images/profile.svg'; // Ensure your SVG import is correct
import { APP_COLORS, COUNTRIES } from '../../utils/constants';
import { SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { getEnumFromKey, getPlayerInfo } from '../../service/profileService';

const selectionSet = [
  'id',
  'name',
  'emoji',
  'country',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<Schema['Player']['type'], typeof selectionSet>;

const IngameAvatarWithFlag = ({ playerId }: { playerId: string }) => {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>();
  const [color, setColor] = useState<string>(APP_COLORS.iconGrey);

  const updatePlayerInfo = async () => {
    const info = await getPlayerInfo(playerId);
    setPlayerInfo(info);
    setColor(info!.profilePicColor!);
  };

  useEffect(() => {
    updatePlayerInfo();
  }, [playerId]);
  return (
    <View style={styles.container}>
      <Avatar
        size={32}
        rounded
        containerStyle={{ backgroundColor: color, ...styles.avatar }}
      ></Avatar>
      <View style={styles.profileContainer}>
        <Text
          style={{
            fontSize: 16,
            color: color === '#000000' ? 'white' : 'black',
          }}
        >
          {playerInfo?.emoji}
        </Text>
      </View>
      <View style={styles.flagContainer}>
        <CountryFlag isoCode={getEnumFromKey(playerInfo?.country)} size={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the profile is on top of the Avatar
  },
  flagContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent', // Ensure the background is transparent
    zIndex: 2, // Ensure the flag is on top of other elements
    borderRadius: 15,
  },
});

export default IngameAvatarWithFlag;
