import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GAME_SETTINGS, PLAYER_COLORS } from '../../utils/constants';

interface AnimatedCheckerProps {
  color: PLAYER_COLORS;
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const AnimatedChecker: React.FC<AnimatedCheckerProps> = ({ color, width, height, startX, startY, endX, endY }) => {
  const colorCode = color === PLAYER_COLORS.WHITE ? 'white' : 'black';

  // Shared values for the position
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);

  // Animated style using the shared values
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  // Run the animation on mount
  useEffect(() => {
    translateX.value = startX; // Reset to start position
    translateY.value = startY; // Reset to start position
    translateX.value = withTiming(endX, { duration: GAME_SETTINGS.checkerAnimationDuration });
    translateY.value = withTiming(endY, { duration: GAME_SETTINGS.checkerAnimationDuration });
  }, [endX, endY, translateX, translateY]);

  return (
    <Animated.View
      style={[
        styles.checker,
        animatedStyle,
        {
          backgroundColor: colorCode,
          width: width,
          height: height,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 100,
          width: 0.5 * width,
          height: 0.5 * height,
          backgroundColor: color === PLAYER_COLORS.WHITE ? '#E1E1E1' : '#3F3F3F',
        }}
      />
    </Animated.View>
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
    position: 'absolute', // Make sure it is positioned absolutely for movement
  },
});

export default AnimatedChecker;
