import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScr from './screens/HomeScr';
import GameScreen from './screens/GameScr';
import GameSelectionScr from './screens/GameSelectionScr';
import ProfileScr from './screens/Profile';
import NavBar from './components/NavBar';

import {Amplify} from 'aws-amplify';
import {Authenticator, useAuthenticator} from '@aws-amplify/ui-react-native';

import outputs from './amplify_outputs.json';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Settings from './screens/SettingsScr';

Amplify.configure(outputs);

const SignOutButton = () => {
  const {signOut} = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

type RootStackParamList = {
  Home: undefined; // undefined because you aren't passing any params to the home screen
  Game: undefined; // Add Game route
  SignUp: undefined; // Add SignUp route
  Profile: {name: string};
};
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={({navigation, state}) => (
        <NavBar
          navigation={navigation}
          selectedScreen={state.routeNames[state.index]}
        />
      )}>
      <Tab.Screen name="Home" component={HomeScr} />
      <Tab.Screen name="Profile" component={ProfileScr} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Main" component={HomeTabs} />
            <Stack.Screen name="GameSelection" component={GameSelectionScr} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Game" component={GameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: 'flex-end',
  },
});
