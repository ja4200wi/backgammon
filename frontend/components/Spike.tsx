import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

interface SpikeProps {
  color: string;
  width: number;
  height: number;
  style?: any;
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
  checkers,
  onPress,
  children,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <View
        style={[
          styles.spike,
          {
            backgroundColor: color,
            width: width,
            height: height,
            justifyContent: invert ? 'flex-end' : 'flex-start',
          },
        ]}>
        {checkers.map((CheckerComponent, index) =>
          React.cloneElement(CheckerComponent, {key: index}),
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spike: {},
});

export default Spike;
