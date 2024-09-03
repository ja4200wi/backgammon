import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements'; // Ensure this is installed and set up
import Puzzle from '../images/puzzle.svg';
import { APP_COLORS } from '../utils/constants';

const AvatarWithFlag = () => {
  return (
    <View style={styles.container}>
      <Avatar
        size={64}
        rounded
        containerStyle={styles.avatar}
      >
      </Avatar>
      <View style={styles.profileContainer}>
        <Puzzle width={32} height={32} color={'green'} style={styles.puzzleIcon} /> 
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
    left: 2,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the profile is on top of the Avatar
  },
  puzzleIcon: {
    transform: [{ rotate: '-9deg' }], // Rotate the puzzle icon by -9 degrees
  },
});

export default AvatarWithFlag;
