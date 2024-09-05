import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Checker from './Checker'; // Import your Checker component
import { APP_COLORS, PLAYER_COLORS } from '../utils/constants';

interface HomeProps {
  onPress: (index: number) => void;
  count: number;
  player: PLAYER_COLORS;
}

const Home: React.FC<HomeProps> = ({ onPress, count, player }) => {
  const checkers = [];
  for (let i = 0; i < count; i++) {
    checkers.push(
      <View key={i} style={[styles.checkerContainer, { right: i * 8 }]}>
        <Checker height={30} width={30} color={player} />
        {i === count - 1 && (
          <Text style={[styles.checkerText, {color: player === PLAYER_COLORS.WHITE ? PLAYER_COLORS.BLACK : PLAYER_COLORS.WHITE}]}>{count}</Text>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(100)}>
      <View style={styles.checkersContainer}>{checkers}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.iconGrey,
    borderColor: APP_COLORS.darkGrey,
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 5,
    height: 34,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  checkersContainer: {
    position: 'relative', // Container for absolute-positioned checkers
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end', // Align checkers to the right
    marginRight:8,
  },
  checkerContainer: {
    position: 'absolute', // Position absolutely to stack
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the top checker is above others
  },
  checkerText: {
    position: 'absolute', // Ensure the text is centered on the checker
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Home;
