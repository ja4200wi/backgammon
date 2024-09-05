import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';
import { Divider } from '@rneui/themed';
import { hashMapper } from 'aws-cdk-lib';

interface GameNavBarProps {
  onAcceptMove: () => void;
  onUndoMove: () => void;
  noMovesLeft: boolean;
  noMoveDone: boolean;
}

const GameNavBar: React.FC<GameNavBarProps> = ({ onAcceptMove, onUndoMove, noMovesLeft, noMoveDone }) => {
  const acceptButtonColor = noMovesLeft ? APP_COLORS.iconGrey : APP_COLORS.appBlue;
  const undoButtonColor = noMoveDone ? APP_COLORS.iconGrey : APP_COLORS.appBlue;
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={() =>
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [
                'Cancel',
                'Give up (-1)',
                'Give up as a Gammon (-2)',
                'Give up as a Backgammon (-3)',
                'Restart Game'
              ],
              cancelButtonIndex: 0,
              userInterfaceStyle: 'dark',
            },
            (buttonIndex) => {
              if (buttonIndex === 1) {
                console.log('Give up (-1)');
              } else if (buttonIndex === 2) {
                console.log('Give up as a Gammon (-2)');
              } else if (buttonIndex === 3) {
                console.log('Give up as a Backgammon (-3)');
              } else if (buttonIndex === 4) {
                console.log('Restart');
              }
            }
          )
        }
      >
        <Icon
          name='flag'
          type='material'
          color={APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity onPress={() => console.log('double')}>
        <Text
          style={{
            fontSize: 30,
            color: APP_COLORS.iconGrey,
            fontWeight: '600',
          }}
        >
          x2
        </Text>
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity
        onPress={() =>
          onUndoMove()
        }
        disabled={noMoveDone}
      >
        <Icon
          name='replay'
          type='material'
          color={undoButtonColor}
          size={36}
        />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity
        onPress={() =>
          onAcceptMove()
        }
        disabled = {noMovesLeft} 
      >
        <Icon
          name='done'
          type='material'
          color={acceptButtonColor}
          size={36}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: APP_COLORS.backgroundColor,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
});

export default GameNavBar
