import { StyleSheet, View } from 'react-native';
import Checkers from './Checkers';
import { useState } from 'react';

const SpikeColorDark = "#1f4336";
const SpikeColorLight = "#FFF";

const Board = () => {
  const [measurements, setMeasurements] = useState<{ [key: string]: any }>({});

  const handleSpikeLayout = (key: string) => (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setMeasurements(prev => ({
      ...prev,
      [key]: { x, y, width, height },
    }));
  };

  const spikeKey = 'tl-2';
  const spikeMeasurements = measurements[spikeKey];

  return (
    <View style={styles.board}>
      <View style={styles.halfBoard}>
        <View style={styles.spikesColumn}>
          <View style={styles.spikesContainer}>
            {/* Top Left Spikes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Spike
                key={`tl-${i}`}
                color={i % 2 === 0 ? SpikeColorLight : SpikeColorDark}
                isTop
                onLayout={handleSpikeLayout(`tl-${i}`)}
              />
            ))}
          </View>
          {spikeMeasurements && (
            <Checkers
              color="b"
              xp={spikeMeasurements.x + spikeMeasurements.width / 2}
              yp={spikeMeasurements.y + spikeMeasurements.height / 2}
            />
          )}
          <View style={styles.spikesContainer}>
            {/* Bottom Left Spikes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Spike
                key={`bl-${i}`}
                color={i % 2 === 1 ? SpikeColorLight : SpikeColorDark}
                isBottom
                onLayout={handleSpikeLayout(`bl-${i}`)}
              />
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
              <Spike
                key={`tr-${i}`}
                color={i % 2 === 1 ? SpikeColorDark : SpikeColorLight}
                isTop
                onLayout={handleSpikeLayout(`tr-${i}`)}
              />
            ))}
          </View>
          <View style={styles.spikesContainer}>
            {/* Bottom Right Spikes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <Spike
                key={`br-${i}`}
                color={i % 2 === 0 ? SpikeColorDark : SpikeColorLight}
                isBottom
                onLayout={handleSpikeLayout(`br-${i}`)}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

interface SpikeProps {
  color: string;
  isBottom?: boolean;
  isTop?: boolean;
  onLayout?: (event: any) => void;
}

const Spike: React.FC<SpikeProps> = ({ color, isBottom, isTop, onLayout }) => {
  return (
    <View
      style={[
        styles.spike,
        { backgroundColor: 'transparent' },
        { borderColor: color },
        isBottom && styles.spikeBottom,
        isTop && styles.spikeTop,
      ]}
      onLayout={onLayout}
    />
  );
};

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
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#FF0000",
    position: 'absolute',
  },
  button: {
    color: "#000",
  },
});

export default Board;
