import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Triangle from 'react-native-triangle';
import { APP_COLORS, PLAYER_COLORS } from '../../utils/constants';

interface SpikeProps {
  color: string;
  width: number;
  height: number;
  isHighlighted?: boolean;
  invert?: boolean;
  checkers: React.ReactElement[];
  onPress?: () => void;
}

const Spike: React.FC<SpikeProps> = ({
  color,
  width,
  height,
  invert,
  isHighlighted,
  checkers,
  onPress,
}) => {
  const checkerHeight = 24; // Assuming each checker has a height of 24px

  const renderCheckers = () => {
    const checkerCount = checkers.length;

    if (checkerCount <= 5) {
      // Case 1: Regular stacking for 5 or fewer checkers
      return (
        <View style={[styles.checkerStackContainer, { height }]}>
          {checkers.map((CheckerComponent, index) => (
            <View
              key={index}
              style={[
                styles.checkerRegular,
                invert
                  ? { bottom: index * (checkerHeight + 3) }
                  : { top: index * (checkerHeight + 3) },
              ]}
            >
              {React.cloneElement(CheckerComponent)}
            </View>
          ))}
        </View>
      );
    } else {
      // Case 2: Shuffled display for more than 5 checkers
      const shuffledCheckers = [];
      for (let i = 0; i < checkerCount; i++) {
        const shuffleDegree =
          checkerCount <= 6
            ? 0.9
            : checkerCount === 7
            ? 0.75
            : checkerCount === 8
            ? 0.65
            : checkerCount === 9
            ? 0.58
            : 0.52;
        const offset = i * (checkerHeight * shuffleDegree); // Slight overlap for shuffling
        shuffledCheckers.push(
          <View
            key={i}
            style={[
              styles.checkerShuffled,
              invert ? { bottom: offset } : { top: offset },
            ]}
          >
            {React.cloneElement(checkers[i])}
            {i === checkerCount - 1 && (
              <Text
                style={[
                  styles.checkerText,
                  {
                    color:
                      checkers[0]?.props?.color === PLAYER_COLORS.WHITE
                        ? '#000'
                        : '#FFF',
                    bottom: invert ? 7 : undefined,
                    top: invert ? undefined : 7,
                  },
                ]}
              >
                {checkerCount}
              </Text>
            )}
          </View>
        );
      }
      return (
        <View style={[styles.checkerStackContainer, { height }]}>
          {shuffledCheckers}
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: isHighlighted ? 'rgba(89, 127, 209, .75)' : 'transparent', borderRadius: 15}}
    >
      {invert && (
        <Triangle width={width} height={height} color={color} direction='up' />
      )}
      <View
        style={[
          styles.spike,
          {
            backgroundColor: color,
            width: width,
            height: 0,
            justifyContent: invert ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        {renderCheckers()}
      </View>
      {!invert && (
        <Triangle
          width={width}
          height={height}
          color={color}
          direction='down'
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spike: {
    zIndex: 100,
  },
  checkerStackContainer: {
    position: 'relative',
    width: '100%',
  },
  checkerRegular: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  checkerShuffled: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  checkerText: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 12,
    zIndex: 2,
    textAlign: 'center',
  },
});

export default Spike;
