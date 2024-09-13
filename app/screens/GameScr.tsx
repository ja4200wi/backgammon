import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
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
import CustomAlert from '../components/misc/customAlert'; // Import your CustomAlert component
import { generateClient, SelectionSet } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import { sendTurn } from '../service/gameService';
import { Button } from '@rneui/themed';
import { DiceProps } from '../components/game/Dice';

interface GameScrProps {
  navigation: any;
  route: any;
}

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const GameScr: React.FC<GameScrProps> = ({ navigation, route }) => {
  const [winnerAlertVisible, setWinnerAlertVisible] = useState(false);
  const [doubleAlertVisible, setDoubleAlertVisible] = useState(false);
  const [winner, setWinner] = useState<PLAYER_COLORS | null>(null); // State to hold the winner
  const { gameId, localPlayerId, gameMode } = route.params;
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
    giveUp,
    legalMovesFrom,
    disabledScreen,
    setGameOver,
    resetGame,
    doubleDice,
    isStartingPhase,
    firstRoll,
    gameOver,
    double,
  } = useGameLogic(gameId);

  const { pointsToWin } = route.params;

  /* useEffect(() => {
    if (gameId !== undefined || gameId !== null) {
      const sub = client.models.Turns.observeQuery({
        filter: { gameId: { eq: gameId } },
      }).subscribe({
        next: ({ items, isSynced }) => {
          setTurns(items);
        },
      });

      return () => sub.unsubscribe();
    }
  }, []); */

  useEffect(() => {
    startGame(gameMode);
  }, []);

  useEffect(() => {
    if (gameOver.gameover) {
      setWinner(gameOver.winner);
      setWinnerAlertVisible(true); // Show the modal when the game is over
    }
  }, [gameOver]);
  const handleDoubleGiveUp = () => {
    if (game) {
      const looser =
        game.getCurrentPlayer() === PLAYER_COLORS.WHITE
          ? PLAYER_COLORS.BLACK
          : PLAYER_COLORS.WHITE;
      giveUp(looser);
      setDoubleAlertVisible(false);
    }
  };
  const handeDoubleAccept = () => {
    double();
    setDoubleAlertVisible(false);
  };
  const handleDouble = () => {
    if (gameMode === GAME_TYPE.COMPUTER) {
      double();
    } else {
      setDoubleAlertVisible(true);
    }
  };
  const handleWinnerAccept = () => {
    setGameOver({ gameover: false, winner: PLAYER_COLORS.NAP });
    resetGame();
    startGame(gameMode);
    setWinnerAlertVisible(false);
  };

  const handleWinnerDecline = () => {
    navigation.navigate('Home'); // Navigate to the home screen
    setWinnerAlertVisible(false); // Hide the modal
  };

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
          doubleDice={doubleDice}
        />
      </View>
      <GameNavBar
        disableButtons={game ? disabledScreen(game) : false}
        onAcceptMove={updateMoveIsOver}
        onUndoMove={undoMove}
        showAcceptMoveButton={showAcceptMoveButton(game!)}
        showUndoMoveButton={showUndoMoveButton(game!)}
        onDouble={handleDouble}
      />

      {/* Custom Modal for Winner Announcement */}
      <CustomAlert
        visible={winnerAlertVisible}
        headline={`${winner} wins the Game`}
        bodyText='What would you like to do?'
        acceptButtonText='Restart'
        declineButtonText='Go to Home'
        onAccept={handleWinnerAccept}
        onDecline={handleWinnerDecline}
      />
      <CustomAlert
        visible={doubleAlertVisible}
        headline={`${game?.getCurrentPlayer()} wants do double!`}
        bodyText='Do you accept the Double or do you want to give up?'
        acceptButtonText='Accept'
        declineButtonText={`Give up (-${doubleDice.getMultiplicator()})`}
        onAccept={handeDoubleAccept}
        onDecline={handleDoubleGiveUp}
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
