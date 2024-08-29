import React from 'react';
import {View, StyleSheet} from 'react-native';
import { PLAYER_COLORS } from '../utils/constants';

interface CheckerProps {
  color: PLAYER_COLORS;
  width: number;
  height: number;
  style?: any;
}

const Checker: React.FC<CheckerProps> = ({color, width, height}) => {
  const toReadableString = () => {
    return `Checker(color: ${color}, width: ${width}, height: ${height})`;
  };
  return (
    <View
      style={[
        styles.checker,
        {backgroundColor: color, width: width, height: height},
      ]}>
      <View
        style={{
          borderRadius: 100,
          width: 0.5 * width,
          height: 0.5 * height,
          backgroundColor: color == 'white' ? '#E1E1E1' : '#3F3F3F',
        }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  checker: {
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default Checker;
