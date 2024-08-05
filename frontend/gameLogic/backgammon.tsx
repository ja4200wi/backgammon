import { PLAYER_COLORS } from "../utils/constants";

const BOARD_SIZE = 26; // Total number of positions on the board
const PRISON_INDEX = { WHITE: 0, BLACK: 25 };
const BEARING_OFF_INDEX = 100;
const TOTAL_STONES = 15;
const HOME_AREA_START_INDEX = { WHITE: 19, BLACK: 6 };
const HOME_AREA_SIZE = 6;

export class Game {
  private board: (Stone[] | null)[];
  private finishWhite: number = 0;
  private finishBlack: number = 0;
  private currentPlayer: PLAYER_COLORS;
  private dice: [number, number];
  private movesLeft: number[];

  // Single implementation of the constructor
  constructor() {
    this.board = new Array(BOARD_SIZE).fill([]).map(() => []);
    this.finishWhite = 0;
    this.finishBlack = 0;
    this.currentPlayer = PLAYER_COLORS.BLACK;
    this.dice = [1, 1];
    this.movesLeft = [];
    this.setupDefaultBoard();
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
  /**
   * Creates a list of stones for a player.
   * @param count - Number of stones to create.
   * @param color - The color of the stones.
   * @returns A list of stones.
   */
  private createStones(count: number, color: PLAYER_COLORS): Stone[] {
    return Array.from({ length: count }, () => new Stone(color));
  }
  /**
   * Moves a stone from one position to another.
   * @param from - The index to move from.
   * @param to - The index to move to.
   * @returns True if the move is successful, otherwise false.
   */
  private handleMoveStone(from: number, to: number): boolean {
    let steps = this.currentPlayer === PLAYER_COLORS.WHITE ? to - from : from - to;

    if (!this.isValidMove(from, to)) {
      return false;
    }

    const stone = this.board[from]?.pop();
    if (!stone) {
      return false;
    }

    this.handleCapture(to)

    this.board[to]?.push(stone);

    this.updateMovesLeft(steps,from,to)

    if(to === BEARING_OFF_INDEX) {
      this.handleBearingOff()
    }

    return true;
  }
  private handleCapture(to: number): void {
    if (this.board[to]?.length === 1 && this.board[to]?.[0].color !== this.currentPlayer) {
      const enemyStone = this.board[to]?.pop();
      if (enemyStone) {
        const prisonIndex = this.currentPlayer === PLAYER_COLORS.WHITE ? PRISON_INDEX.BLACK : PRISON_INDEX.WHITE;
        this.board[prisonIndex]?.push(enemyStone);
      }
    }
  }
  private handleBearingOff(): void {
    if (this.currentPlayer === PLAYER_COLORS.WHITE) {
      this.finishWhite++;
    } else {
      this.finishBlack++;
    }
  }
  private updateMovesLeft(steps: number, from: number, to:number): void {
    if(to === BEARING_OFF_INDEX) {
      steps = this.currentPlayer === PLAYER_COLORS.WHITE ? 25-from : from
      while (steps <= HOME_AREA_SIZE) {
        if (this.movesLeft.includes(steps)) {
          const indexOfMove = this.movesLeft.indexOf(steps);
          if (indexOfMove !== -1) {
            this.movesLeft.splice(indexOfMove, 1);
            steps = 22 //or any other number larger than 6
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
    if (this.movesLeft.length === 0) return true;
    const playerColor = this.currentPlayer;
    const movesLeft = this.movesLeft;
  
    const positions = this.getCurrentPositions();
    const prisonIndex = playerColor === PLAYER_COLORS.WHITE ? PRISON_INDEX['WHITE'] : PRISON_INDEX['BLACK'];
  
    // If the player has stones in prison, they must move them first
    if (this.hasPrisonChecker()) {
      for (const move of movesLeft) {
        const targetIndex = playerColor === PLAYER_COLORS.WHITE ? move : prisonIndex - move;
        if (this.isValidMove(prisonIndex, targetIndex)) {
          return true;
        }
      }
      return false; // No valid moves for prison stones
    }

    // If there are no stones in prison, check all stones on the board
    for (const position of positions) {
      if (position.color === playerColor) {
        for (const move of movesLeft) {
          const from = position.index;
          const to = playerColor === PLAYER_COLORS.WHITE ? from + move : from - move;
  
          // Regular move check
          if (this.isValidMove(from, to)) {
            return true;
          }
  
          // Check for bearing off
          if (this.isValidMove(from, 100)) {
            return true;
          }
        }
      }
    }
    //no valid moves
    return false;
  }

  private hasPrisonChecker(): boolean {
    return this.board[this.currentPlayer === PLAYER_COLORS.WHITE ? 0 : 25]?.some(stone => stone.color === this.currentPlayer)!
  }

  private isValidMove(from: number, to: number): boolean {
    const currentPlayer = this.currentPlayer;
    let steps = currentPlayer === PLAYER_COLORS.WHITE ? to - from : from - to;
    const directionMultiplier = currentPlayer === PLAYER_COLORS.WHITE ? 1 : -1;
  
    (`Checking isValidMove from ${from} to ${to} for ${currentPlayer}`);
  
    // Source is valid
    if (from < PRISON_INDEX['WHITE'] || from > PRISON_INDEX['BLACK']) {
      return false;
    }
  
    // Target is valid
    if (to <= PRISON_INDEX['WHITE'] || (to >= PRISON_INDEX['BLACK'] && to <= BEARING_OFF_INDEX) || to > BEARING_OFF_INDEX) {
      if (to !== BEARING_OFF_INDEX) {
        return false;
      }
    }
  
    // Check if source exists
    if (this.board[from] === null || this.board[from]!.length === 0) {
      return false;
    }
  
    // Check if the stone belongs to the current player
    if (this.board[from]![0].color !== this.currentPlayer) {;
      return false;
    }
  
    // Check if prison move is necessary
    const prison = currentPlayer === PLAYER_COLORS.WHITE ? this.board[0] : this.board[25];
    if (prison?.length! > 0 && from !== PRISON_INDEX['WHITE'] && from !== PRISON_INDEX['BLACK']) {
      return false;
    }
  
    // Check if Bearing off is correct
    if (to === BEARING_OFF_INDEX) {
      if (!this.allCheckersHome(currentPlayer)) {
        return false;
      }
      steps = currentPlayer === PLAYER_COLORS.WHITE ? PRISON_INDEX['WHITE'] - from : from
      // check if from is included in moves left
      if(!this.movesLeft.includes(steps)) {
        //check if there is a dice larger then the steps
        if(!this.movesLeft.some(item => item > steps)) {
          return false
        } else {
          let largercheckers = 0
          if(currentPlayer === PLAYER_COLORS.WHITE){
            for(let i = from-1; i >= HOME_AREA_START_INDEX['WHITE']; i--) {
              largercheckers+= this.countCheckers(currentPlayer,i)
            }
          } else {
            for(let i = from + 1; i <= HOME_AREA_START_INDEX['BLACK']; i++) {
              largercheckers+= this.countCheckers(currentPlayer,i)
             }
          }
          if (largercheckers !== 0){
            return false
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

  private allCheckersHome(color: PLAYER_COLORS): boolean {
    let startIndex = color === PLAYER_COLORS.WHITE ? HOME_AREA_START_INDEX['WHITE'] : HOME_AREA_START_INDEX['BLACK'] - 5;
    const checkersInBoard =
      15 - (color === PLAYER_COLORS.WHITE ? this.finishWhite : this.finishBlack);
  
    // Check for stones in prison
    if (color === PLAYER_COLORS.WHITE) {
      if (this.board[PRISON_INDEX['WHITE']]!.length > 0) return false;
    } else if (color === PLAYER_COLORS.BLACK) { // Corrected comparison
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
    if (index <= PRISON_INDEX['WHITE'] || index >= PRISON_INDEX['BLACK'] || !this.board[index]) {
      return 0;
    }
    return (
      this.board[index]?.filter(stone => stone.color === color).length || 0
    );
  }

  private rollDice(): [number, number] {
    this.dice = [this.getRandomDieRoll(), this.getRandomDieRoll()];
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
    return this.handleMoveStone(from,to)
  }
  public getCurrentPositions(): {
    index: number;
    color: PLAYER_COLORS;
    count: number;
  }[] {
    const positions: {index: number; color: PLAYER_COLORS; count: number}[] = [];
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
  
  public getHomeCheckers(): {homeWhite: number; homeBlack: number} {
    return {
      homeWhite: this.finishWhite,
      homeBlack: this.finishBlack,
    };
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
    return this.checkForLegalMove()
  }

  public isGameOver(): boolean {
    if (this.finishBlack === 15 || this.finishWhite === 15) {
      return true;
    }
    return false;
  }

  public whoIsWinner(): string {
    if (this.finishBlack === 15) return PLAYER_COLORS.BLACK;
    if (this.finishWhite === 15) return PLAYER_COLORS.WHITE;
    return 'no one';
  }
  
  public switchPlayer() {
    this.dice = this.rollDice();
    this.currentPlayer = this.currentPlayer === PLAYER_COLORS.WHITE ? PLAYER_COLORS.BLACK : PLAYER_COLORS.WHITE;
  }
}

class Stone {
  color: PLAYER_COLORS;

  constructor(color: PLAYER_COLORS) {
    this.color = color;
  }
}
