import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { PLAYER_COLORS } from '../../utils/constants';

interface CheckerProps {
  color: PLAYER_COLORS;
  width: number;
  height: number;
  index?: number;
  style?: any;
}

// Using forwardRef to pass ref to the View component
const Checker = forwardRef<View, CheckerProps>(({ color, width, height }, ref) => {
  const colorCode = color === PLAYER_COLORS.WHITE ? 'white' : 'black';
  return (
    <View
      ref={ref} // Attach the ref to the main View container
      style={[
        styles.checker,
        { backgroundColor: colorCode, width: width, height: height },
      ]}
    >
      <View
        style={{
          borderRadius: 100,
          width: 0.5 * width,
          height: 0.5 * height,
          backgroundColor: color == PLAYER_COLORS.WHITE ? '#E1E1E1' : '#3F3F3F',
        }}
      ></View>
    </View>
  );
});

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
