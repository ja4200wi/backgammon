import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScr from './screens/HomeScr';
import GameScreen from './screens/GameScr';
import GameSelectionScr from './screens/GameSelectionScr';
import ProfileScr from './screens/Profile';
import NavBar from './components/navigation/NavBar';
import Settings from './screens/SettingsScr';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS } from './utils/constants';

import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import outputs from './amplify_outputs.json';
import PlayFriend from './screens/PlayFriendScr';
import OnlineGameScr from './screens/OnlineGameScr';

Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Authenticator.Provider>
      <Authenticator>
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
          <Tab.Screen name='PlayFriend' component={PlayFriend} />
          <Tab.Screen name='Online' component={OnlineGameScr} />
        </Tab.Navigator>
      </Authenticator>
    </Authenticator.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_COLORS.headerBackGroundColor }}
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Main' component={HomeTabs} />
          <Stack.Screen name='GameSelection' component={GameSelectionScr} />
          <Stack.Screen name='Game' component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
