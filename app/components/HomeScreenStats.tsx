import React, { useEffect, useState } from 'react';
import { useUser } from '../utils/UserContent';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { getPlayerName } from '../service/profileService';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'; // Import ActivityIndicator for loading animation
import { GLOBAL_STYLES } from '../utils/globalStyles';
import { APP_COLORS, DIMENSIONS } from '../utils/constants';
import { Divider } from 'react-native-elements';

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

const client = generateClient<Schema>();

export function HomeScreenStats({}: {}) {
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
    marginVertical: 6,
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
  lineItem: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_COLORS.headerBackGroundColor,
  },
});
