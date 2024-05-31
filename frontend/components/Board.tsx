import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import { DiceProps } from './Dice';
import Prison from './Prison';


interface Position {
  index: number;
  color: string;
  count: number;
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
}

const Board: React.FC<BoardProps> = ({
  colors,
  width,
  height,
  dice,
  positions,
}) => {
  const spikeWidth = width / 13;
  const spikeHeight = height / 3;

  const initialSpikes = Array.from({length: 24}, (_, index) => ({
    height: spikeHeight,
    color: index % 2 === 0 ? colors.primary : colors.secondary,
    width: spikeWidth,
    invert: index >= 12 ? true : false,
    checkers: [] as React.ReactElement[],
    onPress: handleSpikePress,
  }));

  const [spikes, setSpikes] = useState(initialSpikes);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [prisonCheckers, setPrisonCheckers] = useState<React.ReactElement[]>(
    [],
  );

  const moveChecker = (sourceIndex: number, targetIndex: number) => {
    if (!isMovePossible(sourceIndex, targetIndex)) {
      return;
    }
    if (
      spikes[targetIndex].checkers.length === 1 &&
      spikes[targetIndex].checkers[0].props.color !==
        spikes[sourceIndex].checkers[0].props.color
    ) {
      sendToPrison(targetIndex);
    }
    setSpikes(prevSpikes => {
      const newSpikes = [...prevSpikes];
      let checker;
      if (sourceIndex === -1) {
        checker = prisonCheckers.pop();
      } else {
        checker = newSpikes[sourceIndex].checkers.pop();
      }
      if (checker) {
        newSpikes[targetIndex].checkers.push(checker);
      }
      return newSpikes;
    });
    setSelectedSource(null);
  };

  const sendToPrison = (index: number) => {
    setPrisonCheckers(prevCheckers => {
      const newCheckers = [...prevCheckers];
      const checker = spikes[index].checkers.reverse().pop();
      if (checker) {
        newCheckers.push(checker);
      }
      return newCheckers;
    });
  };

  const handleSpikePress = (index: number) => {
    if (selectedSource === null && spikes[index].checkers.length > 0) {
      setSelectedSource(index);
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  const handlePrisonPress = (index: number) => {
    if (selectedSource === null && prisonCheckers.length > 0) {
      setSelectedSource(-1);
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  /**
   * 1. Prevent moves from empty spikes
   * 2. Prevent moves to spikes with more than one opponent's checker
   * 3. Prevent moves in the wrong direction
   */
  const isMovePossible = (
    sourceIndex: number,
    targetIndex: number,
  ): boolean => {
    if (sourceIndex === -1 && prisonCheckers.length === 0) {
      Alert.alert('No checkers in prison');
      setSelectedSource(null);
      return false;
    } else if (spikes[sourceIndex].checkers.length === 0) {
      Alert.alert('No checkers on source spike');
      setSelectedSource(null);
      return false;
    }
    const sourceColor =
      sourceIndex == -1
        ? prisonCheckers[0].props.color
        : spikes[sourceIndex].checkers[0].props.color;
    if (spikes[targetIndex].checkers.length > 1) {
      const targetColor = spikes[targetIndex].checkers[0].props.color;
      if (targetColor !== sourceColor) {
        Alert.alert(
          "Cannot move checker to spike with more than 1 opponent's checker",
        );
        setSelectedSource(null);
        return false;
      }
    }
    if (sourceColor === 'white' && targetIndex < sourceIndex) {
      Alert.alert('Wrong directions for white checkers.');
      setSelectedSource(null);
      return false;
    }
    if (sourceColor === 'black' && targetIndex > sourceIndex) {
      Alert.alert('Wrong directions for black checkers.');
      setSelectedSource(null);
      return false;
    }
    return true;
  };

  const distributeCheckers = () => {
    const newSpikes = Array.from({length: 24}, (_, index) => ({
      height: spikeHeight,
      color: index % 2 === 0 ? colors.primary : colors.secondary,
      width: spikeWidth,
      invert: index >= 12 ? true : false,
      checkers: [] as React.ReactElement[],
      onPress: handleSpikePress,
    }));

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
        newSpikes[index].checkers.push(checker);
      }
    });

    setSpikes(newSpikes);
  };

  useEffect(() => {
    distributeCheckers();
  }, [positions]);

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
          onPress={() => handleSpikePress(startIndex + idx)} // Pass correct index here
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
          <Dice diceOne={dice.diceOne} diceTwo={dice.diceTwo} />
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
        <View style={{height: spikeHeight}} />
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
