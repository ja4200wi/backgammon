import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

const SpikeColorDark = "#1f4336";
const SpikeColorLight = "#FFF";

// Game screen
export default function GameScr() {
  // Initialize pip position
  const initialPipPositions = [
    { key: 'pip-1', x: new Animated.Value(100), y: new Animated.Value(50) }, // Example initial position
  ];

  const [pips, setPips] = useState(initialPipPositions);

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
        {pips.map((pip) => (
        <DraggablePip key={pip.key} x={pip.x} y={pip.y} />
      ))}
      </View>
    </View>
  );
}

// Styling
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
    backgroundColor: "#FF0000",
    position: 'absolute',
  },
});

// Spike Component type definition
interface SpikeProps {
  color: string;
  isBottom?: boolean;
  isTop?: boolean;
}

// Spike Component with type annotations
const Spike: React.FC<SpikeProps> = ({ color, isBottom, isTop }) => (
  <View style={[
    styles.spike, 
    { backgroundColor: "transparent" }, 
    { borderColor: color },
    isBottom && styles.spikeBottom, 
    isTop && styles.spikeTop
  ]} />
);

interface DraggablePipProps {
  x: Animated.Value;
  y: Animated.Value;
}

// Draggable Pip Component
const DraggablePip: React.FC<DraggablePipProps> = ({ x, y }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        x.setValue(gestureState.moveX); // Adjust to center the pip under the finger
        y.setValue(gestureState.moveY); // Adjust to center the pip under the finger
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.pip,
        { transform: [{ translateX: x }, { translateY: y }] }
      ]}
    />
  );
};
