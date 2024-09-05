import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { APP_COLORS } from '../utils/constants';

export default function HeaderSecondary({ navigation, headline }: { navigation: any, headline: string }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" type="material" color={APP_COLORS.iconGrey} size={28} />
      </TouchableOpacity>
      
      <Text style={styles.headerText}>{headline}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: APP_COLORS.headerBackGroundColor,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'center',  // Centering the content horizontally
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',  // Position it absolutely
    left: 16,  // Place it on the left side
    zIndex: 3
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});
