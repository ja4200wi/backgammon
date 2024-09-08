import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import Board from '../components/game/Board';
import { useGameLogic } from '../hooks/useGameLogic';
import {
  DIMENSIONS,
  APP_COLORS,
  PLAYER_COLORS,
  DICE_COLORS,
  GAME_TYPE,
} from '../utils/constants';
import { distributeCheckersGame } from '../gameLogic/gameUtils';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import GameNavBar from '../components/navigation/GameNavBar';

interface GameScrProps {
  navigation: any
  route: any
}

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const GameScr: React.FC<GameScrProps> = ({ navigation, route }) => {
  const {
    game,
    dice,
    positions,
    pipCount,
    homeCheckers,
    onMoveChecker,
    startGame,
    showAcceptMoveButton,
    updateMoveIsOver,
    showUndoMoveButton,
    undoMove,
    legalMovesFrom,
    disabledScreen,
    isStartingPhase,
    firstRoll,
    gameOver,
  } = useGameLogic();

  const { gameMode } = route.params;
  useEffect(() => {
    startGame(gameMode);
  }, []);
  useEffect(() => {
    if(gameOver.gameover)
      showWinnerScreen(gameOver.winner)
  }, [gameOver])
  const showWinnerScreen = async (winner: PLAYER_COLORS) => {
    Alert.alert(
      `${winner} wins the Game`,
      'What would you like to do?',
      [
        {
          text: 'Restart',
          onPress: () => {
            startGame(gameMode)
          },
          style: 'cancel',
        },
        {
          text: 'Go to Home',
          onPress: () => {
            navigation.navigate('Home');
          },
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  }
  const handleMoveChecker = async (
    sourceIndex: number,
    targetIndex: number
  ) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    return success;
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderSecondary navigation={navigation} headline={gameMode} />
      <View style={styles.boardContainer}>
        <Board
          positions={positions}
          currentPlayer={game?.getCurrentPlayer()!}
          pipCount={pipCount}
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
          disableScreen={game ? disabledScreen(game) : false}
          onMoveChecker={handleMoveChecker}
          legalMovesFrom={legalMovesFrom}
        />
      </View>
      <GameNavBar
        disableButtons={game ? disabledScreen(game) : false}
        onAcceptMove={updateMoveIsOver}
        onUndoMove={undoMove}
        showAcceptMoveButton={showAcceptMoveButton(game!)}
        showUndoMoveButton={showUndoMoveButton(game!)}
      />
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
