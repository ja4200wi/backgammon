import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface PipCountProps {
  color: string;
  count: string;
}

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
    marginLeft: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textstyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default PipCount;
