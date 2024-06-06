const BOARD_SIZE = 24;
const HOME_AREA_SIZE = 6;
const TOTAL_STONES = 15;

export class Game {
  private board: (Stone[] | null)[];
  private finishWhite: number = 0;
  private finishBlack: number = 0;
  private prisonWhite: Stone[];
  private prisonBlack: Stone[];
  public currentPlayer: string;
  public dice: [number, number];
  public movesLeft: number[];
  public totalDistanceWhite: number;
  public totalDistanceBlack: number;

  // Single implementation of the constructor
  constructor() {
    this.board = new Array(24).fill(null).map(() => []);
    this.finishWhite = 0;
    this.finishBlack = 0;
    this.prisonWhite = [];
    this.prisonBlack = [];
    this.currentPlayer = 'black';
    this.dice = [1, 1]; // Initialize with a default roll
    this.movesLeft = [];
    this.totalDistanceWhite = 167;
    this.totalDistanceBlack = 167;
    this.setupDefaultBoard();
  }

  private setupDefaultBoard() {
    this.board[0] = this.createStones(2, 'white');
    this.board[11] = this.createStones(5, 'white');
    this.board[16] = this.createStones(3, 'white');
    this.board[18] = this.createStones(5, 'white');
    this.board[23] = this.createStones(2, 'black');
    this.board[12] = this.createStones(5, 'black');
    this.board[7] = this.createStones(3, 'black');
    this.board[5] = this.createStones(5, 'black');
  }

  private createStones(count: number, color: string): Stone[] {
    const stones: Stone[] = [];
    for (let i = 0; i < count; i++) {
      stones.push(new Stone(color));
    }
    return stones;
  }

  public moveStone(from: number, to: number): boolean {
    // Black player moves from prison
    if (from === -1 && this.currentPlayer === 'black') from = 24;
    let steps = this.currentPlayer === 'white' ? to - from : from - to;
    // Prevent taking steps that haven't been rolled with dice
    if (!this.movesLeft.includes(steps)) {
      return false;
    }
    // Prevent invalid moves
    if (!this.isValidMove(from, to)) {
      return false;
    }

    const stone =
      from === -1
        ? this.prisonWhite.pop()
        : from === 24
        ? this.prisonBlack.pop()
        : this.board[from]?.pop();

    if (!stone) {
      return false;
    }
    // Remove enemy stone from target if alone
    if (
      this.board[to]?.length === 1 &&
      this.board[to]?.[0].color != this.currentPlayer
    ) {
      const enemyStone = this.board[to]?.pop();
      if (enemyStone && this.currentPlayer === 'white') {
        this.prisonBlack.push(enemyStone);
      } else if (enemyStone) {
        this.prisonWhite.push(enemyStone);
      }
    }
    this.board[to]?.push(stone);
    // Remove only one move
    const indexOfMove = this.movesLeft.indexOf(steps);
    if (indexOfMove !== -1) {
      this.movesLeft.splice(indexOfMove, 1);
    }

    this.movesLeft.splice(steps, 1);
    return true;
  }

  public isGameOver(): boolean {
    if (this.finishBlack === 15 || this.finishWhite === 15) {
      return true;
    }
    return false;
  }

  public whoIsWinner(): string {
    if (this.finishBlack === 15) return 'black';
    if (this.finishWhite === 15) return 'white';
    return 'no one';
  }

  private isValidMove(from: number, to: number): boolean {
    // Check if source is on board
    if (from < -1 || from > 24) return false;
    // Check if source has checkers at all
    if (!this.board[from] || this.board[from]?.length === 0) return false;
    // Check if white target is on board or can finish or has prisoner
    if (this.currentPlayer === 'white') {
      if (this.prisonWhite.length > 0) return false; //TODO: if source is not Prison
      if (to < 0) return false;
      if (to > 23 && !this.allCheckersHome('white')) {
        return false;
      }
    } // Check if black target is on board or can finish or has prisoner
    else if (this.currentPlayer === 'black') {
      if (this.prisonBlack.length > 0) return false; //TODO: if source is not Prison
      if (to > 23) return false;
      if (to < 0 && !this.allCheckersHome('black')) return false;
    }

    // Check source tile for correct color and existence
    const stone = this.board[from]?.[0];
    if (!stone || stone.color !== this.currentPlayer) return false;
    //Check destination for eligibility
    const destinationStones = this.board[to];
    if (destinationStones && destinationStones.length > 0) {
      if (
        destinationStones[0].color !== this.currentPlayer &&
        destinationStones.length > 1
      ) {
        return false;
      }
    }

    return true;
  }

  public allCheckersHome(color: string): boolean {
    let startIndex = color === 'white' ? 18 : 0;
    const checkersInBoard =
      15 - (color === 'white' ? this.finishWhite : this.finishBlack);
    if (color === 'white') {
      if (this.prisonWhite.length > 0) return false;
    } else if ((color = 'black')) {
      if (this.prisonBlack.length > 0) return false;
    }
    let countCheckersInHome = 0;
    for (let i = 0; i < 6; i++) {
      countCheckersInHome += this.countCheckers(color, startIndex + i);
    }
    if (checkersInBoard != countCheckersInHome) return false;
    return true;
  }

  public countCheckers(color: string, index: number): number {
    if (index < 0 || index >= 24 || !this.board[index]) {
      return -1;
    }
    return (
      this.board[index]?.filter(stone => stone.color === color).length || 0
    );
  }

  public switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
  }

  public rollDice(): [number, number] {
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

  public calculateTotalDistance(color: string): number {
    let totalDistance = 0;

    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (stones !== null) {
        for (let stone of stones) {
          if (stone.color === color) {
            if (color === 'white') {
              totalDistance += 24 - i;
            } else if (color === 'black') {
              totalDistance += i + 1;
            }
          }
        }
      }
    }

    return totalDistance;
  }

  public getCurrentPositions(): {
    index: number;
    color: string;
    count: number;
  }[] {
    const positions: {index: number; color: string; count: number}[] = [];
    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (stones && stones.length > 0) {
        const color = stones[0].color;
        const count = stones.length;
        positions.push({index: i, color, count});
      }
    }
    if (this.prisonWhite.length > 0) {
      positions.push({
        index: -1,
        color: 'white',
        count: this.prisonWhite.length,
      });
    }
    if (this.prisonBlack.length > 0) {
      positions.push({
        index: -1,
        color: 'black',
        count: this.prisonBlack.length,
      });
    }
    return positions;
  }

  public updateDistances() {
    this.totalDistanceBlack = this.calculateTotalDistance('black');
    this.totalDistanceWhite = this.calculateTotalDistance('white');
  }
}

class Stone {
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}
