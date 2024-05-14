/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  FlatList,
  SectionList,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScr from './screens/HomeScr';
import GameScr from './screens/GameScr';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScr} />
        <Stack.Screen name="Game" component={GameScr} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  Container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  Textstyle: {
    marginTop: 12,
    color: "#000000",
    padding: "auto",
  }
});

export default App;
