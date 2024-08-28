import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import HomeScr from './screens/HomeScr';
import GameScreen from './screens/GameScr';
import GameSelectionScr from './screens/GameSelectionScr';
import ProfileScr from './screens/Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScr} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name ="GameSelection" component={GameSelectionScr} />
        <Stack.Screen name ="Profile" component={ProfileScr} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}