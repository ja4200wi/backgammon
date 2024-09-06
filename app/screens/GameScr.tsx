import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Board from '../components/game/Board';
import { useGameLogic } from '../hooks/useGameLogic';
import {
  DIMENSIONS,
  APP_COLORS,
  PLAYER_COLORS,
  DICE_COLORS,
} from '../utils/constants';
import { distributeCheckersGame } from '../gameLogic/gameUtils';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import GameNavBar from '../components/navigation/GameNavBar';

interface GameScrProps {
  navigation: NavigationProp<ParamListBase>;
}

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const GameScr: React.FC<GameScrProps> = ({ navigation }) => {
  const {
    game,
    dice,
    moveIsOver,
    positions,
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
    isStartingPhase,
    firstRoll,
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
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderSecondary navigation={navigation} headline='Press & Play' />
      <View style={styles.boardContainer}>
        <Board
          positions={positions}
          currentPlayer={game?.getCurrentPlayer()!}
          pipCount={scores}
          homeCount={homeCheckers}
          dice={{
            diceOne: dice[0],
            diceTwo: dice[1],
            color:
              game?.getCurrentPlayer()! === PLAYER_COLORS.WHITE
                ? DICE_COLORS.WHITE
                : DICE_COLORS.BLACK,
            startingSeq: isStartingPhase,
            firstRoll: firstRoll,
          }}
          onMoveChecker={handleMoveChecker}
          noMovesLeft={hasMovesLeft(game!)}
          onAcceptMove={updateMoveIsOver}
          hasDoneMove={undoMoveButtonState(game!)}
          onUndoMove={undoMove}
          legalMovesFrom={legalMovesFrom}
        />
      </View>
      <GameNavBar navigation={navigation} />
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: APP_COLORS.headerBackGroundColor,
    alignItems: 'center',
  },
  boardContainer: {
    backgroundColor: APP_COLORS.cardBackgroundColor,
    flexGrow: 1,
    width: DIMENSIONS.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
});

export default GameScr;
