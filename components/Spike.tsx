import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Triangle from 'react-native-triangle';

interface SpikeProps {
  color: string;
  width: number;
  height: number;
  isHighlighted?: boolean;
  invert?: boolean;
  checkers: React.ReactElement[];
  onPress?: () => void;
  children?: React.ReactElement;
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
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{backgroundColor: isHighlighted ? 'yellow' : 'transparent'}}>
      {invert && (
        <Triangle
          width={width}
          height={height}
          color={color}
          direction={invert ? 'up' : 'down'}></Triangle>
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
        ]}>
        {checkers.map((CheckerComponent, index) =>
          React.cloneElement(CheckerComponent, {key: index}),
        )}
      </View>
      {!invert && (
        <Triangle
          width={width}
          height={height}
          color={color}
          direction={invert ? 'up' : 'down'}></Triangle>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spike: {
    zIndex: 100,
    gap: 1,
  },
});

export default Spike;
