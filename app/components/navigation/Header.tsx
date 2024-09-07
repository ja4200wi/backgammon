import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';
import { GLOBAL_STYLES } from '../../utils/globalStyles';

export default function Header({ navigation }: { navigation: any }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => console.log('Friends')}>
        <Icon
          name='people'
          type='material'
          color={APP_COLORS.iconGrey}
          size={30}
        />
      </TouchableOpacity>
      <Text style={GLOBAL_STYLES.headline}>Gammon.com</Text>
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

const styles = StyleSheet.create({
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: APP_COLORS.headerBackGroundColor,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
