import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';

export default function Header({ navigation }: { navigation: any }) {
  return (
    <View className='flex flex-row justify-between py-2 px-4 z-10 items-center'>
      <TouchableOpacity onPress={() => console.log('Friends')}>
        <Icon
          name='people'
          type='material'
          color={APP_COLORS.iconGrey}
          size={30}
        />
      </TouchableOpacity>
      <Text className='font-bold text-white text-2xl'>Gammon.com</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Icon
          name='settings'
          type='material'
          color={APP_COLORS.iconGrey}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
}
