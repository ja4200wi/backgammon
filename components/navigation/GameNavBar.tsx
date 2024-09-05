import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../../utils/constants';
import { Divider } from '@rneui/themed';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';

export default function GameNavBar({ navigation }: { navigation: any }) {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon
          name='arrow-back'
          type='material'
          color={APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Restart Game',
            'Are you sure you want to restart the game? Your current Game will be lost.',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Restart',
                onPress: () => console.log('Restart Pressed'),
              },
            ],
            { cancelable: false }
          )
        }
      >
        <Icon
          name='sync'
          type='material'
          color={APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity
        onPress={() =>
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [
                'Cancel',
                'Give up (-1)',
                'Give up as a Gammon (-2)',
                'Give up as a Backgammon (-3)',
              ],
              cancelButtonIndex: 0,
              userInterfaceStyle: 'dark',
            },
            (buttonIndex) => {
              if (buttonIndex === 1) {
                console.log('Give up (-1)');
              } else if (buttonIndex === 2) {
                console.log('Give up as a Gammon (-2)');
              } else if (buttonIndex === 3) {
                console.log('Give up as a Backgammon (-3)');
              }
            }
          )
        }
      >
        <Icon
          name='flag'
          type='material'
          color={APP_COLORS.iconGrey}
          size={36}
        />
      </TouchableOpacity>
      <Divider orientation='vertical' color={APP_COLORS.iconGrey} />
      <TouchableOpacity onPress={() => console.log('double')}>
        <Text
          style={{
            fontSize: 30,
            color: APP_COLORS.iconGrey,
            fontWeight: '600',
          }}
        >
          x2
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: APP_COLORS.backgroundColor,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
});
