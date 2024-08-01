import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import {DiceProps} from './Dice';
import Prison from './Prison';
import { boardWidth } from '../screens/GameScr';
import Home from '../components/Home';
import PipCount from './PipCount';

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
  currentPlayer: string;
  pipCount: number[];
  homeCount: number[];
  height: number;
  dice: DiceProps;
  onMoveChecker: (sourceIndex: number, targetIndex: number) => Promise<boolean>;
}

const Board: React.FC<BoardProps> = ({
  colors,
  width,
  height,
  dice,
  currentPlayer,
  positions,
  onMoveChecker,
  pipCount,
  homeCount,
}) => {
  const spikeWidth = width / 13;
  const spikeHeight = height / 3;

  const initialSpikes = Array.from({length: 26}, (_, index) => ({
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
  const [homeCheckers, sethomeCheckers] = useState<React.ReactElement[]>(
    [],
  );
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);
  const [usedDice, setUsedDice] = useState<{[key: number]: number}>({});

  const handleSpikePress = (index: number) => {
    if (selectedSource === null && spikes[index].checkers.length > 0) {
      setSelectedSource(index);
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  const moveChecker = async (sourceIndex: number, targetIndex: number) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    if (success) {
      const moveDistance = Math.abs(targetIndex - sourceIndex);
      setUsedDice(prevUsedDice => ({
        ...prevUsedDice,
        [moveDistance]: (prevUsedDice[moveDistance] || 0) + 1,
      }));
      setPossibleMoves([]);
      setSelectedSource(null);
    } else {
      setSelectedSource(null);
    }
  };

  const handlePrisonPress = (index: number) => {
    if (selectedSource === null && prisonCheckers.length > 0) {
      if (currentPlayer === 'white') {
        setSelectedSource(0);
      } else {
        setSelectedSource(25);
      }
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  const handleHomePress = (index: number) => {
    if (selectedSource === null) {
      return
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index)
    }
  }

  /**
   * 1. Prevent moves from empty spikes
   * 2. Prevent moves to spikes with more than one opponent's checker
   * 3. Prevent moves in the wrong direction
   */

  const distributeCheckers = () => {
    const newSpikes = Array.from({length: 26}, (_, index) => ({
      height: spikeHeight,
      color: index % 2 === 0 ? colors.primary : colors.secondary,
      width: spikeWidth,
      invert: index >= 13 ? true : false,
      checkers: [] as React.ReactElement[],
      onPress: handleSpikePress,
    }));

    const prisonCheckers: React.ReactElement[] = [];
    const homeCheckers: React.ReactElement[] = [];

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
        if (index === 0 || index === 25) {
          prisonCheckers.push(checker);
        } else if (index === 100) {
          homeCheckers.push(checker);
        } else {
          newSpikes[index].checkers.push(checker);
        }
      }
    });
    setPrisonCheckers(prisonCheckers);
    setSpikes(newSpikes);
    sethomeCheckers(homeCheckers);
  };

  const calculatePossibleMoves = (sourceIndex: number) => {
    if (spikes[sourceIndex].checkers.length === 0) return;
    if (spikes[sourceIndex].checkers[0].props.color !== currentPlayer) return;
    const direction = currentPlayer === COLORS.WHITE ? 1 : -1;
    const diceValues = [dice.diceOne, dice.diceTwo];
    const remainingMoves = diceValues.flatMap(die => {
      const maxUses = die === dice.diceOne && die === dice.diceTwo ? 4 : 1;
      const used = usedDice[die] || 0;
      return Array(maxUses - used).fill(die * direction);
    });
    const possibleMoves = remainingMoves
      .map(move => sourceIndex + move)
      .filter(target => {
        if (target < 1 || target >= 25) return false; // ensure within board limits
        const targetSpike = spikes[target];
        // Check if the spike has more than two enemy checkers
        const isEnemyTerritory =
          targetSpike.checkers.length > 2 &&
          targetSpike.checkers[0].props.color !== currentPlayer;
        return !isEnemyTerritory;
      });
    setPossibleMoves(possibleMoves);
  };

  useEffect(() => {
    distributeCheckers();
  }, [positions]);

  useEffect(() => {
    setUsedDice([]);
  }, [currentPlayer]);


  useEffect(() => {
    if (selectedSource !== null) {
      calculatePossibleMoves(selectedSource);
    }
    if (selectedSource === null) {
      setPossibleMoves([]);
    }
  }, [selectedSource]);

  const SixSpikes = (startIndex: number) => (
    <>
      {spikes.slice(startIndex, startIndex + 6).map((spike, idx) => (
        <Spike
          key={startIndex + idx} // Ensure unique keys by combining startIndex and idx
          height={spike.height}
          color={spike.color}
          width={spike.width}
          invert={spike.invert}
          isHighlighted={possibleMoves.includes(startIndex + idx)}
          checkers={spike.checkers}
          onPress={() => handleSpikePress(startIndex + idx)}
        />
      ))}
    </>
  );

  return (
    <View>
      <View style={styles.row}>
        <PipCount color="black" count={pipCount[1]} />
        <Home onPress={handleHomePress} count= {homeCount[1]} />
    </View>
    <View
      style={[
        styles.board,
        {backgroundColor: colors.background, width: width, height: height},
      ]}>
      <View style={[styles.boardHalf]}>
        <View style={[styles.reverse]}>{SixSpikes(7)}</View>
        <View style={{height: spikeHeight, justifyContent: 'center'}}>
          {dice.color === 'white' && (
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
            />
          )}
        </View>
        <View style={[styles.sixSpikes]}>{SixSpikes(13)}</View>
      </View>
      <Prison
        backgroundColor={colors.tertiary}
        width={spikeWidth}
        height={height}
        checkers={prisonCheckers}
        onPress={handlePrisonPress}
      />
      <View style={[styles.boardHalf]}>
        <View style={[styles.reverse]}>{SixSpikes(1)}</View>
        <View style={{height: spikeHeight, justifyContent: 'center'}}>
          {dice.color === 'black' && (
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
            />
          )}
        </View>
        <View style={[styles.sixSpikes]}>{SixSpikes(19)}</View>
      </View>
    </View>
    <View style={styles.row}>
        <PipCount color="white" count={pipCount[0]} />
        <Home onPress={handleHomePress} count= {homeCount[0]} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

export default Board;
