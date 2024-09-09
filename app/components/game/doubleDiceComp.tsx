import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { APP_COLORS, PLAYER_COLORS } from '../../utils/constants';

interface doubleDice {
  color: PLAYER_COLORS;
  count: number;
}
const doubleDiceComp: React.FC<doubleDice> = ({ color, count }) => {
  return (
    <View style={[styles.container,{
        backgroundColor: color === PLAYER_COLORS.WHITE ? APP_COLORS.appGreen : APP_COLORS.appGreen,
        borderColor: color === PLAYER_COLORS.WHITE ? '#FFF' : '#FFF'}]} >
        <Text style={[styles.textstyle, {color: color === PLAYER_COLORS.WHITE ? '#FFF' : '#FFF'}]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default doubleDiceComp;
