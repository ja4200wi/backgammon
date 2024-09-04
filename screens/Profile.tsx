import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Button,
  Text,
  Modal,
  TextInput,
} from 'react-native';
import { DIMENSIONS } from '../utils/constants';
import Header from '../components/Header';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export default function Profile({ navigation }: { navigation: any }) {
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility
  const [profileName, setProfileName] = useState(''); // To store the profile name
  const [enteredName, setEnteredName] = useState(''); // To store name entered in input

  const createUser = async (name: string) => {
    await client.models.Player.create({ name });
  };

  // Handler when user presses confirm button
  const handleConfirm = () => {
    setProfileName(enteredName);
    createUser(enteredName); // Create user in the database
    setModalVisible(false);
  };

  // Handler when user presses cancel button
  const handleCancel = () => {
    setEnteredName(''); // Clear entered name
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={undefined} />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        {/* Create USer Button */}
        <View style={styles.container}>
          {/* Button to open the dialog */}
          <Button
            title='Set Profile Name'
            onPress={() => setModalVisible(true)}
          />

          {/* Display the entered profile name */}
          {profileName ? (
            <Text style={styles.profileText}>Profile Name: {profileName}</Text>
          ) : null}

          {/* Modal for input dialog */}
          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Enter Profile Name</Text>

                {/* Text input for the profile name */}
                <TextInput
                  style={styles.input}
                  placeholder='Type your name...'
                  value={enteredName}
                  onChangeText={setEnteredName}
                />

                {/* Confirm and Cancel buttons */}
                <View style={styles.buttonContainer}>
                  <Button title='Confirm' onPress={handleConfirm} />
                  <Button title='Cancel' onPress={handleCancel} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
    color: '#FFFFFF',
    zIndex: 3,
  },
  headerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: '#312F2C',
    zIndex: 2,
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
  card: {
    borderRadius: 15,
    borderColor: 'transparent',
    backgroundColor: 'rgba(84, 80, 75, 0.9)',
    padding: 16,
    marginBottom: 20,
    zIndex: 2,
    elevation: 0, // Remove elevation on Android
    shadowColor: 'transparent', // Remove shadow color on iOS
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  puzzleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 16,
    flex: 1,
    fontFamily: 'Roboto-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    color: 'white',
    fontSize: 16,
  },
  statsValue: {
    color: '#FFF',
    fontSize: 16,
  },
  divider: {
    backgroundColor: 'gray',
    marginVertical: 4,
  },
  playButtonContainer: {
    marginTop: 'auto', // Push the button to the bottom of the container
    marginBottom: 24, // Add margin above the footer
    zIndex: 2,
  },
  playButton: {
    backgroundColor: '#6B9C41',
    borderRadius: 5,
    height: 60,
  },
  buttonContainer: {
    marginTop: 'auto', // Pushes the button to the bottom of the container
    marginBottom: 0, // Adds a 24px margin above the footer
    zIndex: 2, // Ensures the button is above the overlay square
  },
  profileText: {
    color: 'white',
    marginTop: 20,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Background with opacity for modal
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});