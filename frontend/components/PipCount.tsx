import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import { APP_COLORS, PLAYER_COLORS } from '../utils/constants';

interface PipCountProps {
  color: PLAYER_COLORS;
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
    backgroundColor: APP_COLORS.standardGrey,
    borderRadius: 20,
    marginVertical: 5,
    height: 30,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default PipCount;
