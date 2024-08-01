import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Checker from './Checker';

interface HomeProps {
  onPress: (index: number) => void;
  count: number;
}

const Home: React.FC<HomeProps> = ({
  onPress,
  count
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(100)}>
      <Text style={styles.textstyle}>Home: {count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'brown',
    borderRadius: 5,
    marginVertical: 5,
    height: 30,
    width: 150,
    alignItems: 'center',
  },
  textstyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default Home;
