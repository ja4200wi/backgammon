import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';
import Board, { Position } from '../components/game/Board';
import { useGameLogic } from '../hooks/useGameLogic';
import { APP_COLORS, PLAYER_COLORS, DICE_COLORS } from '../utils/constants';
import { distributeCheckersGame } from '../gameLogic/gameUtils';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const client = generateClient<Schema>();

type Session = Schema['Session']['type'];

export default function OnlineGameScr({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const gameId = route?.params?.gameId;
  const [games, setGames] = useState<Session[]>();

  const [currentPlayer, setCurrentPlayer] = useState<PLAYER_COLORS>(
    PLAYER_COLORS.NAP
  );
  const [positions_new, setPositions] = useState<Position[]>([]);
  const [dice_new, setDice] = useState<number[]>([]);

  const deleteSession = async () => {
    const toBeDeletedSession = {
      id: gameId,
    };
    const { data: deletedSession, errors } = await client.models.Session.delete(
      toBeDeletedSession
    );
    if (errors) {
      console.error('Error deleting session:', errors);
    } else {
      console.log('Deleted session:', deletedSession!.id);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      deleteSession();
    });
    return unsubscribe;
  }, [navigation, gameId]);

  useEffect(() => {
    const sub = client.models.Session.observeQuery({
      filter: { id: { eq: gameId } },
    }).subscribe({
      next: ({ items, isSynced }) => {
        setGames([...items]);
        translateGamestate(items[0]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const translateGamestate = (gameSession: Session) => {
    const gameState = gameSession.gameState;
    if (gameState === undefined || gameState === null) {
      return;
    }
    const positions_new: Position[] = gameState.board!.map((position) => {
      return {
        index: position!.index as number,
        color: position!.color as PLAYER_COLORS,
        count: position!.count as number,
      };
    });
    const dice_new: number[] = gameState.dice! as number[];
    const currentPlayer_new: PLAYER_COLORS =
      gameState.currentPlayer as PLAYER_COLORS;
    setCurrentPlayer(currentPlayer_new);
    setDice(dice_new);
    setPositions(positions_new);
  };

  const {
    game,
    dice,
    moveIsOver,
    scores,
    homeCheckers,
    onMoveChecker,
    startGame,
    runGame,
    hasMovesLeft,
    updateMoveIsOver,
    undoMoveButtonState,
    undoMove,
    legalMovesFrom,
  } = useGameLogic();

  useEffect(() => {
    if (game && moveIsOver) {
      runGame(game);
    }
  }, [moveIsOver, game, dice]);

  const handleMoveChecker = async (
    sourceIndex: number,
    targetIndex: number
  ) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    if (success && game?.isGameOver()) {
      const winner = game.whoIsWinner();
      Alert.alert(
        `${winner} wins the Game`,
        'What would you like to do?',
        [
          {
            text: 'Restart',
            onPress: () => startGame(),
            style: 'cancel',
          },
          {
            text: 'Go to Home',
            onPress: () => navigation.navigate('Home'),
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    }
    return success;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: APP_COLORS.backgroundColor },
      ]}
    >
      <View>
        <HeaderBackButton
          onPress={() => navigation.goBack()}
          tintColor='white' // You can customize the color if needed
          style={{ alignSelf: 'flex-start' }}
        />
        <Text style={{ color: 'white', zIndex: 3 }}>
          {games !== undefined && games[0] !== undefined && games[0].id}
        </Text>
        <Text style={{ color: 'white', zIndex: 3 }}>
          {games !== undefined &&
            games[0] !== undefined &&
            games[0].playerOneID}
        </Text>
        <Text style={{ color: 'white', zIndex: 3 }}>
          {games !== undefined &&
            games[0] !== undefined &&
            games[0].playerTwoID}
        </Text>
      </View>
      <Board
        positions={positions_new}
        currentPlayer={currentPlayer}
        pipCount={scores}
        homeCount={homeCheckers}
        dice={{
          firstRoll: true,
          startingSeq: true,
          diceOne: dice_new[0],
          diceTwo: dice_new[1],
          color:
            game?.getCurrentPlayer()! === PLAYER_COLORS.WHITE
              ? DICE_COLORS.WHITE
              : DICE_COLORS.BLACK,
        }}
        onMoveChecker={handleMoveChecker}
        noMovesLeft={hasMovesLeft(game!)}
        onAcceptMove={updateMoveIsOver}
        hasDoneMove={undoMoveButtonState(game!)}
        onUndoMove={undoMove}
        legalMovesFrom={legalMovesFrom}
      />
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40, // Add some padding to avoid overlap with the back button
  },
});
