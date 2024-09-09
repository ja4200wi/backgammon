import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Checker from './Checker'; // Import your Checker component
import { APP_COLORS, PLAYER_COLORS } from '../../utils/constants';
import DoubleDiceComp from './doubleDiceComp';
import { DoubleDice } from '../../gameLogic/doubleDice';

interface HomeProps {
  onPress: (index: number) => void;
  count: number;
  player: PLAYER_COLORS;
  doubleDice: DoubleDice;
}

const Home: React.FC<HomeProps> = ({ onPress, count, player, doubleDice }) => {
  const checkers = [];
  for (let i = 0; i < count; i++) {
    checkers.push(
      <View key={i} style={[styles.checkerContainer, { right: i * 6 }]}>
        <Checker height={30} width={30} color={player} />
        {i === count - 1 && (
          <Text
            style={[
              styles.checkerText,
              {
                color:
                  player === PLAYER_COLORS.WHITE
                    ? '#000'
                    : '#FFF',
              },
            ]}
          >
            {count}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {
        player === doubleDice.getLastDobule() ? (
          <View style={styles.doubleDiceCompContainer}>
            <DoubleDiceComp color={player} count={doubleDice.getMultiplicator()} />
          </View>
        ) : null
      }
      <TouchableOpacity style={styles.container} onPress={() => onPress(100)}>
        <View style={styles.checkersContainer}>{checkers}</View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative', // Relative positioning for the parent wrapper to contain both Home and DoubleDiceComp
    width: 135, // Ensure the same width as the Home button
  },
  container: {
    backgroundColor: APP_COLORS.iconGrey,
    borderColor: APP_COLORS.darkGrey,
    borderWidth: 2,
    borderRadius: 20,
    marginVertical: 5,
    height: 34,
    width: 135,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  doubleDiceCompContainer: {
    position: 'absolute', 
    bottom: 5, 
    left: -5, 
    zIndex: 2,
  },
  checkersContainer: {
    position: 'relative', 
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end', // Align checkers to the right
    marginRight: 6,
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
