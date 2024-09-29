import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { Schema } from '../../amplify/data/resource';
import { Button, Icon } from '@rneui/themed';
import { getCurrentUser } from 'aws-amplify/auth';
import { APP_COLORS, GAME_TYPE } from '../utils/constants';
import {
  getEnumFromKey,
  getPlayerInfo,
  getPlayerName,
} from '../service/profileService';
import StartFriendGame from './StartFriendGame';
import { initGame } from '../service/gameService';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import AvatarWithFlag from './misc/AvatarWithFlag';
import { GLOBAL_STYLES } from '../utils/globalStyles';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const client = generateClient<Schema>();

const selectionSet = [
  'id',
  'playerOneID',
  'playerTwoID',
  'gameType',
  'isGameStarted',
] as const;
type Session = SelectionSet<Schema['Session']['type'], typeof selectionSet>;
const turnsSelectionSet = [
  'gameId',
  'turnNumber',
  'playerId',
  'createdAt',
] as const;
type Turns = SelectionSet<Schema['Turns']['type'], typeof turnsSelectionSet>;
const playerSelectionSet = [
  'id',
  'name',
  'emoji',
  'country',
  'profilePicColor',
  'createdAt',
  'updatedAt',
] as const;
type PlayerInfo = SelectionSet<
  Schema['Player']['type'],
  typeof playerSelectionSet
>;

export default function GameListItem({
  isLargePlayButton,
  navigation,
  localPlayerId,
  item,
}: {
  isLargePlayButton: boolean;
  navigation: any;
  localPlayerId: string;
  item: Session;
}) {
  const [lastTurns, setLastTurns] = useState<Turns[]>();
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  // Button title, depending on whether the game has started and if it's the player's turn but make it STart Game if hasn't started
  const buttonTitle = hasGameStarted
    ? isMyTurn
      ? 'Continue'
      : 'Waiting'
    : 'Start Game';

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
        if (
          items.length > 0 &&
          items[items.length - 1].playerId === localPlayerId
        ) {
          setIsMyTurn(false);
        } else {
          setIsMyTurn(true);
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
      gameMode: GAME_TYPE.FRIENDLIST,
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
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          {playerName || ''}
        </Text>
      </Text>
    );
  };

  const AvatarWithFlagCustom = ({
    playerId,
  }: {
    playerId: string | null | undefined;
  }) => {
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);

    const fetchPlayerInfo = async () => {
      if (playerId === null || playerId === undefined) {
        setPlayerInfo(null);
      } else {
        const info = await getPlayerInfo(playerId);
        setPlayerInfo(info);
      }
    };

    useEffect(() => {
      fetchPlayerInfo();
    }, [playerId]);

    return <AvatarWithFlag playerId={playerId || ''} />;
  };

  return (
    <View style={{ padding: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Profile section on the left */}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          {localPlayerId === item.playerOneID ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <AvatarWithFlag playerId={item.playerTwoID!} />
            </View>
          ) : (
            <View>
              <AvatarWithFlag playerId={item.playerOneID!} />
            </View>
          )}
          <View style={{ marginLeft: 16 }}>
            {localPlayerId === item.playerOneID ? (
              <PlayerNameText playerId={item.playerTwoID} />
            ) : (
              <PlayerNameText playerId={item.playerOneID} />
            )}
            {/* <Text style={styles.gameText}>
              Last Move:{' '}
              <PlayerNameText
                playerId={
                  hasGameStarted
                    ? lastTurns![lastTurns!.length - 1].playerId
                    : undefined
                }
              />
            </Text> */}
            <Text style={{ fontSize: 12, color: APP_COLORS.standardGrey }}>
              {hasGameStarted &&
                timeAgo.format(
                  new Date(lastTurns![lastTurns!.length - 1].createdAt)
                )}
            </Text>
          </View>
        </View>

        {/* Icons (Check and Cancel) aligned to the right */}
        {isLargePlayButton ? (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              title={buttonTitle}
              buttonStyle={
                isMyTurn ? styles.continueButton : styles.startButton
              }
              disabled={disabled}
              onPress={() => joinGame(item.id)}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => joinGame(item.id)}
            >
              <Icon
                name='play-circle'
                color={isMyTurn ? APP_COLORS.appGreen : APP_COLORS.appYellow}
                size={32}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    backgroundColor: APP_COLORS.backgroundColor,
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
    color: 'white',
  },
  startButton: {
    backgroundColor: APP_COLORS.appYellow,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: APP_COLORS.appGreen,
    borderRadius: 5,
  },
});
