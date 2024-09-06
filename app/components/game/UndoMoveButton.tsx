import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GLOBAL_STYLES } from '../../utils/globalStyles';
import { APP_COLORS } from '../../utils/constants';

interface UndoMoveButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const UndoMoveButton: React.FC<UndoMoveButtonProps> = ({
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled ? GLOBAL_STYLES.buttonDisabled : GLOBAL_STYLES.buttonActive,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon
        name='replay'
        size={30}
        color={
          disabled
            ? APP_COLORS.buttonDisabledFontColor
            : APP_COLORS.buttonBlueFontColor
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UndoMoveButton;
