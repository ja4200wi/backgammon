import React from 'react';
import { PLAYER_COLORS } from '../../utils/constants';
import { Position } from './Board';
import { Text, View } from 'react-native';

interface BoardProps {
  positions: Position[];
  dice: number[];
  currentPlayer: PLAYER_COLORS;
}
const Board: React.FC<BoardProps> = ({ positions, dice, currentPlayer }) => {
  return (
    <View>
      <Text className='text-white'>Board V2</Text>
    </View>
  );
};

export default Board;
