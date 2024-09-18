import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScr from './app/screens/HomeScr';
import GameScreen from './app/screens/GameScr';
import GameSelectionScr from './app/screens/GameSelectionScr';
import ProfileScr from './app/screens/Profile';
import NavBar from './app/components/navigation/NavBar';
import Settings from './app/screens/SettingsScr';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS } from './app/utils/constants';

import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import outputs from './amplify_outputs.json';
import OnlineMatching from './app/screens/OnlineMatchingScr';
import { Button, StyleSheet, View } from 'react-native';

Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state }) => (
        <NavBar
          navigation={navigation}
          selectedScreen={state.routeNames[state.index]}
        />
      )}
    >
      <Tab.Screen name='Home' component={HomeScr} />
      <Tab.Screen name='Profile' component={ProfileScr} />
      <Tab.Screen name='Settings' component={Settings} />
    </Tab.Navigator>
  );
}

export default function App() {
  const SignOutButton = () => {
    const { signOut } = useAuthenticator();

    return (
      <View style={styles.signOutButton}>
        <Button title='Sign Out' onPress={signOut} />
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_COLORS.headerBackGroundColor }}
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Main' component={HomeTabs} />
          <Stack.Screen name='GameSelection' component={GameSelectionScr} />
          <Stack.Screen name='Game' component={GameScreen} />
          <Stack.Screen name='OnlineMatching' component={OnlineMatching} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: 'flex-end',
  },
});
