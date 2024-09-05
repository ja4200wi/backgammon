import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import { APP_COLORS } from '../utils/constants';

interface DoubleButtonProps {
  onPress: () => void;
  disabled: boolean;
}

const DoubleButton: React.FC<DoubleButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled ? GLOBAL_STYLES.buttonDisabled : GLOBAL_STYLES.buttonActive]}
      onPress={onPress}
      disabled={disabled}
    >
    <Text style={{color: disabled ? APP_COLORS.buttonDisabledFontColor : APP_COLORS.buttonBlueFontColor,fontSize: 20, fontWeight: '600' }}>x2</Text>
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

export default DoubleButton;

