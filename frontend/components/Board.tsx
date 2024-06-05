import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import {DiceProps} from './Dice';
import Prison from './Prison';

export interface Position {
  index: number;
  color: string;
  count: number;
}

export enum COLORS {
  WHITE = 'white',
  BLACK = 'black',
}

interface BoardProps {
  positions: Position[];
  colors: {
    background: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
  width: number;
  height: number;
  dice: DiceProps;
  onMoveChecker: (sourceIndex: number, targetIndex: number) => Promise<boolean>;
}

const Board: React.FC<BoardProps> = ({
  colors,
  width,
  height,
  dice,
  positions,
  onMoveChecker,
}) => {
  const spikeWidth = width / 13;
  const spikeHeight = height / 3;

  const initialSpikes = Array.from({length: 24}, (_, index) => ({
    height: spikeHeight,
    color: index % 2 === 0 ? colors.primary : colors.secondary,
    width: spikeWidth,
    invert: index >= 12 ? true : false,
    checkers: [] as React.ReactElement[],
    onPress: handleSpikePressTwo,
  }));

  const [spikes, setSpikes] = useState(initialSpikes);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [prisonCheckers, setPrisonCheckers] = useState<React.ReactElement[]>(
    [],
  );

  const handleSpikePressTwo = (index: number) => {
    if (selectedSource === null && spikes[index].checkers.length > 0) {
      setSelectedSource(index);
    } else if (selectedSource !== null) {
      moveCheckerTwo(selectedSource, index);
    }
  };

  const moveCheckerTwo = async (sourceIndex: number, targetIndex: number) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    if (success) {
      // Update UI accordingly
      setSelectedSource(null);
    } else {
      setSelectedSource(null);
      Alert.alert('Invalid move');
    }
  };

  const handlePrisonPress = (index: number) => {
    if (selectedSource === null && prisonCheckers.length > 0) {
      setSelectedSource(-1);
    } else if (selectedSource !== null) {
      moveCheckerTwo(selectedSource, index);
    }
  };

  /**
   * 1. Prevent moves from empty spikes
   * 2. Prevent moves to spikes with more than one opponent's checker
   * 3. Prevent moves in the wrong direction
   */

  const distributeCheckers = () => {
    const newSpikes = Array.from({length: 24}, (_, index) => ({
      height: spikeHeight,
      color: index % 2 === 0 ? colors.primary : colors.secondary,
      width: spikeWidth,
      invert: index >= 12 ? true : false,
      checkers: [] as React.ReactElement[],
      onPress: handleSpikePressTwo,
    }));

    const prisonCheckers: React.ReactElement[] = [];

    positions.forEach(position => {
      const {index, color, count} = position;
      for (let i = 0; i < count; i++) {
        const checker = (
          <Checker
            key={`${color}-${index}-${i}`}
            color={color}
            width={spikeWidth}
            height={spikeWidth}
          />
        );
        if (index < 0) {
          prisonCheckers.push(checker);
        } else {
          newSpikes[index].checkers.push(checker);
        }
      }
    });
    setPrisonCheckers(prisonCheckers);
    setSpikes(newSpikes);
  };

  useEffect(() => {
    distributeCheckers();
  }, [positions]);

  useEffect(() => {});

  const SixSpikes = (startIndex: number) => (
    <>
      {spikes.slice(startIndex, startIndex + 6).map((spike, idx) => (
        <Spike
          key={startIndex + idx} // Ensure unique keys by combining startIndex and idx
          height={spike.height}
          color={spike.color}
          width={spike.width}
          invert={spike.invert}
          checkers={spike.checkers}
          onPress={() => handleSpikePressTwo(startIndex + idx)} // Pass correct index here
        />
      ))}
    </>
  );

  return (
    <View
      style={[
        styles.board,
        {backgroundColor: colors.background, width: width, height: height},
      ]}>
      <View style={[styles.boardHalf]}>
        <View style={[styles.reverse]}>{SixSpikes(6)}</View>
        <View style={{height: spikeHeight, justifyContent: 'center'}}>
          {dice.color === 'white' && (
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
            />
          )}
        </View>
        <View style={[styles.sixSpikes]}>{SixSpikes(12)}</View>
      </View>
      <Prison
        backgroundColor={colors.tertiary}
        width={spikeWidth}
        height={height}
        checkers={prisonCheckers}
        onPress={handlePrisonPress}
      />
      <View style={[styles.boardHalf]}>
        <View style={[styles.reverse]}>{SixSpikes(0)}</View>
        <View style={{height: spikeHeight, justifyContent: 'center'}}>
          {dice.color === 'black' && (
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
            />
          )}
        </View>
        <View style={[styles.sixSpikes]}>{SixSpikes(18)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  boardHalf: {
    flexDirection: 'column',
  },
  sixSpikes: {
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
});

export default Board;
