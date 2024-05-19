import React from 'react';
import {View, StyleSheet} from 'react-native';

interface SpikeProps {
  color: string;
  width: number;
  height: number;
  style?: any;
  invert?: boolean;
  checkers: React.ReactElement[];
  children?: React.ReactElement;
}

const Spike: React.FC<SpikeProps> = ({
  color,
  width,
  height,
  invert,
  checkers,
  children,
}) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  spike: {},
});

export default Spike;
