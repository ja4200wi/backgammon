import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Checker from './Checker';

interface HomeProps {
  backgroundColor: string;
  width: number;
  height: number;
  checkers: React.ReactElement[];
  onPress: (index: number) => void;
}

const Home: React.FC<HomeProps> = ({
  backgroundColor,
  width,
  height,
  checkers,
  onPress,
}) => {
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {checkers.map((CheckerComponent, index) => (
        <TouchableOpacity key={index} onPress={() => onPress(100)}>
          {CheckerComponent}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
