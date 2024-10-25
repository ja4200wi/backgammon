import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { showAcceptMoveButton, showUndoMoveButton } from '../gameLogic/gameUtils';
import Board from '../components/game/Board';
import { useGameLogic } from '../hooks/useGameLogic';
import {
  DIMENSIONS,
  APP_COLORS,
  PLAYER_COLORS,
  DICE_COLORS,
  GAME_TYPE,
  GAME_SETTINGS,
} from '../utils/constants';
import { distributeCheckersGame } from '../gameLogic/gameUtils';
import HeaderSecondary from '../components/navigation/HeaderSecondary';
import GameNavBar from '../components/navigation/GameNavBar';
import CustomAlert from '../components/misc/customAlert';
import { Turn } from '../gameLogic/turn';
import LoadingPopup from '../components/misc/LoadingAlert';
import AnimatedChecker from '../components/game/AnimatedChecker';
import GameOverModal from '../components/game/GameOverModal';
import LoadingAlert from '../components/misc/LoadingAlert';
import { useGameState } from '../hooks/GameStateContext';
import { ConsoleLogger } from 'aws-amplify/utils';
import { useGameHelper } from '../hooks/useGameLogicHelper';

interface GameScrProps {
  navigation: any;
  route: any;
}

const initialSpikes: React.ReactElement[][] = new Array(26)
  .fill(null)
  .map(() => []);

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckersGame(initialSpikesSetup);

const GameScr: React.FC<GameScrProps> = ({ navigation, route }) => {
  const [winnerOfflineAlertVisible, setWinnerOfflineAlertVisible] =
    useState(false);
  const [winnerOnlineAlertVisible, setWinnerOnlineAlertVisible] =
    useState(false);
  const [winner, setWinner] = useState<PLAYER_COLORS | string | null>(null); // State to hold the winner
  const [doCheckerAnimation, setDoCheckerAnimation] = useState<boolean>(false);
  const [animatedCheckerValues, setAnimatedCheckerValues] = useState<{
    sx: number;
    sy: number;
    ex: number;
    ey: number;
  }>({ sx: 0, sy: 0, ex: 0, ey: 0 });
  const { gameId, localPlayerId, gameMode, botType } = route.params;
  const {
    boardRef,
    opponentPlayerId,
    onMoveChecker,
    startGame,
    updateMoveIsOver,
    isOnlineGame,
    isOfflineGame,
    undoMove,
    handleDisableScreen,
    giveUp,
    legalMovesFrom,
    resetGame,
    sendTurnToServer,
    sendFinalGameStateToServer,
    double,
    onlineTurns,
  } = useGameLogic(
  );

  const { 
    isLoadingGame,
    firstRoll,
    isStartingPhase,
    game, 
    positions,
    doubleDice,
    gameOver,
    setGameOver,
    setGameId,
    setLocalPlayerId,
    doubleAlertVisible,
    setDoubleAlertVisible,
    setIsWaitingForDouble,
    showWaitingDouble,
    setShowWaitingDouble
  } = useGameState()

  const {disabledScreen} = useGameHelper()

  useEffect(() => {
    console.log('firstroll GAMESCR',firstRoll,"startingphase",isStartingPhase)
  },[firstRoll,isStartingPhase])

  const { pointsToWin } = route.params;
  const [startedGame, setStartedGame] = useState<boolean>(false);
  {/* START GAME*/}
  useEffect(() => {
    if(!startedGame) {
      console.log('SETTING GAMEID',gameId)
      setGameId(gameId)
      setLocalPlayerId(localPlayerId)
    }
    if (!startedGame && gameMode === GAME_TYPE.PASSPLAY) {
      console.log('Starting Game')
      setStartedGame(true);
      startGame(gameMode);
    } else if (!startedGame && gameMode === GAME_TYPE.COMPUTER) {
      setStartedGame(true);
      startGame(gameMode, undefined, botType);
    } else if (
      !startedGame &&
      isOnlineGame(gameMode) &&
      onlineTurns &&
      onlineTurns.length > 0
    ) {
      setStartedGame(true);
      startGame(gameMode, onlineTurns);
    }
  }, [onlineTurns, startedGame]);
  {/* END GAME*/}
  useEffect(() => {
    if (gameOver.gameover) {
      setWinner(gameOver.winner);
      if (
        isOnlineGame() &&
        gameOver.reason &&
        gameOver.winner === localPlayerId
      ) {
        sendFinalGameStateToServer(
          gameOver.winner,
          opponentPlayerId,
          gameOver.reason
        );
      }
      isOnlineGame(gameMode)
        ? setWinnerOnlineAlertVisible(true)
        : setWinnerOfflineAlertVisible(true); 

    }
  }, [gameOver]);
  const handeDoubleAccept = () => {
    double();
    if (isOnlineGame(gameMode)) {
      sendTurnToServer(new Turn(), 'DOUBLE');
    }
    setDoubleAlertVisible(false);
  };
  const handleDouble = () => {
    if (gameMode === GAME_TYPE.COMPUTER) {
      double();
    } else if (isOnlineGame(gameMode)) {
      sendTurnToServer(new Turn(), 'DOUBLE');
      setIsWaitingForDouble(true);
      setShowWaitingDouble(true)
      //set wait for double true
    } else {
      setDoubleAlertVisible(true);
    }
  };
  const handleRestart = () => {
    setGameOver({ gameover: false, winner: PLAYER_COLORS.NAP });
    resetGame();
    startGame(gameMode);
    setWinnerOfflineAlertVisible(false);
  };
  const handleGiveUp = (type?: 'DOUBLE' | 'STANDARD') => {
    if (game) {
      let looser;
      if (type === 'STANDARD') {
        looser = game.getCurrentPlayer();
        if (isOnlineGame(gameMode)) {
          sendTurnToServer(new Turn(), 'GIVE_UP');
        }
      } else {
        sendTurnToServer(new Turn(), 'GIVE_UP');
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
  const getHeadline = (): string => {
    if (botType) {
      return `Play vs ${botType}`;
    }
    switch (gameMode) {
      case GAME_TYPE.FRIENDLIST:
        return 'Play vs Friend';
      case GAME_TYPE.PASSPLAY:
        return 'Local Game';
      default:
        return 'Backgammon';
    }
  };

  const handleMoveChecker = async (
    sourceIndex: number,
    targetIndex: number
  ) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    return success;
  };
  const handlePlayAgain = () => {
    setWinnerOnlineAlertVisible(false);
    //for now naviagate to Join Game
    navigation.navigate('OnlineMatching', {});
  };

  const handleAnimation = async (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    setAnimatedCheckerValues({ sx: startX, sy: startY, ex: endX, ey: endY });
    setDoCheckerAnimation(true);
    setTimeout(() => {
      setDoCheckerAnimation(false);
    }, GAME_SETTINGS.checkerAnimationDuration);
  };
  const handleCloseDouble = () => {
    handleDisableScreen(true)
    setShowWaitingDouble(false)
  }
  const handleGoPlayFriends = () => {
    setShowWaitingDouble(true)
    navigation.navigate('PlayFriend', { localPlayerId: localPlayerId });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {/* Container for AnimatedChecker to ensure it is on top */}
      <View style={styles.animatedCheckerContainer}>
        {doCheckerAnimation && (
          <AnimatedChecker
            color={game ? game.getCurrentPlayer() : PLAYER_COLORS.WHITE}
            width={DIMENSIONS.spikeWidth}
            height={DIMENSIONS.spikeWidth}
            startX={animatedCheckerValues.sx}
            startY={animatedCheckerValues.sy}
            endX={animatedCheckerValues.ex}
            endY={animatedCheckerValues.ey}
          />
        )}
      </View>
      <HeaderSecondary navigation={navigation} headline={getHeadline()} />
      <View style={styles.boardContainer}>
        <Board
          ref={boardRef}
          positions={positions}
          currentPlayer={game?.getCurrentPlayer()!}
          pipCount={game ? [game?.getDistances().distWhite,game?.getDistances().distBlack] : [167,167]}
          homeCount={game ? [game?.getHomeCheckers(PLAYER_COLORS.WHITE),game?.getHomeCheckers(PLAYER_COLORS.BLACK)] : [0,0]}
          dice={{
            diceOne: game ? game?.getDice()[0] : 1,
            diceTwo: game ? game?.getDice()[1] : 2,
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
          handleAnimation={handleAnimation}
          localPlayerId={localPlayerId}
          opponentPlayerId={opponentPlayerId}
          gameMode={gameMode}
          isLoadingGame={isLoadingGame}
        />
      </View>
      <GameNavBar
        disableButtons={game ? disabledScreen(game) : false}
        onAcceptMove={updateMoveIsOver}
        onUndoMove={undoMove}
        showAcceptMoveButton={showAcceptMoveButton(game!)}
        showUndoMoveButton={showUndoMoveButton(game!)}
        onDouble={handleDouble}
        giveUp={handleGiveUp}
        onRestart={handleRestart}
        allowDouble={
          game ? doubleDice.getLastDobule() === game.getCurrentPlayer() : false
        }
        showRestartGame={isOfflineGame()}
        showGiveUp={onlineTurns ? onlineTurns!.length >= 5 : false}
      />

      {/* Custom Modal for Winner Announcement */}
      {/* Offline Winner Modal */}
      <GameOverModal
        visible={winnerOfflineAlertVisible}
        winner={winner}
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
      <GameOverModal
        visible={winnerOnlineAlertVisible}
        winner={winner}
        onAccept={handlePlayAgain}
        onDecline={handleGoHome}
      />
      {/* Waiting for Double Modal */}
      <CustomAlert
        visible={showWaitingDouble}
        headline={`You just Doubled!`}
        bodyText='We are waiting for the response of your opponent. Come back later!'
        acceptButtonText='Next Match'
        declineButtonText={`Got it!`}
        onAccept={handleGoPlayFriends}
        onDecline={handleCloseDouble}
      />
      <LoadingAlert visible={isLoadingGame} message='' />
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
  animatedCheckerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // High z-index to ensure it's on top of all elements
    pointerEvents: 'none', // Prevents this container from intercepting touch events
  },
});

export default GameScr;
