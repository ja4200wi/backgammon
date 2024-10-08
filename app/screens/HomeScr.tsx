import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Button, Card, Divider } from '@rneui/themed';
import AvatarWithFlag from '../components/misc/AvatarWithFlag';
import AvatarWithPuzzle from '../components/misc/AvatarWithPuzzle';
import { APP_COLORS, DIMENSIONS, COUNTRIES } from '../utils/constants';
import Header from '../components/navigation/Header';
import { GLOBAL_STYLES } from '../utils/globalStyles';
import {
  getEnumFromKey,
  getPlayerInfo,
  getUserName,
} from '../service/profileService';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { useUser } from '../utils/UserContent';
import GameListItem from '../components/GameListItem';

const client = generateClient<Schema>();

const sessionSelectionSet = [
  'id',
  'playerOneID',
  'playerTwoID',
  'gameType',
  'isGameStarted',
  'createdAt',
] as const;
type Session = SelectionSet<
  Schema['Session']['type'],
  typeof sessionSelectionSet
>;

const selectionSet = [
  'gameId',
  'gameType',
  'winnerId',
  'loserId',
  'reason',
] as const;
type HistoryGame = SelectionSet<
  Schema['SessionStat']['type'],
  typeof selectionSet
>;

function UserCard() {
  const { userInfo } = useUser();

  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View style={styles.userRow}>
        <AvatarWithFlag playerId={userInfo?.id ?? ''} />

        <Text style={[GLOBAL_STYLES.headline, , { marginLeft: 16 }]}>
          {userInfo?.name || 'Unknown User'}
        </Text>
      </View>
      <HomeScreenStats />
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
        titleStyle={{ fontWeight: 'bold', fontSize: 24 }}
        onPress={() => navigation.navigate('GameSelection')}
      />
    </View>
  );
}

function HomeScreenStats() {
  const { userInfo } = useUser();
  const [gameHistory, setGameHistory] = useState<HistoryGame[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo?.id) return; // Check for userInfo presence
    const sub = client.models.SessionStat.observeQuery({
      filter: {
        or: [
          { winnerId: { eq: userInfo.id } },
          { loserId: { eq: userInfo.id } },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        try {
          // Create a map to filter out duplicate gameIds
          const uniqueGamesMap = new Map<string, HistoryGame>();
          items.forEach((game) => {
            if (!uniqueGamesMap.has(game.gameId)) {
              uniqueGamesMap.set(game.gameId, game);
            }
          });

          // Convert the map values back into an array
          const uniqueGames = Array.from(uniqueGamesMap.values());

          setGameHistory([...uniqueGames]);
          setGamesPlayed(uniqueGames.length);

          if (isSynced) {
            const winsCount = uniqueGames.filter(
              (game) => game.winnerId === userInfo.id
            ).length;
            setWins(winsCount);
            setLoading(false);
          } else {
            setLoading(true);
          }
        } catch (error) {
          console.error('Error processing game stats:', error);
          setLoading(false); // Ensure loading stops even if there's an error
        }
      },
      error: (error) => {
        console.error('Subscription error:', error);
        setLoading(false);
      },
    });

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [userInfo?.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={APP_COLORS.appGreen} />
        <Text style={GLOBAL_STYLES.lineItems}>Loading game stats...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={{ marginTop: 8 }}>
        <View style={styles.statsRow}>
          <Text style={GLOBAL_STYLES.lineItems}>Games Played</Text>
          <Text style={GLOBAL_STYLES.lineItems}>{gamesPlayed}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.statsRow}>
          <Text style={GLOBAL_STYLES.lineItems}>Wins</Text>
          <Text style={GLOBAL_STYLES.lineItems}>{wins}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.statsRow}>
          <Text style={GLOBAL_STYLES.lineItems}>Win Ratio</Text>
          <Text style={GLOBAL_STYLES.lineItems}>
            {gamesPlayed > 0
              ? `${((wins / gamesPlayed) * 100).toFixed(0)}%`
              : '0%'}
          </Text>
        </View>
      </View>
    </>
  );
}

function LastGame({ navigation }: { navigation: any }) {
  const { userInfo } = useUser();
  const [games, setGames] = useState<Session[]>([]);

  useEffect(() => {
    if (!userInfo?.id) return;
    const sub = client.models.Session.observeQuery({
      filter: {
        or: [
          {
            and: [
              { playerOneID: { eq: userInfo.id } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
          {
            and: [
              { playerTwoID: { eq: userInfo.id } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
        ],
      },
    }).subscribe({
      next: ({ items }) => {
        try {
          const lastItem = items[items.length - 1];
          if (lastItem) {
            setGames([lastItem]);
          }
        } catch (error) {
          console.error('Error fetching last game:', error);
        }
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
    });

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [userInfo?.id]);

  const renderLastGame = (game: Session) => (
    <View>
      {game === undefined ? (
        <Text style={styles.noGamesText}>No games available.</Text>
      ) : (
        <GameListItem
          isLargePlayButton={false}
          navigation={navigation}
          localPlayerId={userInfo?.id || ''}
          item={game}
        />
      )}
    </View>
  );

  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: 'white',
          marginLeft: 12,
        }}
      >
        Last Game
      </Text>
      {games.length > 0 && renderLastGame(games[0])}
    </Card>
  );
}

export default function HomeScr({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header navigation={navigation} />
      <ImageBackground
        source={require('../images/backgroundDiceImage.png')}
        style={styles.bodyContainer}
        resizeMode='cover'
      >
        <View style={styles.overlaySquare} />
        <UserCard />
        <LastGame navigation={navigation} />
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
  noGamesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.headerBackGroundColor,
  },
});
