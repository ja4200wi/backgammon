import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import {DiceProps} from './Dice';
import Prison from './Prison';
import Home from '../components/Home';
import PipCount from './PipCount';
import {DICE_COLORS, PLAYER_COLORS, DIMENSIONS} from '../utils/constants';
import AcceptMoveButton from './AcceptMoveButton';
import DoubleButton from './DoulbeButton';
import UndoMoveButton from './UndoMoveButton';

export interface Position {
  index: number;
  color: PLAYER_COLORS;
  count: number;
}

interface BoardProps {
  positions: Position[];
  colors: {
    backgroundColor: string;
    spikeLightColor: string;
    spikeDarkColor: string;
    prisonColor: string;
  };
  width: number;
  currentPlayer: PLAYER_COLORS;
  pipCount: number[];
  homeCount: number[];
  height: number;
  dice: DiceProps;
  noMovesLeft: boolean;
  hasDoneMove: boolean;
  onMoveChecker: (sourceIndex: number, targetIndex: number) => Promise<boolean>;
  onAcceptMove: () => void;
  onUndoMove: () => void;
  legalMovesFrom: (sourceIndex: number) => number[];
  isStartingPhase: boolean;
  firstRoll: boolean;
}

const Board: React.FC<BoardProps> = ({
  colors,
  width,
  height,
  dice,
  currentPlayer,
  positions,
  onMoveChecker,
  onAcceptMove,
  onUndoMove,
  pipCount,
  homeCount,
  noMovesLeft,
  hasDoneMove,
  legalMovesFrom,
  isStartingPhase,
  firstRoll,
}) => {
  const initialSpikes = Array.from({length: 26}, (_, index) => ({
    height: DIMENSIONS.spikeHeight,
    color: index % 2 === 0 ? colors.spikeLightColor : colors.spikeDarkColor,
    width: DIMENSIONS.spikeWidth,
    invert: index >= 12 ? true : false,
    checkers: [] as React.ReactElement[],
    onPress: handleSpikePress,
  }));

  const [spikes, setSpikes] = useState(initialSpikes);
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [prisonCheckers, setPrisonCheckers] = useState<React.ReactElement[]>(
    [],
  );
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);
  const [usedDice, setUsedDice] = useState<{[key: number]: number}>({}); //
  const [diceStack, setDiceStack] = useState<number[]>([]);

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
      if (currentPlayer === PLAYER_COLORS.WHITE) {
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
      return;
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };
  const handleAcceptMovePress = () => {
    onAcceptMove();
  };
  const handleUndoMovePress = () => {
    onUndoMove();
  };

  /**
   * 1. Prevent moves from empty spikes
   * 2. Prevent moves to spikes with more than one opponent's checker
   * 3. Prevent moves in the wrong direction
   */

  const distributeCheckers = () => {
    const newSpikes = Array.from({length: 26}, (_, index) => ({
      height: DIMENSIONS.spikeHeight,
      color: index % 2 === 0 ? colors.spikeLightColor : colors.spikeDarkColor,
      width: DIMENSIONS.spikeWidth,
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

  function ButtonView() {
    return(
      <View
                style={{
                  height: DIMENSIONS.spikeHeight,
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <AcceptMoveButton
                  onPress={handleAcceptMovePress}
                  disabled={noMovesLeft}
                />
                <UndoMoveButton
                  onPress={handleUndoMovePress}
                  disabled={hasDoneMove}
                />
                <DoubleButton onPress={() => {}} disabled={true} />
              </View>
    )
  }

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
       <PipCount color={PLAYER_COLORS.BLACK} count={pipCount[1]} />
       <Home onPress={handleHomePress} count={homeCount[1]} player={PLAYER_COLORS.BLACK}/>
      </View>
      <View
        style={[
          styles.board,
          {
            backgroundColor: colors.backgroundColor,
            width: width,
            height: height,
          },
        ]}>
          {isStartingPhase && (
            <View style={styles.TopDice}>
            <Dice
                diceOne={dice.diceOne}
                diceTwo={dice.diceTwo}
                color={dice.color}
                startingSeq={isStartingPhase}
                firstRoll={firstRoll}
              />
          </View>
          )}
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(7)}</View>
          <View
            style={{ height: DIMENSIONS.spikeHeight, justifyContent: 'center' }}>
            {!isStartingPhase && (
              dice.color === DICE_COLORS.WHITE ? (
                <Dice
                  diceOne={dice.diceOne}
                  diceTwo={dice.diceTwo}
                  color={dice.color}
                  startingSeq={isStartingPhase}
                  firstRoll={firstRoll}
                />
              ) : (
                <ButtonView />
              )
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(13)}</View>
        </View>
        <Prison
          backgroundColor={colors.prisonColor}
          width={DIMENSIONS.spikeWidth}
          height={height}
          checkers={prisonCheckers}
          onPress={handlePrisonPress}
        />
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(1)}</View>
          <View
            style={{height: DIMENSIONS.spikeHeight, justifyContent: 'center'}}>
            {!isStartingPhase && (
              dice.color === DICE_COLORS.BLACK && !isStartingPhase ? (
                <Dice
                  diceOne={dice.diceOne}
                  diceTwo={dice.diceTwo}
                  color={dice.color}
                  startingSeq={isStartingPhase}
                  firstRoll={firstRoll}
                />
              ) : (
                <ButtonView />
              )
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(19)}</View>
        </View>
      </View>
      <View style={styles.row}>
        <PipCount color={PLAYER_COLORS.WHITE} count={pipCount[0]} />
        <Home onPress={handleHomePress} count={homeCount[0]} player={PLAYER_COLORS.WHITE}/>
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
  }
});

export default Board;
