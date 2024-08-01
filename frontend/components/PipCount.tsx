import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';

interface PipCountProps {
  color: string;
  count: number;
}
const screenWidth = Dimensions.get('window').width;
const PipCount: React.FC<PipCountProps> = ({color, count}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textstyle}>
        {color}: {count}
      </Text>
    </View>
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

export default PipCount;
