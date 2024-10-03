import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';
import CountryFlag from 'react-native-country-flag';
import { APP_COLORS } from '../../utils/constants';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { getEnumFromKey, getPlayerInfo } from '../../service/profileService';
import { GLOBAL_STYLES } from '../../utils/globalStyles';

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
  size = 64,
  flagSize = 14,
  fontSize = 40,
}: {
  playerId: string;
  size?: number;
  flagSize?: number;
  fontSize?: number;
}) => {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const updatePlayerInfo = async () => {
    setLoading(true);
    try {
      const response = await getPlayerInfo(playerId);
      setPlayerInfo(response);
    } catch (error) {
      console.error('Failed to fetch player info:', error);
      setPlayerInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePlayerInfo();
  }, [playerId]);

  const avatarStyle = useMemo(
    () => ({
      backgroundColor: playerInfo?.profilePicColor || APP_COLORS.iconGrey,
      ...styles.avatar,
    }),
    [playerInfo?.profilePicColor]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={APP_COLORS.appGreen} />
        <Text style={GLOBAL_STYLES.lineItems}>Loading game stats...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Avatar size={size} rounded containerStyle={avatarStyle} />
      {playerInfo ? (
        <>
          <View style={styles.profileContainer}>
            <Text
              style={{
                fontSize,
                color:
                  playerInfo?.profilePicColor === '#000000' ? 'white' : 'black',
              }}
            >
              {playerInfo?.emoji}
            </Text>
          </View>
          {playerInfo?.country && (
            <View style={styles.flagContainer}>
              <CountryFlag
                isoCode={getEnumFromKey(playerInfo.country)}
                size={flagSize}
              />
            </View>
          )}
        </>
      ) : (
        <Text style={GLOBAL_STYLES.lineItems}>No player data available</Text>
      )}
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
    zIndex: 1,
  },
  flagContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
    borderRadius: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.headerBackGroundColor,
  },
});

export default AvatarWithFlag;
