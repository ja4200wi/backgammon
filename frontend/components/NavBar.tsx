import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

export default function GameSelectionScr({navigation}: {navigation: any}) {
  

  return (
    <View style={styles.footerContainer}>
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="home" type="material" color="#6B9C41" size={36} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log('Study')}>
        <Icon name="school" type="material" color="white" size={36} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Icon name="person" type="material" color="white" size={36} />
      </TouchableOpacity>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#302E2B',
        padding: 4,
      },
      bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#302E2B',
        paddingVertical: 10,
      },
  });
  
