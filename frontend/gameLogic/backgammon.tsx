import {Position} from '../components/Board';
import {PLAYER_COLORS} from '../utils/constants';

const BOARD_SIZE = 26; // Total number of positions on the board
const PRISON_INDEX = {WHITE: 0, BLACK: 25};
const BEARING_OFF_INDEX = 100;
const TOTAL_STONES = 15;
const HOME_AREA_START_INDEX = {WHITE: 19, BLACK: 6};
const HOME_AREA_SIZE = 6;

interface Move {
  from: number;
  to: number;
}

export class Game {
  private board: (Stone[] | null)[];
  private currentPlayer: PLAYER_COLORS;
  private dice: [number, number];
  private movesLeft: number[];
  private lastMoves: [(Stone[] | null)[], number[]][];

  constructor();
  constructor(board: (Stone[] | null)[], currentPlayer: PLAYER_COLORS);

  constructor(board?: (Stone[] | null)[], currentPlayer?: PLAYER_COLORS) {
    if (board) {
      this.board = board;
    } else {
      this.board = new Array(BOARD_SIZE).fill([]).map(() => []);
      this.setupTestBoard2();
    }
    if (currentPlayer) {
      this.currentPlayer = currentPlayer;
    } else {
      this.currentPlayer = PLAYER_COLORS.WHITE;
    }
    this.dice = [1, 1];
    this.movesLeft = [];
    this.lastMoves = [];
  }

  private setupDefaultBoard() {
    this.board[1] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[12] = this.createStones(5, PLAYER_COLORS.WHITE);
    this.board[17] = this.createStones(3, PLAYER_COLORS.WHITE);
    this.board[19] = this.createStones(5, PLAYER_COLORS.WHITE);
    this.board[24] = this.createStones(2, PLAYER_COLORS.BLACK);
    this.board[13] = this.createStones(5, PLAYER_COLORS.BLACK);
    this.board[8] = this.createStones(3, PLAYER_COLORS.BLACK);
    this.board[6] = this.createStones(5, PLAYER_COLORS.BLACK);
  }
  private setupBearingOffBoard() {
    this.board[1] = this.createStones(2, PLAYER_COLORS.BLACK);
    this.board[2] = this.createStones(2, PLAYER_COLORS.BLACK);
    this.board[3] = this.createStones(2, PLAYER_COLORS.BLACK);
    this.board[4] = this.createStones(3, PLAYER_COLORS.BLACK);
    this.board[5] = this.createStones(3, PLAYER_COLORS.BLACK);
    this.board[6] = this.createStones(2, PLAYER_COLORS.BLACK);
    this.board[25] = this.createStones(1, PLAYER_COLORS.BLACK);
    this.board[19] = this.createStones(3, PLAYER_COLORS.WHITE);
    this.board[20] = this.createStones(3, PLAYER_COLORS.WHITE);
    this.board[21] = this.createStones(3, PLAYER_COLORS.WHITE);
    this.board[22] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[23] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[24] = this.createStones(2, PLAYER_COLORS.WHITE);
  }

  private setupTestBoard() {
    this.board[3] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[4] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[5] = this.createStones(1, PLAYER_COLORS.BLACK);
    this.board[8] = this.createStones(1, PLAYER_COLORS.BLACK);
  }

  private setupTestBoard2() {
    this.board[3] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[4] = this.createStones(2, PLAYER_COLORS.WHITE);
    this.board[5] = this.createStones(1, PLAYER_COLORS.BLACK);
    this.board[7] = this.createStones(1, PLAYER_COLORS.BLACK);
  }

  private createStones(count: number, color: PLAYER_COLORS): Stone[] {
    return Array.from({length: count}, () => new Stone(color));
  }

  private maximizesSteps(from: number, to: number): boolean {
    if (this.movesLeft.length === 1) return true;
    if (this.dice[0] === this.dice[1]) return true;
    const maxDiceUsable = this.maxDiceUsable(0);
    if (maxDiceUsable === 2) {
      // are two moves possible? if yes, ensure that it still is after this move
      const newGame = this.deepCopy();
      newGame.handleMoveStoneWithoutMaxCheck(from, to);
      return newGame.hasLegalMove();
    }
    if (maxDiceUsable === 1) {
      // if only one move possible, ensure highest is done, which is still feasible
      const maxStepsFeasible = Math.max(
        ...this.getAllPossibleMoves(this.currentPlayer).map(move =>
          Math.abs(move.from - move.to),
        ),
      );
      const steps = Math.abs(from - to);
      if (steps === maxStepsFeasible) return true;
    }
    return false;
  }

  private maxDiceUsable(diceUsed: number): number {
    if (this.movesLeft.length === 0) return diceUsed;
    const possibleMoves = this.getAllPossibleMoves(this.currentPlayer);
    if (possibleMoves.length === 0) return diceUsed;

    let maxUsed = diceUsed;
    for (const move of possibleMoves) {
      const newGame = this.deepCopy();
      newGame.handleMoveStoneWithoutMaxCheck(move.from, move.to);
      maxUsed = Math.max(maxUsed, newGame.maxDiceUsable(diceUsed + 1));
    }
    return maxUsed;
  }

  private deepCopyBoard(board: (Stone[] | null)[]): (Stone[] | null)[] {
    return board.map(column => {
      if (column === null) {
        return null;
      } else {
        return column.map(stone => ({
          ...stone,
        }));
      }
    });
  }

  private getTarget(from: number, steps: number, color: PLAYER_COLORS): number {
    const direction = color === PLAYER_COLORS.WHITE ? 1 : -1;
    steps = direction * steps;
    if (from + steps > 25) return BEARING_OFF_INDEX;

    return color === PLAYER_COLORS.WHITE ? from + steps : from - steps;
  }

  getBoard(): (Stone[] | null)[] {
    return this.board;
  }

  private handleMoveStone(from: number, to: number): boolean {
    let steps =
      this.currentPlayer === PLAYER_COLORS.WHITE ? to - from : from - to;
    if (to === BEARING_OFF_INDEX)
      steps =
        this.currentPlayer === PLAYER_COLORS.WHITE
          ? PRISON_INDEX['BLACK'] - from
          : from;

    if (!this.isValidMove(from, to, this.board)) {
      return false;
    }
    if (!this.maximizesSteps(from, to)) {
      return false;
    }
    this.safeMoves();
    const stone = this.board[from]?.pop();
    if (!stone) {
      return false;
    }

    this.handleCapture(to);
    this.board[to]?.push(stone);
    this.updateMovesLeft(steps, from, to);
    return true;
  }

  private handleMoveStoneWithoutMaxCheck(from: number, to: number): boolean {
    let steps =
      this.currentPlayer === PLAYER_COLORS.WHITE ? to - from : from - to;
    if (to === BEARING_OFF_INDEX)
      steps =
        this.currentPlayer === PLAYER_COLORS.WHITE
          ? PRISON_INDEX['BLACK'] - from
          : from;

    if (!this.isValidMove(from, to, this.board)) {
      return false;
    }
    this.safeMoves();
    const stone = this.board[from]?.pop();
    if (!stone) {
      return false;
    }

    this.handleCapture(to);
    this.board[to]?.push(stone);
    this.updateMovesLeft(steps, from, to);
    return true;
  }

  private safeMoves() {
    const currentBoard = this.board.map(position =>
      position ? [...position] : null,
    );
    const currentDice = [...this.movesLeft];
    this.lastMoves.push([currentBoard, currentDice]);
  }
  private handleUndoMove(): void {
    if (this.lastMoves.length === 0) return;

    const [board, movesLeft] = this.lastMoves.pop()!;

    this.board = board.map(position => (position ? [...position] : null));

    this.movesLeft = [...movesLeft];
  }
  private handleCapture(to: number): void {
    if (
      this.board[to]?.length === 1 &&
      this.board[to]?.[0].color !== this.currentPlayer
    ) {
      const enemyStone = this.board[to]?.pop();
      if (enemyStone) {
        const prisonIndex =
          this.currentPlayer === PLAYER_COLORS.WHITE
            ? PRISON_INDEX.BLACK
            : PRISON_INDEX.WHITE;
        this.board[prisonIndex]?.push(enemyStone);
      }
    }
  }

  private updateMovesLeft(steps: number, from: number, to: number): void {
    if (to === BEARING_OFF_INDEX) {
      steps = this.currentPlayer === PLAYER_COLORS.WHITE ? 25 - from : from;
      while (steps <= HOME_AREA_SIZE) {
        if (this.movesLeft.includes(steps)) {
          const indexOfMove = this.movesLeft.indexOf(steps);
          if (indexOfMove !== -1) {
            this.movesLeft.splice(indexOfMove, 1);
            steps = 22; //or any other number larger than 6
          }
        } else {
          steps++;
        }
      }
    } else {
      const indexOfMove = this.movesLeft.indexOf(steps);
      if (indexOfMove !== -1) {
        this.movesLeft.splice(indexOfMove, 1);
      }
    }
  }
  private checkForLegalMove(): boolean {
    if (this.movesLeft.length === 0) {
      return true;
    }
    const playerColor = this.currentPlayer;
    const movesLeft = this.movesLeft;

    const positions = this.getCurrentPositions();
    const prisonIndex =
      playerColor === PLAYER_COLORS.WHITE
        ? PRISON_INDEX['WHITE']
        : PRISON_INDEX['BLACK'];

    // If the player has stones in prison, they must move them first
    if (this.hasPrisonChecker()) {
      for (const move of movesLeft) {
        const targetIndex =
          playerColor === PLAYER_COLORS.WHITE ? move : prisonIndex - move;
        if (this.isValidMove(prisonIndex, targetIndex, this.board)) {
          return true;
        }
      }
      return false;
    }

    // If there are no stones in prison, check all stones on the board
    for (const position of positions) {
      if (position.color === playerColor) {
        for (const move of movesLeft) {
          const from = position.index;
          const to =
            playerColor === PLAYER_COLORS.WHITE ? from + move : from - move;
          // Regular move check
          if (this.isValidMove(from, to, this.board)) {
            return true;
          }
          // Check for bearing off
          if (this.isValidMove(from, 100, this.board)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private legalMovesFrom(from: number): number[] {
    const uniqueMovesLeft = [...new Set(this.movesLeft)];
    const legalMoves: number[] = [];
    const playerMultiplier =
      this.currentPlayer === PLAYER_COLORS['WHITE'] ? 1 : -1;
    for (const dice of uniqueMovesLeft) {
      const to = from + dice * playerMultiplier;
      if (this.isValidMove(from, to, this.board)) legalMoves.push(to);
    }
    if (this.isValidMove(from, BEARING_OFF_INDEX, this.board))
      legalMoves.push(BEARING_OFF_INDEX);
    return legalMoves;
  }

  private getAllPossibleMoves(player: PLAYER_COLORS): Move[] {
    const moves: Move[] = [];
    for (let i = 0; i < this.board.length; i++) {
      if (
        this.board[i] !== null &&
        this.board[i]!.length > 0 &&
        this.board[i]![0].color === player
      ) {
        const feasibleTargets = this.legalMovesFrom(i);
        for (const to of feasibleTargets) {
          moves.push({from: i, to});
        }
      }
    }
    return moves;
  }

  private hasPrisonChecker(): boolean {
    return this.board[
      this.currentPlayer === PLAYER_COLORS.WHITE ? 0 : 25
    ]?.some(stone => stone.color === this.currentPlayer)!;
  }

  private isValidMove(
    from: number,
    to: number,
    board: (Stone[] | null)[],
  ): boolean {
    const currentPlayer = this.currentPlayer;
    let steps =
      this.currentPlayer === PLAYER_COLORS.WHITE ? to - from : from - to;
    if (to === BEARING_OFF_INDEX)
      steps =
        this.currentPlayer === PLAYER_COLORS.WHITE
          ? PRISON_INDEX['BLACK'] - from
          : from;
    const directionMultiplier = currentPlayer === PLAYER_COLORS.WHITE ? 1 : -1;

    `Checking isValidMove from ${from} to ${to} for ${currentPlayer}`;

    // Source is valid
    if (from < PRISON_INDEX['WHITE'] || from > PRISON_INDEX['BLACK']) {
      return false;
    }

    // Target is valid
    if (
      to <= PRISON_INDEX['WHITE'] ||
      (to >= PRISON_INDEX['BLACK'] && to <= BEARING_OFF_INDEX) ||
      to > BEARING_OFF_INDEX
    ) {
      if (to !== BEARING_OFF_INDEX) {
        return false;
      }
    }

    // Check if source exists
    if (board[from] === null || board[from]!.length === 0) {
      return false;
    }

    // Check if the stone belongs to the current player
    if (board[from]![0].color !== this.currentPlayer) {
      return false;
    }

    // Check if prison move is necessary
    const prison = currentPlayer === PLAYER_COLORS.WHITE ? board[0] : board[25];
    if (
      prison?.length! > 0 &&
      from !== PRISON_INDEX['WHITE'] &&
      from !== PRISON_INDEX['BLACK']
    ) {
      return false;
    }

    // Check if Bearing off is correct
    if (to === BEARING_OFF_INDEX) {
      if (!this.allCheckersHome(currentPlayer)) {
        return false;
      }
      // check if from is included in moves left
      if (!this.movesLeft.includes(steps)) {
        //check if there is a dice larger then the steps
        if (!this.movesLeft.some(item => item > steps)) {
          ('larger checker found');
          return false;
        } else {
          let largercheckers = 0;
          if (currentPlayer === PLAYER_COLORS.WHITE) {
            for (let i = from - 1; i >= HOME_AREA_START_INDEX['WHITE']; i--) {
              largercheckers += this.countCheckers(currentPlayer, i);
            }
          } else {
            for (let i = from + 1; i <= HOME_AREA_START_INDEX['BLACK']; i++) {
              largercheckers += this.countCheckers(currentPlayer, i);
            }
          }
          if (largercheckers !== 0) {
            return false;
          }
        }
      }
    }

    // Check if the move is in movesLeft
    if (!this.movesLeft.includes(steps) && to !== BEARING_OFF_INDEX) {
      return false;
    }

    // Check if the target position is not occupied by more than 1 opponent checker
    if (
      to !== BEARING_OFF_INDEX &&
      this.board[to] !== null &&
      this.board[to]!.length > 1 &&
      this.board[to]![0].color !== this.currentPlayer
    ) {
      return false;
    }

    // Move is valid
    return true;
  }
  private finishedCheckers(color: PLAYER_COLORS): number {
    let stoneCount = 0;

    for (let i = 0; i < this.board.length; i++) {
      const stonesAtPosition = this.board[i];
      if (stonesAtPosition) {
        stoneCount += stonesAtPosition.filter(
          stone => stone.color === color,
        ).length;
      }
    }

    return TOTAL_STONES - stoneCount;
  }
  private allCheckersHome(color: PLAYER_COLORS): boolean {
    let startIndex =
      color === PLAYER_COLORS.WHITE
        ? HOME_AREA_START_INDEX['WHITE']
        : HOME_AREA_START_INDEX['BLACK'] - 5;
    const checkersInBoard = TOTAL_STONES - this.finishedCheckers(color);
    // Check for stones in prison
    if (color === PLAYER_COLORS.WHITE) {
      if (this.board[PRISON_INDEX['WHITE']]!.length > 0) return false;
    } else if (color === PLAYER_COLORS.BLACK) {
      // Corrected comparison
      if (this.board[PRISON_INDEX['BLACK']]!.length > 0) return false;
    }

    // Count checkers in the home board
    let countCheckersInHome = 0;
    for (let i = 0; i < HOME_AREA_SIZE; i++) {
      countCheckersInHome += this.countCheckers(color, startIndex + i);
    }

    // Check if all checkers are in the home board
    if (checkersInBoard !== countCheckersInHome) return false;
    return true;
  }

  private countCheckers(color: PLAYER_COLORS, index: number): number {
    if (
      index <= PRISON_INDEX['WHITE'] ||
      index >= PRISON_INDEX['BLACK'] ||
      !this.board[index]
    ) {
      return 0;
    }
    return (
      this.board[index]?.filter(stone => stone.color === color).length || 0
    );
  }

  private rollDice(): [number, number] {
    this.dice = [1, 2]; //[this.getRandomDieRoll(), this.getRandomDieRoll()];
    if (this.dice[0] === this.dice[1]) {
      this.movesLeft = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]];
    } else {
      this.movesLeft = [...this.dice];
    }
    return this.dice;
  }

  private getRandomDieRoll(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private calculateTotalDistance(color: PLAYER_COLORS): number {
    let totalDistance = 0;

    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (stones !== null) {
        for (let stone of stones) {
          if (stone.color === color) {
            if (color === PLAYER_COLORS.WHITE) {
              totalDistance += PRISON_INDEX['BLACK'] - i;
            } else if (color === PLAYER_COLORS.BLACK) {
              totalDistance += i;
            }
          }
        }
      }
    }

    return totalDistance;
  }
  //public functions
  public moveStone(from: number, to: number): boolean {
    return this.handleMoveStone(from, to);
  }
  public getCurrentPositions(): {
    index: number;
    color: PLAYER_COLORS;
    count: number;
  }[] {
    const positions: {index: number; color: PLAYER_COLORS; count: number}[] =
      [];
    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (stones && stones.length > 0) {
        const color = stones[0].color;
        const count = stones.length;
        positions.push({index: i, color, count});
      }
    }
    return positions;
  }

  public getDistances(): {distBlack: number; distWhite: number} {
    return {
      distBlack: this.calculateTotalDistance(PLAYER_COLORS.BLACK),
      distWhite: this.calculateTotalDistance(PLAYER_COLORS.WHITE),
    };
  }

  public getHomeCheckers(color: PLAYER_COLORS): number {
    return this.finishedCheckers(color);
  }

  public getDice(): [number, number] {
    return this.dice;
  }

  public getMovesLeft(): number[] {
    return this.movesLeft;
  }

  public getCurrentPlayer(): PLAYER_COLORS {
    return this.currentPlayer;
  }

  public hasLegalMove(): boolean {
    return this.checkForLegalMove();
  }

  public isGameOver(): boolean {
    if (
      this.finishedCheckers(PLAYER_COLORS.BLACK) === TOTAL_STONES ||
      this.finishedCheckers(PLAYER_COLORS.WHITE) === TOTAL_STONES
    ) {
      return true;
    }
    return false;
  }
  public getLastMoves() {
    return this.lastMoves;
  }
  public whoIsWinner(): string {
    if (this.finishedCheckers(PLAYER_COLORS.BLACK) === TOTAL_STONES)
      return PLAYER_COLORS.BLACK;
    if (this.finishedCheckers(PLAYER_COLORS.WHITE) === TOTAL_STONES)
      return PLAYER_COLORS.WHITE;
    return 'no one';
  }

  public getLegalMovesFrom(from: number): number[] {
    return this.legalMovesFrom(from);
  }

  public undoMove() {
    this.handleUndoMove();
  }

  public switchPlayer() {
    this.dice = this.rollDice();
    this.currentPlayer =
      this.currentPlayer === PLAYER_COLORS.WHITE
        ? PLAYER_COLORS.BLACK
        : PLAYER_COLORS.WHITE;
    this.lastMoves = [];
  }

  public deepCopy(): Game {
    const boardCopy = this.deepCopyBoard(this.board);

    const currentPlayerCopy = this.currentPlayer;
    const diceCopy: [number, number] = [...this.dice];
    const movesLeftCopy = [...this.movesLeft];

    const lastMovesCopy = this.lastMoves.map(([boardState, diceState]) => {
      const boardStateCopy = boardState.map(column => {
        if (column === null) {
          return null;
        } else {
          return column.map(stone => new Stone(stone.color));
        }
      });
      const diceStateCopy = [...diceState];
      return [boardStateCopy, diceStateCopy] as [(Stone[] | null)[], number[]];
    });

    // Create a new Game instance with the copied data
    const gameCopy = new Game(boardCopy, currentPlayerCopy);
    gameCopy.dice = diceCopy;
    gameCopy.movesLeft = movesLeftCopy;
    gameCopy.lastMoves = lastMovesCopy;

    return gameCopy;
  }
}

class Stone {
  color: PLAYER_COLORS;

  constructor(color: PLAYER_COLORS) {
    this.color = color;
  }
}
