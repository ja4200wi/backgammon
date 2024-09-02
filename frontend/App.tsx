import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScr from './screens/HomeScr';
import GameScreen from './screens/GameScr';
import GameSelectionScr from './screens/GameSelectionScr';
import ProfileScr from './screens/Profile';
import NavBar from './components/NavBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state }) => (
        <NavBar navigation={navigation} selectedScreen={state.routeNames[state.index]} />
      )}
    >
      <Tab.Screen name="Home" component={HomeScr} />
      <Tab.Screen name="Profile" component={ProfileScr} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="GameSelection" component={GameSelectionScr} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
