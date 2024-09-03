import React, {useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/elements';
import Board from '../components/Board';
import {useGameLogic} from '../hooks/useGameLogic';
import {
  DIMENSIONS,
  APP_COLORS,
  PLAYER_COLORS,
  DICE_COLORS,
  BOARD_COLORS,
} from '../utils/constants';
import {distributeCheckersGame} from '../gameLogic/gameUtils';

interface GameScrProps {
  navigation: NavigationProp<ParamListBase>;
}

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const GameScr: React.FC<GameScrProps> = ({navigation}) => {
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
  } = useGameLogic();

  useEffect(() => {
    if (game && moveIsOver) {
      runGame(game);
    }
  }, [moveIsOver, game, dice]);

  const handleMoveChecker = async (
    sourceIndex: number,
    targetIndex: number,
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
        {cancelable: false},
      );
    }
    return success;
  };

  return (
    <View style={[styles.container, { backgroundColor: APP_COLORS.backgroundColor }]}>
      <HeaderBackButton
        onPress={() => navigation.goBack()}
        tintColor="white" // You can customize the color if needed
        style={{alignSelf: 'flex-start'}}
      />
      <Board
        colors={{
          backgroundColor: BOARD_COLORS.BACKGROUND,
          spikeLightColor: BOARD_COLORS.SPIKELIGHT,
          spikeDarkColor: BOARD_COLORS.SPIKEDARK,
          prisonColor: BOARD_COLORS.PRISON,
        }}
        width={DIMENSIONS.boardWidth}
        height={DIMENSIONS.boardHeight}
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
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40, // Add some padding to avoid overlap with the back button
  },
});

export default GameScr;
