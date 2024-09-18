import React, { useState } from 'react';
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
  giveUp: (type: 'DOUBLE' | 'STANDARD') => void;
  onRestart: () => void;
  showAcceptMoveButton: boolean;
  showUndoMoveButton: boolean;
  disableButtons: boolean;
  allowDouble: boolean;
  showRestartGame: boolean;
}

const GameNavBar: React.FC<GameNavBarProps> = ({
  onAcceptMove,
  onUndoMove,
  onDouble,
  giveUp,
  onRestart,
  allowDouble,
  showAcceptMoveButton,
  showUndoMoveButton,
  disableButtons,
  showRestartGame,
}) => {
  const [isAcceptButtonDisabled, setIsAcceptButtonDisabled] = useState(false);

  const acceptButtonColor =
    showAcceptMoveButton || disableButtons || isAcceptButtonDisabled
      ? APP_COLORS.iconGrey
      : APP_COLORS.appBlue;

  const undoButtonColor =
    showUndoMoveButton || disableButtons
      ? APP_COLORS.iconGrey
      : APP_COLORS.appBlue;

  const handleAcceptMove = () => {
    // Disable the button to prevent multiple clicks
    setIsAcceptButtonDisabled(true);

    // Call the onAcceptMove function
    onAcceptMove();

    // Re-enable the button after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setIsAcceptButtonDisabled(false);
    }, 2000); // Adjust the delay as needed
  };

  const showActionSheet = () => {
    const options = [
      'Cancel',
      'Give up (-1)',
      'Give up as a Gammon (-2)',
      'Give up as a Backgammon (-3)',
    ];

    // Conditionally add the "Restart Game" option
    if (showRestartGame) {
      options.push('Restart Game');
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          giveUp('STANDARD');
        } else if (buttonIndex === 2) {
          giveUp('STANDARD');
        } else if (buttonIndex === 3) {
          giveUp('STANDARD');
        } else if (showRestartGame && buttonIndex === options.length - 1) {
          // Handle 'Restart Game' only if it's part of the options
          onRestart();
        }
      }
    );
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={showActionSheet}>
        <Icon name='flag' type='material' color={APP_COLORS.iconGrey} size={36} />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity onPress={onDouble} disabled={disableButtons || allowDouble}>
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
      <TouchableOpacity onPress={onUndoMove} disabled={showUndoMoveButton || disableButtons}>
        <Icon name='replay' type='material' color={undoButtonColor} size={36} />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity
        onPress={handleAcceptMove}
        disabled={showAcceptMoveButton || disableButtons || isAcceptButtonDisabled}
      >
        <Icon name='done' type='material' color={acceptButtonColor} size={36} />
      </TouchableOpacity>
    </View>
  );
};

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

export default GameNavBar;
