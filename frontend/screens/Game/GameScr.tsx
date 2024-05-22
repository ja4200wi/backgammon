import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Button } from 'react-native';
import Board from "./Components/Board";

const SpikeColorDark = "#1f4336";
const SpikeColorLight = "#FFF";

// Game screen
export default function GameScr() {

  const [pips, setpips] = useState([{}]);
  const [renderGame, setRenderGame] = useState(false);

  const handleRenderGame = () => {
    const initialStones = [
      { x: 100, y: 50 },
      // Add more stones as needed
    ];
    setpips(initialStones);
    setRenderGame(true);
  };


  return (
    <View style={styles.container}>
      <Board />
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
  }
});
