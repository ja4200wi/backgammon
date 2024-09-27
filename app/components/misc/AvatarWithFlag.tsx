import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-elements'; // Ensure this is installed and set up
import CountryFlag from 'react-native-country-flag'; // Ensure this is installed and set up
import Profile from '../../images/profile.svg'; // Ensure your SVG import is correct
import { APP_COLORS, COUNTRIES } from '../../utils/constants';

const AvatarWithFlag = ({
  country,
  emoji,
}: {
  country: COUNTRIES;
  emoji: string;
}) => {
  return (
    <View style={styles.container}>
      <Avatar
        size={64}
        rounded
        containerStyle={styles.avatar}
        title='JW'
      ></Avatar>
      <View style={styles.profileContainer}>
        <Text style={{ fontSize: 40 }}>{emoji}</Text>
      </View>
      <View style={styles.flagContainer}>
        <CountryFlag isoCode={country} size={14} />
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
    backgroundColor: APP_COLORS.standardGrey,
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
