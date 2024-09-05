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
    <View style={[styles.container,{backgroundColor: color === PLAYER_COLORS.WHITE ? '#FFF' : APP_COLORS.darkGrey, borderColor: color === PLAYER_COLORS.WHITE ? '#000' : '#FFF'}]}>
      <Text style={[styles.textstyle, {color: color === PLAYER_COLORS.WHITE ? '#000' : '#FFF'}]}>
        {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 5,
    height: 34,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PipCount;
