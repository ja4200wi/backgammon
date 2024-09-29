import { useEffect, useState } from 'react';
import { useUser } from '../utils/UserContent';
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { getPlayerName } from '../service/profileService';
import { StyleSheet, Text, View } from 'react-native';
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
  const [winByGiveUp, setWinByGiveUp] = useState(0);
  const [lossByGiveUp, setlossByGiveUp] = useState(0);
  const [favoriteOpp, setFavoriteOpp] = useState('');
  useEffect(() => {
    const sub = client.models.SessionStat.observeQuery().subscribe({
      next: async ({ items, isSynced }) => {
        setGameHistory([...items]);
        setGamesPlayed(items.length);
        setWins(items.filter((game) => game.winnerId === userInfo?.id).length);
        setWinByGiveUp(
          items.filter(
            (game) =>
              game.reason === 'GIVE_UP' && game.winnerId === userInfo?.id
          ).length
        );
        setlossByGiveUp(
          items.filter(
            (game) => game.reason === 'GIVE_UP' && game.loserId === userInfo?.id
          ).length
        );
        setFavoriteOpp(await getPlayerName(getMostOftenId(items)));
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const getMostOftenId = (items: HistoryGame[]): string => {
    const ids = items.map((game) => game.winnerId);
    const counts: Record<string, number> = {};
    let compare = 0;
    let mostFrequent: string | undefined;

    for (let i = 0, len = ids.length; i < len; i++) {
      const id = ids[i];
      if (id == null) {
        continue;
      }
      if (counts[id] === undefined) {
        counts[id] = 1;
      } else {
        counts[id] = counts[id] + 1;
      }

      if (counts[id] > compare) {
        compare = counts[id];
        mostFrequent = id;
      }
    }
    return mostFrequent || '';
  };

  return (
    <>
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
