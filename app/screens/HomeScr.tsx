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

function UserCard({
  ELO,
  Coins,
  GlobalRank,
}: {
  ELO: number;
  Coins: number;
  GlobalRank: number;
}) {
  const { userInfo } = useUser();

  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      <View style={styles.userRow}>
        <AvatarWithFlag playerId={userInfo?.id!} />

        <Text style={[GLOBAL_STYLES.headline, , { marginLeft: 16 }]}>
          {userInfo?.name}
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

function HomeScreenStats({}: {}) {
  const { userInfo } = useUser();
  const [gameHistory, setGameHistory] = useState<HistoryGame[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const sub = client.models.SessionStat.observeQuery().subscribe({
      next: async ({ items, isSynced }) => {
        // Create a map to filter out duplicate gameIds
        const uniqueGamesMap = new Map<string, HistoryGame>();
        items.forEach((game) => {
          if (!uniqueGamesMap.has(game.gameId)) {
            uniqueGamesMap.set(game.gameId, game);
          }
        });

        // Convert the map values back into an array
        const uniqueGames = Array.from(uniqueGamesMap.values());
        console.log(uniqueGames);

        setGameHistory([...uniqueGames]);
        setGamesPlayed(uniqueGames.length);

        // Only set wins and stop loading when data is fully synced
        if (isSynced) {
          const winsCount = uniqueGames.filter(
            (game) => game.winnerId === userInfo?.id
          ).length;
          console.log('games won', winsCount);
          setWins(winsCount);
          setLoading(false); // Data is fully loaded, set loading to false
        } else {
          // Set loading to true if not synced to ensure consistency
          setLoading(true);
        }
      },
    });

    return () => sub.unsubscribe();
  }, []);

  if (loading) {
    // Display loading indicator while data is loading
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
  const localPlayerId = userInfo?.id;
  const [games, setGames] = useState<Session[]>([]);

  useEffect(() => {
    if (!localPlayerId) return;
    const sub = client.models.Session.observeQuery({
      filter: {
        or: [
          {
            and: [
              { playerOneID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
          {
            and: [
              { playerTwoID: { eq: localPlayerId } },
              { gameType: { eq: 'FRIENDLIST' } },
              { isGameOver: { eq: false } },
            ],
          },
        ],
      },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        // get last element of items array
        const lastItem = items[items.length - 1];
        setGames([lastItem]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const renderGameList = (gameList: Session[]) => (
    <View style={{ zIndex: 3 }}>
      {gameList.length === 0 ? (
        <Text style={styles.noGamesText}>No games available.</Text>
      ) : (
        <FlatList
          data={gameList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameListItem
              isLargePlayButton={false}
              navigation={navigation}
              localPlayerId={localPlayerId || ''}
              item={item}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <Card containerStyle={[GLOBAL_STYLES.card, { zIndex: 2 }]}>
      {/* Body with Background Image */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'white',
          marginLeft: 12,
        }}
      >
        Last Game
      </Text>
      {renderGameList(games.filter((game) => game.isGameStarted))}
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
        <UserCard ELO={1354} Coins={394} GlobalRank={39459} />
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
