import { Dimensions } from 'react-native';
import { Icon } from '@rneui/themed';
import Friends from '../images/group.svg';
import React from 'react';

export const APP_COLORS = {
  backgroundColor: '#302E2B',
  backgroundColorTransparent: 'rgba(84, 80, 75, 0.9)',
  headerBackGroundColor: '#312F2C',
  cardBackgroundColor: '#54504B',
  iconGrey: '#B5B6B5',
  darkGrey: '#262522',
  standardGrey: '#C7C7C7',
  buttonBlueFontColor: '#007AFF',
  buttonDisabledFontColor: '#808080',
  appGreen: '#6B9C41',
  appYellow: '#F4C300',
  appBlue: '#597FD1',
  appRed: '#C24542',

  primaryColor: '#283618',
  secondaryColor: '#fefae0',
  tertiaryColor: '#bc6c25',
};
export enum COUNTRIES {
  UNITED_STATES = 'us',
  CANADA = 'ca',
  UNITED_KINGDOM = 'gb',
  GERMANY = 'de',
  FRANCE = 'fr',
  ITALY = 'it',
  SPAIN = 'es',
  AUSTRALIA = 'au',
  BRAZIL = 'br',
  JAPAN = 'jp',
  CHINA = 'cn',
  INDIA = 'in',
  MEXICO = 'mx',
  RUSSIA = 'ru',
  SOUTH_AFRICA = 'za',
  SOUTH_KOREA = 'kr',
  NETHERLANDS = 'nl',
  SWEDEN = 'se',
  SWITZERLAND = 'ch',
  TURKEY = 'tr',
  ARGENTINA = 'ar',
  SAUDI_ARABIA = 'sa',
  UNITED_ARAB_EMIRATES = 'ae',
  BELGIUM = 'be',
  NORWAY = 'no',
  POLAND = 'pl',
  PORTUGAL = 'pt',
  DENMARK = 'dk',
  IRELAND = 'ie',
  ISRAEL = 'il',
}

export enum PLAYER_COLORS {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
  NAP = 'NO_PLAYER',
}
export enum DICE_COLORS {
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}
export enum BOARD_COLORS {
  SPIKEDARK = '#283618',
  SPIKELIGHT = '#fefae0',
  BACKGROUND = '#dda15e',
  PRISON = '#bc6c25',
}
export enum BOARD_TYPE {
  DEFAULT = 'default',
  EMPTY = 'empty',
  CUSTOM = 'custom',
}

export enum GAME_TYPE {
  ELO = 'ELO',
  RANDOM = 'RANDOM',
  FRIENDLIST = 'FRIENDLIST',
  COMPUTER = 'COMPUTER',
  PASSPLAY = 'PASSANDPLAY',
}
export enum BOT_DIFFICULTY {
  RANDOM = 'random',
  CUSTOM = 'custom',
  HARD = 'hard',
}

export enum BOT_NAMES {
  RIANA = 'Riana',
  LARRY = 'Larry',
  DEFAULT = 'DEFAULT',
}
export const ICONS = {
  TrophyIcon: (
    <Icon
      name='emoji-events'
      type='material'
      color='#597FD1'
      size={24}
      style={{ marginRight: 16 }}
    />
  ),
  WifiIcon: (
    <Icon
      name='wifi'
      type='material'
      color='#6B9C41'
      size={24}
      style={{ marginRight: 16 }}
    />
  ),
  PeopleIcon: <Friends width={24} height={24} style={{ marginRight: 16 }} />,
  ComputerIcon: (
    <Icon
      name='computer'
      type='material'
      color='#7E7E7E'
      size={24}
      style={{ marginRight: 16 }}
    />
  ),
  SwapHorizIcon: (
    <Icon
      name='swap-horiz'
      type='material'
      color='#C7D159'
      size={24}
      style={{ marginRight: 16 }}
    />
  ),
  BackIcon: (
    <Icon
      name='arrow-back'
      type='material'
      color={APP_COLORS.iconGrey}
      size={28}
    />
  ),
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const boardWidth = screenWidth * 0.95;
const boardHeight = screenHeight * 0.65;
const spikeWidth = boardWidth / 13;
const spikeHeight = boardHeight / 3;
const homeWidth = 135;

// Define dimensions used in the application
export const DIMENSIONS = {
  screenWidth,
  screenHeight,
  boardWidth,
  boardHeight,
  spikeWidth,
  spikeHeight,
  homeWidth,
};

export const GAME_SETTINGS = {
  startingPositions: [
    { index: 1, color: PLAYER_COLORS.WHITE, count: 2 },
    { index: 12, color: PLAYER_COLORS.WHITE, count: 5 },
    { index: 17, color: PLAYER_COLORS.WHITE, count: 3 },
    { index: 19, color: PLAYER_COLORS.WHITE, count: 5 },
    { index: 24, color: PLAYER_COLORS.BLACK, count: 2 },
    { index: 13, color: PLAYER_COLORS.BLACK, count: 5 },
    { index: 8, color: PLAYER_COLORS.BLACK, count: 3 },
    { index: 6, color: PLAYER_COLORS.BLACK, count: 5 },
  ],
  startScores: [167, 167],
  checkerCount: 15,
  startDice: [1, 2],
  startHomeCheckerCount: [0, 0],
  startingScore: [0, 0],
  checkerAnimationDuration: 500,
};
