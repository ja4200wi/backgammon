import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import Spike from '../components/Spike';
import Checker from '../components/Checker';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const boardWidth = screenWidth * 0.8;
const boardHeight = screenHeight * 0.6;
const spikeWidth = boardWidth / 13;
const spikeHeight = boardHeight / 2 - 30;

const spikes: React.ReactElement[][] = new Array(24).fill(null).map(() => []);

const whiteCheckers: React.ReactElement[] = new Array(15)
  .fill(null)
  .map((_, index) => (
    <Checker
      key={`white-${index}`}
      color="white"
      width={spikeWidth}
      height={spikeWidth}
    />
  ));

const blackCheckers: React.ReactElement[] = new Array(15)
  .fill(null)
  .map((_, index) => (
    <Checker
      key={`black-${index}`}
      color="black"
      width={spikeWidth}
      height={spikeWidth}
    />
  ));

const distributeCheckers = () => {
  // Backgammon starting positions
  const startingPositions = [
    {index: 0, color: 'white', count: 2},
    {index: 11, color: 'white', count: 5},
    {index: 16, color: 'white', count: 3},
    {index: 18, color: 'white', count: 5},
    {index: 23, color: 'black', count: 2},
    {index: 12, color: 'black', count: 5},
    {index: 7, color: 'black', count: 3},
    {index: 5, color: 'black', count: 5},
  ];

  startingPositions.forEach(position => {
    const {index, color, count} = position;
    for (let i = 0; i < count; i++) {
      if (color === 'white') {
        const checker = whiteCheckers.pop();
        if (checker) {
          spikes[index].push(checker);
        }
      } else {
        const checker = blackCheckers.pop();
        if (checker) {
          spikes[index].push(checker);
        }
      }
    }
  });
};

// Distribute the checkers according to the starting positions
distributeCheckers();

const renderSpikes = () =>
  spikes.flatMap((checkers, index) => {
    if (index === 6 || index === 18) {
      return [
        <View key={`blackView-before-${index}`} style={styles.blackView} />,
        <Spike
          key={index}
          height={spikeHeight}
          color={index % 2 === 0 ? 'red' : 'green'}
          width={spikeWidth}
          invert={index >= 12}
          checkers={checkers}>
          <Text>{index}</Text>
        </Spike>,
      ];
    }
    return [
      <Spike
        key={index}
        height={spikeHeight}
        color={index % 2 === 0 ? 'red' : 'green'}
        width={spikeWidth}
        invert={index >= 12}
        checkers={checkers}>
        <Text>{index}</Text>
      </Spike>,
    ];
  });

export default function GameScr() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>{renderSpikes()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#968a6e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: boardWidth,
    height: boardHeight,
    backgroundColor: '#f5deb3',
    borderRadius: 5,
    borderColor: '#000',
    flexDirection: 'row',
    rowGap: boardHeight - spikeHeight * 2,
    flexWrap: 'wrap',
  },
  blackView: {
    width: spikeWidth,
    height: spikeHeight,
    backgroundColor: '#000000',
  },
});
