import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { NavigationProp } from '@react-navigation/native';
import { APP_COLORS } from '../utils/constants';

type NavBarProps = {
    navigation: NavigationProp<any>;
    selectedScreen: string;
  };
  
export default function NavBar({ navigation, selectedScreen}: NavBarProps) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon
            name="home"
            type="material"
            color={selectedScreen === 'Home' ? '#6B9C41' : 'white'}
            size={36}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Study')}>
          <Icon
            name="school"
            type="material"
            color={selectedScreen === 'Study' ? '#6B9C41' : 'white'}
            size={36}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon
            name="person"
            type="material"
            color={selectedScreen === 'Profile' ? '#6B9C41' : 'white'}
            size={36}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: APP_COLORS.backgroundColor,
    padding: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: APP_COLORS.backgroundColor,
    paddingVertical: 10,
  },
});
