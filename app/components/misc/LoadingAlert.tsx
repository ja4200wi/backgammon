import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { APP_COLORS, DIMENSIONS } from '../../utils/constants';

interface LoadingPopupProps {
  visible: boolean;
  message: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ visible, message }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.popupBox}>
          {/* Message Text */}
          <Text style={styles.message}>{message}</Text>
          
          {/* Loading Spinner */}
          <ActivityIndicator size="large" color={APP_COLORS.appGreen} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
  },
  popupBox: {
    width: DIMENSIONS.screenWidth * 0.8,
    backgroundColor: '#54504B',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5, // Controls the shadow on Android
  },
  message: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default LoadingPopup;
