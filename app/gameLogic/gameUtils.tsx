import { ReactElement } from 'react';
import Checker from '../components/game/Checker';
import {
  APP_COLORS,
  DIMENSIONS,
  GAME_SETTINGS,
  PLAYER_COLORS,
} from '../utils/constants';

export const initializeSpikes = (): ReactElement[][] => {
  return new Array(26).fill(null).map(() => []);
};
export const initializeCheckers = (
  color: PLAYER_COLORS.WHITE | PLAYER_COLORS.BLACK
): ReactElement[] => {
  return new Array(GAME_SETTINGS.checkerCount)
    .fill(null)
    .map((_, index) => (
      <Checker
        key={`${color}-${index}`}
        color={color}
        width={DIMENSIONS.spikeWidth}
        height={DIMENSIONS.spikeWidth}
      />
    ));
};

export const distributeCheckersGame = (spikes: ReactElement[][]) => {
  const startingPositions = GAME_SETTINGS.startingPositions;

  startingPositions.forEach((position) => {
    const { index, color, count } = position;
    for (let i = 0; i < count; i++) {
      if (color === PLAYER_COLORS.WHITE) {
        const checker = whiteCheckers.pop();
        if (checker) spikes[index].push(checker);
      } else {
        const checker = blackCheckers.pop();
        if (checker) spikes[index].push(checker);
      }
    }
  });
};

const whiteCheckers = initializeCheckers(PLAYER_COLORS.WHITE);
const blackCheckers = initializeCheckers(PLAYER_COLORS.BLACK);

//functions

export const initialSpikes = (
  spikeHeight: number,
  spikeWidth: number,
  handleSpikePress: (index: number) => void
) => {
  return Array.from({ length: 26 }, (_, index) => ({
    height: spikeHeight,
    color:
      index % 2 === 0 ? APP_COLORS.primaryColor : APP_COLORS.secondaryColor,
    width: spikeWidth,
    invert: index >= 13,
    checkers: [] as ReactElement[],
    onPress: () => handleSpikePress(index),
  }));
};
