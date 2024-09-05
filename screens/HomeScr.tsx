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
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';

function UserCard({
  ELO,
  Coins,
  GlobalRank,
  Username,
}: {
  ELO: number;
  Coins: number;
  GlobalRank: number;
  Username: string;
}) {
  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View style={styles.userRow}>
        <AvatarWithFlag country={COUNTRIES.JAPAN} />
        <Text style={[GLOBAL_STYLES.headline, , { marginLeft: 16 }]}>
          {Username}
        </Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={GLOBAL_STYLES.lineItems}>ELO</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{ELO} GP</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.statsRow}>
        <Text style={GLOBAL_STYLES.lineItems}>Coins</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{Coins}</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.statsRow}>
        <Text style={GLOBAL_STYLES.lineItems}>Global Ranking</Text>
        <Text style={GLOBAL_STYLES.lineItems}>{GlobalRank}</Text>
      </View>
    </Card>
  );
}
function PuzzleCard() {
  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View style={styles.puzzleRow}>
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
    <View style={styles.buttonContainer}>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header />
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        <View style={styles.overlaySquare} />

        <UserCard
          Username='GubiGammer'
          ELO={1354}
          Coins={394}
          GlobalRank={39459}
        />
        <PuzzleCard />
        <PlayButton navigation={navigation} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.headerBackGroundColor,
  },
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  puzzleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  buttonContainer: {
    marginTop: 'auto',
    zIndex: 3,
  },
});