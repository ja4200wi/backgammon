import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import HomeScr from './screens/HomeScr';
import GameScreen from './screens/GameScr';

type RootStackParamList = {
  Home: undefined; // undefined because you aren't passing any params to the home screen
  Game: undefined; // Add Game route
  SignUp: undefined; // Add SignUp route
  Profile: { name: string }; 
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScr} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
