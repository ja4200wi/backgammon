import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {
  APP_COLORS,
  DIMENSIONS,
  COUNTRIES,
} from '../utils/constants';
import Header from '../components/navigation/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, InviteFriend, OpenRequest, Friend, SentRequest } from '../components/misc/SmallComponents';


export default function FriendList({ navigation }: { navigation: any }) {
  const [hasOpenRequest, setHasOpenRequest] = useState<boolean>(true)
  const [hasSentRequest, setHasSentRequest] = useState<boolean>(true)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      {/* Body with Background Image */}
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        {/* Semi-transparent Square */}
        <View style={styles.overlaySquare} />
        <ScrollView style={{ zIndex: 2 }}>
            <InviteFriend />
            {hasOpenRequest && (
                <View style={{backgroundColor: APP_COLORS.backgroundColor}}>
                <Headline headline="Open Requests" />
                <OpenRequest nickname={'jacky'} extraInfo='sent request 3 days ago' country={COUNTRIES.BELGIUM} />
                </View>
                )}
            <Headline headline='Friends' />
            <View style={{backgroundColor: APP_COLORS.backgroundColor}}>
            <Friend nickname={'JannProGamerHD'} country={COUNTRIES.MEXICO} />
            </View>
          {hasSentRequest && (
            <View style={{backgroundColor: APP_COLORS.backgroundColor}}>
            <Headline headline="Sent Requests" />
            <SentRequest nickname={'jacky'} country={COUNTRIES.BELGIUM} extraInfo='sent request 3 days ago'/>
            </View>
            )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312F2C',
  },
  bodyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: APP_COLORS.backgroundColor,
    flexDirection: 'column',
    zIndex: 2,
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
  },
  divider: {
    backgroundColor: 'gray',
    marginVertical: 4,
  },
});
