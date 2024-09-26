import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { Button } from '@rneui/themed';
import { getCurrentUser } from 'aws-amplify/auth';
import { APP_COLORS, GAME_TYPE } from '../utils/constants';
import { getPlayerName } from '../service/profileService';
import StartFriendGame from './StartFriendGame';
import { initGame } from '../service/gameService';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const client = generateClient<Schema>();

const selectionSet = ['id', 'playerOneID', 'playerTwoID', 'gameType'] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;
const turnsSelectionSet = [
  'gameId',
  'turnNumber',
  'playerId',
  'createdAt',
] as const;
type Turns = SelectionSet<Schema['Turns']['type'], typeof turnsSelectionSet>;

interface TurnInfo {
  player: string;
  date: string;
  numTurns: number;
}

export default function GameListItem({
  navigation,
  localPlayerId,
  item,
}: {
  navigation: any;
  localPlayerId: string;
  item: Session;
}) {
  const [lastTurns, setLastTurns] = useState<Turns[]>();
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const buttonTitle = hasGameStarted ? 'Continue' : 'Start Game';
  // disable button if playerOne and game has not started yet

  useEffect(() => {
    const sub = client.models.Turns.observeQuery({
      filter: { gameId: { eq: item.id } },
    }).subscribe({
      next: async ({ items, isSynced }) => {
        setLastTurns([...items]);
        if (items.length > 0) {
          setHasGameStarted(true);
          setDisabled(false);
        } else if (item.playerOneID === localPlayerId) {
          setDisabled(true);
        }
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const joinGame = async (gameId: string) => {
    const { userId } = await getCurrentUser();
    if (lastTurns!.length === 0) {
      initGame(gameId, userId);
    }
    navigation.navigate('Game', {
      gameId,
      localPlayerId: userId,
      gameMode: GAME_TYPE.RANDOM,
    });
  };

  const fetchPlayerName = async (playerId: string): Promise<String> => {
    return await getPlayerName(playerId);
  };

  const PlayerNameText = ({
    playerId,
  }: {
    playerId: string | null | undefined;
  }) => {
    const [playerName, setPlayerName] = useState<String>('');

    useEffect(() => {
      const fetchName = async () => {
        if (playerId === null || playerId === undefined) {
          setPlayerName('');
        } else {
          const name = await fetchPlayerName(playerId);
          setPlayerName(name);
        }
      };

      fetchName();
    }, [playerId]);

    return (
      <Text style={styles.gameText}>
        <Text style={{ fontWeight: 'bold' }}>{playerName || ''}</Text>
      </Text>
    );
  };

  return (
    <View style={styles.gameItem}>
      <Text style={styles.gameText}>
        {/* Display the player name */}
        {localPlayerId === item.playerOneID ? (
          <PlayerNameText playerId={item.playerTwoID} />
        ) : (
          <PlayerNameText playerId={item.playerOneID} />
        )}
      </Text>
      <Text>
        Last Move:{' '}
        <PlayerNameText
          playerId={
            hasGameStarted
              ? lastTurns![lastTurns!.length - 1].playerId
              : undefined
          }
        />
      </Text>
      <Text>
        {hasGameStarted &&
          timeAgo.format(new Date(lastTurns![lastTurns!.length - 1].createdAt))}
      </Text>
      {/* Join button */}
      <Button
        title={buttonTitle}
        buttonStyle={
          hasGameStarted ? styles.continueButton : styles.startButton
        }
        disabled={disabled}
        onPress={() => joinGame(item.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gameItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  gameText: {
    fontSize: 16,
    color: '#333',
  },
  startButton: {
    backgroundColor: APP_COLORS.appBlue,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
  },
});
