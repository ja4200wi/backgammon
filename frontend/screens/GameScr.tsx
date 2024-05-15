import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, PanResponderInstance } from 'react-native';

// Spike Component
const Spike = ({ color, isBottom, isTop }) => (
  <View style={[
    styles.spike, 
    { backgroundColor: "transparent" }, 
    { borderColor: color },
    isBottom && styles.spikeBottom, 
    isTop && styles.spikeTop
  ]} />
);

const SpikeColorDark = "#1f4336";
const SpikeColorLight = "#FFF";

const Pipp = ({color}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dx: pan.x, // x,y are Animated.Value
          dy: pan.y,
        },
      ], { useNativeDriver: false })
,      
      onPanResponderTerminationRequest: (evt, gestureState) =>
        false,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  return <Animated.View
  {...panResponder.panHandlers}
  style={[pan.getLayout(), styles.pip, { backgroundColor: color }]}
/>;
};
// Pip Component
const Pip = ({ color }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.pip, { backgroundColor: color }]}
    />
  );
};

export default function GameScr() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <View style={styles.halfBoard}>
          <View style={styles.spikesColumn}>
            <View style={styles.spikesContainer}>
              {/* Top Left Spikes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Spike key={`tl-${i}`} color={i % 2 === 0 ? SpikeColorLight : SpikeColorDark} isTop />
              ))}
            </View>
            <View style={styles.spikesContainer}>
              {/* Bottom Left Spikes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Spike key={`bl-${i}`} color={i % 2 === 1 ? SpikeColorLight : SpikeColorDark} isBottom />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.divider}>
          {/* Middle Divider / Prison */}
        </View>
        <View style={styles.halfBoard}>
          <View style={styles.spikesColumn}>
            <View style={styles.spikesContainer}>
              {/* Top Right Spikes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Spike key={`tr-${i}`} color={i % 2 === 1 ? SpikeColorDark : SpikeColorLight} isTop />
              ))}
            </View>
            <View style={styles.spikesContainer}>
              {/* Bottom Right Spikes */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Spike key={`br-${i}`} color={i % 2 === 0 ? SpikeColorDark : SpikeColorLight} isBottom />
              ))}
            </View>
          </View>
        </View>
        {/* Draggable Pip */}
          <Pipp color="#FFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#968a6e",
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: '90%',
    aspectRatio: 0.9, // size of the field
    backgroundColor: '#f5deb3', // yellow-beige color
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
  },
  halfBoard: {
    flex: 1,
    flexDirection: 'column',
  },
  divider: {
    width: '5%',
    backgroundColor: '#8B4513', // wood-like color for bar/prison
    justifyContent: 'center',
    alignItems: 'center',
  },
  spikesColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  spikesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spike: {
    flex: 1,
    aspectRatio: 1 / 3,
    margin: 1,
    borderStyle: "solid",
    borderLeftWidth: 12.5, // creates the spike shape
    borderRightWidth: 12.5,
    borderBottomWidth: 100, // length of spikes
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  spikeBottom: {
    alignSelf: 'flex-end',
  },
  spikeTop: {
    transform: [{ rotate: '180deg' }],
  },
  pip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: "#FFF",
  },
});
