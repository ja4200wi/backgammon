import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActionSheetIOS,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';
import { Divider } from '@rneui/themed';

interface GameNavBarProps {
  onAcceptMove: () => void;
  onUndoMove: () => void;
  onDouble: () => void;
  giveUp: (type:'DOUBLE' | 'STANDARD') => void;
  onRestart: () => void;
  showAcceptMoveButton: boolean;
  showUndoMoveButton: boolean;
  disableButtons: boolean;
}

const GameNavBar: React.FC<GameNavBarProps> = ({ onAcceptMove, onUndoMove,onDouble, giveUp, onRestart, showAcceptMoveButton, showUndoMoveButton, disableButtons }) => {
  const acceptButtonColor = showAcceptMoveButton || disableButtons ? APP_COLORS.iconGrey : APP_COLORS.appBlue;
  const undoButtonColor = showUndoMoveButton || disableButtons ? APP_COLORS.iconGrey : APP_COLORS.appBlue;
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
                giveUp('STANDARD')
              } else if (buttonIndex === 2) {
                giveUp('STANDARD')
              } else if (buttonIndex === 3) {
                giveUp('STANDARD')
              } else if (buttonIndex === 4) {
                onRestart()
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
      <TouchableOpacity onPress={onDouble} disabled={disableButtons}>
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
        disabled={showUndoMoveButton || disableButtons}
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
        disabled = {showAcceptMoveButton || disableButtons} 
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