import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, PanResponderInstance } from 'react-native';

const SpikeColorDark = "#1f4336";
const SpikeColorLight = "#FFF";

//game screen
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
      </View>
    </View>
  );
}

//styling
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