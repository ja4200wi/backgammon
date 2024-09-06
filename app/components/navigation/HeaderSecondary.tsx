import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';

export default function HeaderSecondary({
  navigation,
  headline,
}: {
  navigation: any;
  headline: string;
}) {
  return (
    <View className='w-full flex flex-row justify-center z-10 px-4 py-2 items-center relative'>
      <TouchableOpacity
        className='absolute left-4'
        onPress={() => navigation.goBack()}
      >
        <Icon
          name='arrow-back'
          type='material'
          color={APP_COLORS.iconGrey}
          size={28}
        />
      </TouchableOpacity>

      <Text className='text-white text-2xl font-bold'>{headline}</Text>
    </View>
  );
}
