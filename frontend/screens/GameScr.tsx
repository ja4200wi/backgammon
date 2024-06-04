import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Checker from '../components/Checker';
import PipCount from '../components/PipCount';
import Board from '../components/Board';
import {Game} from '../gameLogic/backgammon';
import {COLORS} from '../components/Board';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const boardWidth = screenWidth * 0.95;
const boardHeight = screenHeight * 0.7;
const spikeWidth = boardWidth / 13;
const spikeHeight = boardHeight / 2 - 30;
const backgroundColor = '#dda15e';
const secondBackgroundColor = '#606c38';
const primaryColor = '#283618';
const secondaryColor = '#fefae0';
const tertiaryColor = '#bc6c25';

const initialSpikes: React.ReactElement[][] = new Array(24)
  .fill(null)
  .map(() => []);

const whiteCheckers: React.ReactElement[] = new Array(15)
  .fill(null)
  .map((_, index) => (
    <Checker
      key={`white-${index}`}
      color="white"
      width={spikeWidth}
      height={spikeWidth}
    />
  ));

const blackCheckers: React.ReactElement[] = new Array(15)
  .fill(null)
  .map((_, index) => (
    <Checker
      key={`black-${index}`}
      color="black"
      width={spikeWidth}
      height={spikeWidth}
    />
  ));

const distributeCheckers = (spikes: React.ReactElement[][]) => {
  // Backgammon starting
  const startingPositions = [
    {index: 0, color: 'white', count: 2},
    {index: 11, color: 'white', count: 5},
    {index: 16, color: 'white', count: 3},
    {index: 18, color: 'white', count: 5},
    {index: 23, color: 'black', count: 2},
    {index: 12, color: 'black', count: 5},
    {index: 7, color: 'black', count: 3},
    {index: 5, color: 'black', count: 5},
  ];

  startingPositions.forEach(position => {
    const {index, color, count} = position;
    for (let i = 0; i < count; i++) {
      if (color === COLORS.WHITE) {
        const checker = whiteCheckers.pop();
        if (checker) {
          spikes[index].push(checker);
        }
      } else {
        const checker = blackCheckers.pop();
        if (checker) {
          spikes[index].push(checker);
        }
      }
    }
  });
};

// Initial distribution of checkers
const initialSpikesSetup = [...initialSpikes];
distributeCheckers(initialSpikesSetup);

const GameScr = () => {
  const startingPositions = [
    {index: 0, color: 'white', count: 2},
    {index: 11, color: 'white', count: 5},
    {index: 16, color: 'white', count: 3},
    {index: 18, color: 'white', count: 5},
    {index: 23, color: 'black', count: 2},
    {index: 12, color: 'black', count: 5},
    {index: 7, color: 'black', count: 3},
    {index: 5, color: 'black', count: 5},
  ];

  const startScores = [167, 167]; //white, black

  const [dice, setdice] = useState<number[]>([1, 2]);
  const [moveIsOver, setmoveIsOver] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [positions, setpositions] = useState(startingPositions);
  const [scores, setScores] = useState(startScores);
  const firstmove = true;

  useEffect(() => {
    if (game && moveIsOver) {
      runGame(game);
    }
  }, [moveIsOver, game]);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    console.log('Game started');
    let newgame = new Game();
    setGame(newgame);
    runGame(newgame);
  };

  const runGame = (game: Game) => {
    game.updateDistances();
    updateScores();
    if (game.isGameOver()) {
      return;
    }
    //case user clicked endmove
    if (game?.movesLeft.length === 0) {
      game.rollDice();
      setdice([...game.dice]);
      game.currentPlayer =
        game.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    }
  };

  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
    if (game) {
      const success = game.moveStone(sourceIndex, targetIndex);
      setpositions(game.getCurrentPositions());
      console.log(game.getCurrentPositions());
      setmoveIsOver(game.movesLeft.length === 0);
      game.updateDistances();
      updateScores();
      return success;
    }
    return false;
  };

  const updateScores = () => {
    setScores([game?.totalDistanceWhite!, game?.totalDistanceBlack!]);
  };

  return (
    <View style={[styles.container, {backgroundColor: secondBackgroundColor}]}>
      <PipCount color="white" count={scores[0]} />
      <Board
        colors={{
          background: backgroundColor,
          primary: primaryColor,
          secondary: secondaryColor,
          tertiary: tertiaryColor,
        }}
        width={boardWidth}
        height={boardHeight}
        positions={positions}
        dice={{diceOne: dice[0], diceTwo: dice[1], color: game?.currentPlayer!}}
        onMoveChecker={onMoveChecker}></Board>

      <PipCount color="black" count={scores[1]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: boardWidth,
    height: boardHeight,
    backgroundColor: '#f5deb3',
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: '#000',
    flexDirection: 'row',
    rowGap: boardHeight - spikeHeight * 2,
    flexWrap: 'wrap',
  },
  blackView: {
    width: spikeWidth,
    height: spikeHeight,
    backgroundColor: '#000000',
  },
  tempStartButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 30,
  },
});

export default GameScr;
