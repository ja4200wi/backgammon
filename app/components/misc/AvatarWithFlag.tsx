import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements'; // Ensure this is installed and set up
import CountryFlag from 'react-native-country-flag'; // Ensure this is installed and set up
import Profile from '../../images/profile.svg'; // Ensure your SVG import is correct
import { APP_COLORS, COUNTRIES } from '../../utils/constants';
import { color } from '@rneui/base';
import { generateClient, SelectionSet } from 'aws-amplify/api';
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

const client = generateClient<Schema>();

const AvatarWithFlag = ({
  playerId,
  size,
  flagSize,
  fontSize,
}: {
  playerId: string;
  size?: number;
  flagSize?: number;
  fontSize?: number;
}) => {
  size = size || 64;
  flagSize = flagSize || 14;
  fontSize = fontSize || 40;
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>();

  function filterPlayerInfo(item: Record<string, any>) {
    return selectionSet.reduce((filteredItem, key) => {
      if (item !== null && item !== undefined && item.hasOwnProperty(key)) {
        filteredItem[key] = item[key];
      }
      return filteredItem;
    }, {} as Record<(typeof selectionSet)[number], any>);
  }

  useEffect(() => {
    const sub = client.models.Player.observeQuery({
      filter: {
        id: { eq: playerId },
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        const firstItem = items[0];
        const filteredItem = filterPlayerInfo(firstItem);
        setPlayerInfo(filteredItem);
      },
    });
    return () => sub.unsubscribe();
  }, [playerId]);
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Avatar
        size={size}
        rounded
        containerStyle={{
          backgroundColor: playerInfo?.profilePicColor || APP_COLORS.iconGrey,
          ...styles.avatar,
        }}
      ></Avatar>
      <View style={styles.profileContainer}>
        <Text
          style={{
            fontSize: fontSize,
            color:
              playerInfo?.profilePicColor === '#000000' ? 'white' : 'black',
          }}
        >
          {playerInfo?.emoji}
        </Text>
      </View>
      <View style={styles.flagContainer}>
        <CountryFlag
          isoCode={getEnumFromKey(playerInfo?.country)}
          size={flagSize}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
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

export default AvatarWithFlag;
