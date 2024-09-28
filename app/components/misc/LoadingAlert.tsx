import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { APP_COLORS, DIMENSIONS } from '../../utils/constants';

interface LoadingPopupProps {
  visible: boolean;
  message: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ visible }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={APP_COLORS.appGreen} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Background overlay
  },
});

export default LoadingPopup;
