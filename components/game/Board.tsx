import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import { DiceProps } from './Dice';
import Prison from './Prison';
import Home from './Home';
import PipCount from './PipCount';
import { DICE_COLORS, PLAYER_COLORS, DIMENSIONS, BOARD_COLORS } from '../../utils/constants';

export interface Position {
  index: number;
  color: PLAYER_COLORS;
  count: number;
}
const colors = {
  backgroundColor: BOARD_COLORS.BACKGROUND,
  spikeDarkColor: BOARD_COLORS.SPIKEDARK,
  spikeLightColor: BOARD_COLORS.SPIKELIGHT,
  prisonColor: BOARD_COLORS.PRISON, 
}

interface BoardProps {
  positions: Position[];
  currentPlayer: PLAYER_COLORS;
  pipCount: number[];
  homeCount: number[];
  dice: DiceProps;
  onMoveChecker: (sourceIndex: number, targetIndex: number) => Promise<boolean>;
  legalMovesFrom: (sourceIndex: number) => number[];
}

const Board: React.FC<BoardProps> = ({
  dice,
  currentPlayer,
  positions,
  pipCount,
  homeCount,
  legalMovesFrom,
  onMoveChecker,
}) => {
  const initialSpikes = Array.from({ length: 26 }, (_, index) => ({
    height: DIMENSIONS.spikeHeight,
    color: index % 2 === 0 ? colors.spikeDarkColor : colors.spikeLightColor,
    width: DIMENSIONS.spikeWidth,
    invert: index >= 12 ? true : false,
    checkers: [] as React.ReactElement[],
    onPress: handleSpikePress,
  }));

  const [spikes, setSpikes] = useState(initialSpikes);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [prisonCheckers, setPrisonCheckers] = useState<React.ReactElement[]>(
    []
  );
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);

  const moveChecker = async (sourceIndex: number, targetIndex: number) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    if (success) {
      setPossibleMoves([]);
      setSelectedSource(null);
    } else {
      setSelectedSource(null);
    }
  };
  const handlePrisonPress = (index: number) => {
    if (selectedSource === null && prisonCheckers.length > 0) {
      if (currentPlayer === PLAYER_COLORS.WHITE) {
        setSelectedSource(0);
      } else {
        setSelectedSource(25);
      }
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };
  const handleSpikePress = (index: number) => {
    if (selectedSource === null && spikes[index].checkers.length > 0) {
      setSelectedSource(index);
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  const handleHomePress = (index: number) => {
    if (selectedSource === null) {
      return;
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };

  const distributeCheckers = () => {
    const newSpikes = Array.from({ length: 26 }, (_, index) => ({
      height: DIMENSIONS.spikeHeight,
      color: index % 2 === 0 ? colors.spikeDarkColor : colors.spikeLightColor,
      width: DIMENSIONS.spikeWidth,
      invert: index >= 13 ? true : false,
      checkers: [] as React.ReactElement[],
      onPress: handleSpikePress,
    }));

    const prisonCheckers: React.ReactElement[] = [];
    const homeCheckers: React.ReactElement[] = [];

    positions.forEach((position) => {
      const { index, color, count } = position;
      for (let i = 0; i < count; i++) {
        const checker = (
          <Checker
            key={`${color}-${index}-${i}`}
            color={color}
            width={DIMENSIONS.spikeWidth}
            height={DIMENSIONS.spikeWidth}
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
  };

  const calculatePossibleMoves = (sourceIndex: number) => {
    const possibleMovesFrom = legalMovesFrom(sourceIndex);
    setPossibleMoves(possibleMovesFrom);
  };

  useEffect(() => {
    distributeCheckers();
  }, [positions]);

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
          key={startIndex + idx}
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
        <PipCount color={PLAYER_COLORS.BLACK} count={pipCount[1]} />
        <Home
          onPress={handleHomePress}
          count={homeCount[1]}
          player={PLAYER_COLORS.BLACK}
        />
      </View>
      <View
        style={[
          styles.board,
          {
            backgroundColor: colors.backgroundColor,
            width: DIMENSIONS.boardWidth,
            height: DIMENSIONS.boardHeight,
          },
        ]}
      >
        {dice.startingSeq && (
          <View style={styles.TopDice}>
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
              startingSeq={dice.startingSeq}
              firstRoll={dice.firstRoll}
            />
          </View>
        )}
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(7)}</View>
          <View
            style={{ height: DIMENSIONS.spikeHeight, justifyContent: 'center' }}
          >
            {!dice.startingSeq && dice.color === DICE_COLORS.WHITE && (
              <Dice
                diceOne={dice.diceOne}
                diceTwo={dice.diceTwo}
                color={dice.color}
                startingSeq={dice.startingSeq}
                firstRoll={dice.firstRoll}
              />
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(13)}</View>
        </View>
        <Prison
          backgroundColor={colors.prisonColor}
          width={DIMENSIONS.spikeWidth}
          height={DIMENSIONS.boardHeight}
          checkers={prisonCheckers}
          onPress={handlePrisonPress}
        />
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(1)}</View>
          <View
            style={{ height: DIMENSIONS.spikeHeight, justifyContent: 'center' }}
          >
            {!dice.startingSeq && dice.color === DICE_COLORS.BLACK && (
              <Dice
                diceOne={dice.diceOne}
                diceTwo={dice.diceTwo}
                color={dice.color}
                startingSeq={dice.startingSeq}
                firstRoll={dice.firstRoll}
              />
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(19)}</View>
        </View>
      </View>
      <View style={styles.row}>
        <PipCount color={PLAYER_COLORS.WHITE} count={pipCount[0]} />
        <Home
          onPress={handleHomePress}
          count={homeCount[0]}
          player={PLAYER_COLORS.WHITE}
        />
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
  },
  TopDice: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
    top: '50%', // Vertically center the dice
    left: '50%', // Horizontally center the dice
    transform: [{ translateX: -125 }, { translateY: -30 }], // Adjust position to the center of the element
  },
});

export default Board;
