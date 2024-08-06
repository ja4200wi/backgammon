import { Dimensions } from "react-native";

export const APP_COLORS = {
    backgroundColor: '#dda15e',
    secondBackgroundColor: '#606c38',
    primaryColor: '#283618',
    secondaryColor: '#fefae0',
    tertiaryColor: '#bc6c25',
    buttonBlueFontColor: '#007AFF',
    buttonDisabledFontColor: '#808080',
  };
  //change colors for different look
  export enum PLAYER_COLORS {
    WHITE = 'white',
    BLACK = 'black',
    NAP = 'no player'
  }
  export enum DICE_COLORS {
    WHITE = 'white',
    BLACK = 'black',
  }
  export enum BOARD_COLORS {
    SPIKELIGHT = '#283618',
    SPIKEDARK = '#fefae0',
    BACKGROUND = '#dda15e',
    PRISON = '#bc6c25' ,
  }
  
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const boardWidth = screenWidth * 0.95;
const boardHeight = screenHeight * 0.7;
const spikeWidth = boardWidth / 13;
const spikeHeight = boardHeight / 3;

// Define dimensions used in the application
export const DIMENSIONS = {
  screenWidth,
  screenHeight,
  boardWidth,
  boardHeight,
  spikeWidth,
  spikeHeight,
};

  export const GAME_SETTINGS = {
    startingPositions: [
      { index: 0, color: PLAYER_COLORS.WHITE, count: 2 },
      { index: 11, color: PLAYER_COLORS.WHITE, count: 5 },
      { index: 16, color: PLAYER_COLORS.WHITE, count: 3 },
      { index: 18, color: PLAYER_COLORS.WHITE, count: 5 },
      { index: 23, color: PLAYER_COLORS.BLACK, count: 2 },
      { index: 12, color: PLAYER_COLORS.BLACK, count: 5 },
      { index: 7, color: PLAYER_COLORS.BLACK, count: 3 },
      { index: 5, color: PLAYER_COLORS.BLACK, count: 5 },
    ],
    startScores: [167, 167],
    checkerCount: 15,
    startDice: [1,2],
    startHomeCheckerCount: [0,0],
  };