const BOARD_SIZE = 26;
const HOME_AREA_SIZE = 6;
const TOTAL_STONES = 15;

export class Game {
  private board: (Stone[] | null)[];
  private finishWhite: number = 0;
  private finishBlack: number = 0;
  public currentPlayer: string;
  public dice: [number, number];
  public movesLeft: number[];

  // Single implementation of the constructor
  constructor() {
    this.board = new Array(BOARD_SIZE).fill([]).map(() => []);
    this.finishWhite = 0;
    this.finishBlack = 0;
    this.currentPlayer = 'black';
    this.dice = [1, 1];
    this.movesLeft = [];
    this.setupDefaultBoard();
  }

  private setupDefaultBoard() {
    this.board[1] = this.createStones(2, 'white');
    this.board[12] = this.createStones(5, 'white');
    this.board[17] = this.createStones(3, 'white');
    this.board[19] = this.createStones(5, 'white');
    this.board[24] = this.createStones(2, 'black');
    this.board[13] = this.createStones(5, 'black');
    this.board[8] = this.createStones(3, 'black');
    this.board[6] = this.createStones(5, 'black');
  }

  private createStones(count: number, color: string): Stone[] {
    const stones: Stone[] = [];
    for (let i = 0; i < count; i++) {
      stones.push(new Stone(color));
    }
    return stones;
  }

  public moveStone(from: number, to: number): boolean {
    let steps = this.currentPlayer === 'white' ? to - from : from - to;
    console.log('From', from);
    console.log('to', to);
    console.log(steps);
    // Prevent taking steps that haven't been rolled with dice
    if (!this.movesLeft.includes(steps)) {
      return false;
    }
    // Prevent invalid moves
    if (!this.isValidMove(from, to)) {
      return false;
    }

    console.log('move was valid');

    const stone = this.board[from]?.pop();

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
        this.board[25]?.push(enemyStone);
      } else if (enemyStone) {
        this.board[0]?.push(enemyStone);
      }
    }
    this.board[to]?.push(stone);
    // Remove only one move
    const indexOfMove = this.movesLeft.indexOf(steps);
    if (indexOfMove !== -1) {
      this.movesLeft.splice(indexOfMove, 1);
    }

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
    //source is valid
    if (from < 0 || from > 25) {
      return false;
    }
    //target is valid
    if (to < 1 || (to > 24 && to < 99) || to > 100) {
      if (to !== 100) {
        return false;
      }
    }
    //check if source exists
    if (this.board[from] === null) {
      return false;
    }
    const sourcecount = this.board[from]?.length!;
    if (sourcecount < 0) {
      return false;
    }
    //check if prison move is necessary
    const prison =
      this.currentPlayer === 'white' ? this.board[0] : this.board[25];
    if (prison?.length! > 0 && from !== 0 && from !== 25) {
      console.log('prison error');
      return false;
    }
    //check if player is allowed to move home
    if (to === 100 && !this.allCheckersHome) {
      return false;
    }
    //check if to is not occupied by more than 2 checkers of opponent
    if (
      this.board[to] !== null &&
      this.board[to]!.length > 1 &&
      this.board[to]![0].color !== this.currentPlayer
    ) {
      return false;
    }
    //Move is valid
    return true;
  }

  public allCheckersHome(color: string): boolean {
    let startIndex = color === 'white' ? 19 : 1;
    const checkersInBoard =
      15 - (color === 'white' ? this.finishWhite : this.finishBlack);
    if (color === 'white') {
      if (this.board[0]!.length > 0) return false;
    } else if ((color = 'black')) {
      if (this.board[25]!.length > 0) return false;
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
    return 2;
  }

  public calculateTotalDistance(color: string): number {
    let totalDistance = 0;

    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (stones !== null) {
        for (let stone of stones) {
          if (stone.color === color) {
            if (color === 'white') {
              totalDistance += 24 - i + 1;
            } else if (color === 'black') {
              totalDistance += i;
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
    return positions;
  }

  public getDistances(): {distBlack: number; distWhite: number} {
    return {
      distBlack: this.calculateTotalDistance('black'),
      distWhite: this.calculateTotalDistance('white'),
    };
  }
}

class Stone {
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}
