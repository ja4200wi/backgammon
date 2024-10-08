import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { APP_COLORS } from '../../utils/constants';

type NavBarProps = {
  navigation: NavigationHelpers<ParamListBase>;
  selectedScreen: string;
};

export default function NavBar({ navigation, selectedScreen }: NavBarProps) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
          <Icon
            name='people'
            type='material'
            color={selectedScreen === 'Friends' ? '#6B9C41' : APP_COLORS.iconGrey}
            size={44}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon
            name='home'
            type='material'
            color={selectedScreen === 'Home' ? '#6B9C41' : APP_COLORS.iconGrey}
            size={44}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon
            name='person'
            type='material'
            color={
              selectedScreen === 'Profile' ? '#6B9C41' : APP_COLORS.iconGrey
            }
            size={44}
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
    paddingBottom: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: APP_COLORS.backgroundColor,
    paddingVertical: 10,
  },
});
