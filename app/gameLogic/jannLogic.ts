import { BOARD_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Game } from './backgammon';
import { Board } from './board';
import { Move } from './move';
import { Turn } from './turn';

const botGameColor = PLAYER_COLORS.BLACK;
const prisonMultiplier = -25;
const occupiedMultiplier = 5;
const enemyScoreMultiplier = 1; //the higher enemy score the better

class GameAndTurn {
  public game: Game;
  public moves: Move[];

  constructor(game: Game, moves: Move[]) {
    this.game = game;
    this.moves = moves;
  }

  deepCopy(): GameAndTurn {
    const copyMoves = [];
    for (const move of this.moves) {
      copyMoves.push(new Move(move.from, move.to));
    }
    return new GameAndTurn(this.game.deepCopy(), copyMoves);
  }
}

export function useJannHeuristic(game: Game): Turn {
  let turn = null;
  let maxScore = -1000000;
  const nextStates = simulateAllMoves(game, []);
  for (const possNextState of nextStates) {
    const score = getGameStateEvaluation(possNextState.game);
    const isNewBestTurn = score > maxScore;
    maxScore = isNewBestTurn ? score : maxScore;
    turn = isNewBestTurn ? new Turn(possNextState.moves) : turn;
  }
  if (turn == null) {
    return new Turn();
  } else return turn;
}

function simulateAllMoves(gameAndTurn: GameAndTurn): GameAndTurn[] {
  const gamesAfterMove: GameAndTurn[] = [];
  for (const possMove of gameAndTurn.game.getAllPossibleMoves()) {
    const gameAndTurnCopy = gameAndTurn.deepCopy();
    gameCopy.moveStone(possMove.from, possMove.to);
    moves.push(possMove);
    gamesAfterMove.push({ game: copy, moves });
  }
  return gamesAfterMove;
}

export function getGameStateEvaluation(game: Game): number {
  let evaluation = 0;
  const gameBoard = transformPositionToBoard(game.getCurrentPositions());
  const prisonPunishment =
    gameBoard.getBlackPrisoners().length * prisonMultiplier;
  const occupiedSpikesReward =
    getNumOfSpikesOccupied(gameBoard) * occupiedMultiplier;
  const enemyScoreReward =
    game.calculateTotalDistance(PLAYER_COLORS.WHITE) * enemyScoreMultiplier;
  evaluation = prisonPunishment + occupiedSpikesReward + enemyScoreReward;
  return evaluation;
}

function getNumOfSpikesOccupied(board: Board): number {
  let occupied = 0;
  for (let i = 1; i < 25; i++) {
    if (board.getNumCheckersOnSpikeOffColor(botGameColor, i) > 1) {
      occupied++;
    }
  }
  return occupied;
}

function transformPositionToBoard(
  positions: {
    index: number;
    color: PLAYER_COLORS;
    count: number;
  }[]
): Board {
  let board = new Board(BOARD_TYPE.EMPTY);

  for (let i = 0; i < 26; i++) {
    // Check if there is a position for this index
    const position = positions.find((pos) => pos.index === i);
    if (position) {
      board.pushXCheckersOnSpike(
        position.count,
        position.index,
        position.color
      );
    }
  }
  return board;
}
