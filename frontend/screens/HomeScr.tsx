import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined, // undefined because you aren't passing any params to the home screen
  Game: undefined,
  SignUp: undefined,
  Profile: { name: string }; 
};
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeScr({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Backgammon</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#968a6e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: '#28231C',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F5E8B6',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#5A7D7C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#8B4513',
  },
  buttonText: {
    color: '#F5E8B6',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
