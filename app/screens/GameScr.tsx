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
import { on } from 'events';
import { Turn } from '../gameLogic/turn';
import LoadingPopup from '../components/misc/LoadingAlert';

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
  const [winnerOfflineAlertVisible, setWinnerOfflineAlertVisible] = useState(false);
  const [winnerOnlineAlertVisible, setWinnerOnlineAlertVisible] = useState(false);
  const [doubleAlertVisible, setDoubleAlertVisible] = useState(false);
  const [winner, setWinner] = useState<PLAYER_COLORS | string | null>(null); // State to hold the winner
  const [isWaitingForDouble, setIsWaitingForDouble] = useState<boolean>(false)
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
    isOfflineGame,
    undoMove,
    giveUp,
    legalMovesFrom,
    disabledScreen,
    setGameOver,
    resetGame,
    sendTurnToServer,
    doubleDice,
    isStartingPhase,
    firstRoll,
    gameOver,
    double,
    onlineTurns,
  } = useGameLogic(gameId,localPlayerId,setDoubleAlertVisible,isWaitingForDouble,setIsWaitingForDouble);

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
  const [startedGame,setStartedGame] = useState<boolean>(false)
  useEffect(() => {
    if(!startedGame && (gameMode === GAME_TYPE.COMPUTER || gameMode === GAME_TYPE.PASSPLAY)) {
      setStartedGame(true)
      startGame(gameMode);
    } else if(!startedGame && gameMode === GAME_TYPE.ONLINE && onlineTurns && onlineTurns.length > 0) {
      setStartedGame(true)
      startGame(gameMode,onlineTurns)
    }
    
  }, [onlineTurns,startedGame]);
  useEffect(() => {
    if (gameOver.gameover) {
      setWinner(gameOver.winner);
      gameMode === GAME_TYPE.ONLINE ? setWinnerOnlineAlertVisible(true) : setWinnerOfflineAlertVisible(true); // Show the modal when the game is over
    }
  }, [gameOver]);
  const handeDoubleAccept = () => {
    double();
    if(gameMode === GAME_TYPE.ONLINE) {
      sendTurnToServer(new Turn(),'DOUBLE')
    }
    setDoubleAlertVisible(false);
  };
  const handleDouble = () => {
    if (gameMode === GAME_TYPE.COMPUTER) {
      double();
    } else if(gameMode === GAME_TYPE.ONLINE) {
      sendTurnToServer(new Turn(),'DOUBLE')
      setIsWaitingForDouble(true)
      //set wait for double true
    }
    
    else {
      setDoubleAlertVisible(true);
    }
  };
  const handleRestart = () => {
    setGameOver({ gameover: false, winner: PLAYER_COLORS.NAP });
    resetGame();
    startGame(gameMode);
    setWinnerOfflineAlertVisible(false);
  };
  const handleGiveUp = (type?:'DOUBLE' | 'STANDARD') => {
    if (game) {
      let looser
      if(type === 'STANDARD') {
        looser = game.getCurrentPlayer()
        if(gameMode === GAME_TYPE.ONLINE) {
          sendTurnToServer(new Turn(),'GIVE_UP')
        }
      } else {
        sendTurnToServer(new Turn(),'GIVE_UP')
        looser =
        game.getCurrentPlayer() === PLAYER_COLORS.WHITE
          ? PLAYER_COLORS.BLACK
          : PLAYER_COLORS.WHITE;
      }

      giveUp(looser);
      setDoubleAlertVisible(false);
    }
  };
  const handleGoHome = () => {
    navigation.navigate('Home'); // Navigate to the home screen
    setWinnerOfflineAlertVisible(false); // Hide the modal
    setWinnerOnlineAlertVisible(false);
  };

  const handleMoveChecker = async (
    sourceIndex: number,
    targetIndex: number
  ) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    return success;
  };
  const handlePlayAgain = () => {
    setWinnerOnlineAlertVisible(false)
    //for now naviagate to Join Game
    navigation.navigate('OnlineMatching', {});
  }

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
          disableScreen={disabledScreen(game!)}
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
        giveUp = {handleGiveUp}
        onRestart={handleRestart}
        allowDouble={game ? doubleDice.getLastDobule() === game.getCurrentPlayer() : false}
        showRestartGame={isOfflineGame()}
      />

      {/* Custom Modal for Winner Announcement */}
      {/* Offline Winner Modal */}
      <CustomAlert
        visible={winnerOfflineAlertVisible}
        headline={`${winner} wins the Game`}
        bodyText='What would you like to do?'
        acceptButtonText='Restart'
        declineButtonText='Go to Home'
        onAccept={handleRestart}
        onDecline={handleGoHome}
      />
      {/* Double Modal */}
      <CustomAlert
        visible={doubleAlertVisible}
        headline={`${game?.getCurrentPlayer()} wants do double!`}
        bodyText='Do you accept the Double or do you want to give up?'
        acceptButtonText='Accept'
        declineButtonText={`Give up (-${doubleDice.getMultiplicator()})`}
        onAccept={handeDoubleAccept}
        onDecline={handleGiveUp}
      />
      {/* Online Winner Modal */}
      <CustomAlert
        visible={winnerOnlineAlertVisible}
        headline={`${winner} wins the Game`}
        bodyText='What would you like to do?'
        acceptButtonText='Play Again'
        declineButtonText='Go to Home'
        onAccept={handlePlayAgain}
        onDecline={handleGoHome}
      />
      <LoadingPopup 
        visible={isWaitingForDouble}
        message='Waiting for the response of your opponent!'
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
