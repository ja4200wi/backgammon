import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Button, TouchableOpacityBase, TouchableOpacity, Alert} from 'react-native';
import Spike from '../components/Spike';
import Checker from '../components/Checker';
import Dice, { DiceProps } from '../components/Dice';
import PipCount from '../components/PipCount';
import Board from '../components/Board';
import { Game } from '../gameLogic/backgammon';
import EventEmitter from 'eventemitter3';
import { GameInstance } from '../gameLogic/testlogic';
import { COLORS } from '../components/Board';


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
  // Backgammon starting positions
  const startingPositions = [
    {index: 0, color: COLORS.WHITE, count: 2},
    {index: 11, color: COLORS.WHITE, count: 5},
    {index: 16, color: COLORS.WHITE, count: 3},
    {index: 18, color: COLORS.WHITE, count: 5},
    {index: 23, color: COLORS.BLACK, count: 2},
    {index: 12, color: COLORS.BLACK, count: 5},
    {index: 7, color: COLORS.BLACK, count: 3},
    {index: 5, color: COLORS.BLACK, count: 5},
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
    {index: 0, color: COLORS.WHITE, count: 2},
    {index: 11, color: COLORS.WHITE, count: 5},
    {index: 16, color: COLORS.WHITE, count: 3},
    {index: 18, color: COLORS.WHITE, count: 5},
    {index: 23, color: COLORS.BLACK, count: 2},
    {index: 12, color: COLORS.BLACK, count: 5},
    {index: 7, color: COLORS.BLACK, count: 3},
    {index: 5, color: COLORS.BLACK, count: 5},
  ];


  const [dice,setdice] = useState<number[]>([1,2])
  const [moveIsOver, setmoveIsOver] = useState(true)
  const [game, setGame] = useState<GameInstance | null>(null);
  const [positions, setpositions] = useState(startingPositions)
  const firstmove = true
  
  useEffect(() => {
    if (game && moveIsOver) {
      runGame(game);
    }
  }, [moveIsOver, game]);

  const startGame = () => {
    console.log('Game started');
    let newgame = new GameInstance
    setGame(newgame)
    runGame(newgame)
  }

  const runGame = (game: GameInstance) => {
    if (game.gameisover){
      return
    }
    //case user clicked endmove
    else if(!game.gameisover && moveIsOver) {
      if(game?.movesLeft.length === 0) {
        console.log('this works')
        setmoveIsOver(false)
        game.rollDice()
        setdice([...game.dice])
        game.currentPlayer = game.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE
      } else {
        Alert.alert('You still have moves left')
      }
    }
  }
  const onMoveChecker = async (sourceIndex: number, targetIndex: number) => {
    console.log('we are in onmovechecker now',sourceIndex,targetIndex)
    if (game) {
      console.log('we are in if now')
      const success = game.moveChecker(sourceIndex, targetIndex);
      console.log("now we return" + success)
      console.log('current game', game.positions)
      setpositions([...game.positions]);
      return success;
    }
    return false;
  };
  const endmove = () => {
    setmoveIsOver(true)
  }
  return (
    <View style={[styles.container, {backgroundColor: secondBackgroundColor}]}>
      {/*später dann 167 mit currentcount ersetzen*/}
      <View style={{flexDirection: 'row', gap: 50}}>
      <TouchableOpacity onPress={startGame} style={styles.tempStartButton} >
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Start Game</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={endmove} style={styles.tempStartButton} >
        <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center', textAlignVertical: 'center'}}>End Move</Text>
      </TouchableOpacity>
      </View>
      <PipCount color="white" count="167" />
      {/* <View style={styles.board}>{renderSpikes()}</View> */}
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
        dice={{diceOne: dice[0], diceTwo: dice[1]}}
        onMoveChecker={onMoveChecker}
        ></Board>
        
      <PipCount color="black" count="167" />
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
