import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { APP_COLORS, DIMENSIONS } from '../../utils/constants';

interface CustomAlertProps {
  visible: boolean;
  headline: string;
  bodyText: string;
  acceptButtonText: string;
  declineButtonText: string;
  onAccept: () => void;
  onDecline: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  headline,
  bodyText,
  acceptButtonText,
  declineButtonText,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          {/* Headline */}
          <Text style={styles.headline}>{headline}</Text>

          {/* Body Text */}
          <Text style={styles.bodyText}>{bodyText}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor: APP_COLORS.appGreen}]} onPress={onAccept}>
              <Text style={styles.buttonText}>{acceptButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: APP_COLORS.darkGrey}]} onPress={onDecline}>
              <Text style={styles.buttonText}>{declineButtonText}</Text>
            </TouchableOpacity>
          </View>
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
  alertBox: {
    width: DIMENSIONS.screenWidth * .8,
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
  headline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF', 
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width:DIMENSIONS.screenWidth * .33,
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5, // Controls the shadow on Android
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomAlert;
