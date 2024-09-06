import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { APP_COLORS } from '../../utils/constants';

type NavBarProps = {
  navigation: NavigationHelpers<ParamListBase>;
  selectedScreen: string;
};

export default function NavBar({ navigation, selectedScreen }: NavBarProps) {
  return (
    <View
      className={`p-4 pb-8 flex flex-row justify-around z-10 bg-background`}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon
          name='home'
          type='material'
          color={selectedScreen === 'Home' ? '#6B9C41' : APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Study')}>
        <Icon
          name='school'
          type='material'
          color={selectedScreen === 'Study' ? '#6B9C41' : APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Icon
          name='person'
          type='material'
          color={selectedScreen === 'Profile' ? '#6B9C41' : APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
    </View>
  );
}
