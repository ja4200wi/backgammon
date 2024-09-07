import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Button, Card, Divider } from '@rneui/themed';
import AvatarWithFlag from '../components/misc/AvatarWithFlag';
import AvatarWithPuzzle from '../components/misc/AvatarWithPuzzle';
import { APP_COLORS, DIMENSIONS, COUNTRIES } from '../utils/constants';
import Header from '../components/navigation/Header';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import { getUserNickname } from '../service/profileService';

function UserCard({
  ELO,
  Coins,
  GlobalRank,
}: {
  ELO: number;
  Coins: number;
  GlobalRank: number;
}) {
  const [profileName, setProfileName] = useState('');

  const fetchUserData = async () => {
    const nickname = await getUserNickname();
    setProfileName(nickname);
  };

  function StatsRow({ label, value }: { label: string; value: string }) {
    return (
      <View className='flex flex-row justify-between'>
        <Text className='text-xl font-semibold text-white'>{label}</Text>
        <Text className='text-xl font-semibold text-white'>{value}</Text>
      </View>
    );
  }

  fetchUserData();
  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View className='flex-row items-center mb-2'>
        <AvatarWithFlag country={COUNTRIES.JAPAN} />
        <Text className='text-white font-bold text-2xl ml-2'>
          {profileName}
        </Text>
      </View>
      <StatsRow label={'ELO'} value={`${ELO} GP`} />
      <Divider style={styles.divider} />
      <StatsRow label={'Coins'} value={`${Coins}`} />
      <Divider style={styles.divider} />
      <StatsRow label={'Global Ranking'} value={`${GlobalRank}`} />
    </Card>
  );
}
function PuzzleCard() {
  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View className='flex-row items-center'>
        <AvatarWithPuzzle />
        <Text style={[GLOBAL_STYLES.headline, , { marginLeft: 16 }]}>
          Daily Puzzle
        </Text>
      </View>
    </Card>
  );
}
function PlayButton({ navigation }: { navigation: any }) {
  return (
    <View className='z-10 mt-auto'>
      <Button
        title='Play'
        loading={false}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={styles.playButton}
        titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
        onPress={() => navigation.navigate('GameSelection')}
      />
    </View>
  );
}

export default function HomeScr({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className='flex-1'>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        <View style={styles.overlaySquare} />
        <UserCard ELO={1354} Coins={394} GlobalRank={39459} />
        <PuzzleCard />
        <PlayButton navigation={navigation} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  overlaySquare: {
    position: 'absolute',
    width: DIMENSIONS.screenWidth,
    height: DIMENSIONS.screenHeight,
    backgroundColor: 'rgba(48, 46, 43, .9)',
    zIndex: 1,
  },
  divider: {
    backgroundColor: APP_COLORS.iconGrey,
    marginVertical: 4,
  },
  playButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
    height: 60,
  },
});
