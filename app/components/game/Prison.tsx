import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface PrisonProps {
  backgroundColor: string;
  width: number;
  height: number;
  checkers: React.ReactElement[];
  onPress: (index: number) => void;
}

const Prison: React.FC<PrisonProps> = ({
  backgroundColor,
  width,
  height,
  checkers,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: backgroundColor,
        width: width - 10,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => onPress(-1)}
    >
      {checkers.map((CheckerComponent, index) => (
        <TouchableOpacity key={index} onPress={() => onPress(-1)}>
          {CheckerComponent}
        </TouchableOpacity>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Prison;
