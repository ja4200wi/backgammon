const BOARD_SIZE = 26;
const HOME_AREA_SIZE = 6;
const TOTAL_STONES = 15;

export class Game {
  private board: (Stone[] | null)[];
  private finishWhite: number = 0;
  private finishBlack: number = 0;
  private currentPlayer: string;
  private dice: [number, number];
  private movesLeft: number[];

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
    // logic not perfect here
    let steps = this.currentPlayer === 'white' ? to - from : from - to;
    // Prevent invalid moves
    if (!this.isValidMove(from, to)) {
      return false;
    }

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
    // make sure dice gets removed if move to Home
    if(to === 100) {
      steps = this.currentPlayer === 'white' ? 25-from : from
      while (steps <= 6) {
        if (this.movesLeft.includes(steps)) {
          const indexOfMove = this.movesLeft.indexOf(steps);
          if (indexOfMove !== -1) {
            this.movesLeft.splice(indexOfMove, 1);
            steps = 22
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
    if(to === 100) {
      if(this.currentPlayer === 'white') {
        this.finishWhite++
      } else {
        this.finishBlack++
      }
    }

    return true;
  }

  private checkForLegalMove(): boolean {
    // Get the list of positions of the current player's stones
    const playerColor = this.currentPlayer;
    const movesLeft = this.movesLeft;
  
    if (movesLeft.length === 0) {
      return true;
    }
  
    const positions = this.getCurrentPositions();
  
    // Check if the current player has any stones in prison
    const prisonIndex = playerColor === 'white' ? 0 : 25;
    const hasPrisonStone = this.board[prisonIndex]?.some(stone => stone.color === playerColor);
  
    // If the player has stones in prison, they must move them first
    if (hasPrisonStone) {
      for (const move of movesLeft) {
        const targetIndex = playerColor === 'white' ? move : prisonIndex - move;
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
          const to = playerColor === 'white' ? from + move : from - move;
  
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
    if (this.finishBlack === 15) return 'Black';
    if (this.finishWhite === 15) return 'White';
    return 'no one';
  }

  private isValidMove(from: number, to: number): boolean {
    const currentPlayer = this.currentPlayer;
    let steps = currentPlayer === 'white' ? to - from : from - to;
    const directionMultiplier = currentPlayer === 'white' ? 1 : -1;
  
    (`Checking isValidMove from ${from} to ${to} for ${currentPlayer}`);
  
    // Source is valid
    if (from < 0 || from > 25) {
      return false;
    }
  
    // Target is valid
    if (to < 1 || (to > 24 && to < 99) || to > 100) {
      if (to !== 100) {
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
    const prison = currentPlayer === 'white' ? this.board[0] : this.board[25];
    if (prison?.length! > 0 && from !== 0 && from !== 25) {
      return false;
    }
  
    // Logic for bearing off
    if (to === 100) {
      if (!this.allCheckersHome(currentPlayer)) {
        return false;
      }
      steps = currentPlayer === 'white' ? 25-from : from
      // check if from is included in moves left
      if(!this.movesLeft.includes(steps)) {
        //check if there is a dice larger then the steps
        if(!this.movesLeft.some(item => item > steps)) {
          return false
        } else {
          let largercheckers = 0
          if(currentPlayer === 'white'){
            for(let i = from-1; i >= 19; i--) {
              largercheckers+= this.countCheckers(currentPlayer,i)
            }
          } else {
            for(let i = from + 1; i <=6; i++) {
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
    if (!this.movesLeft.includes(steps) && to !== 100) {
      return false;
    }
  
    // Check if the target position is not occupied by more than 1 opponent checker
    if (
      to !== 100 &&
      this.board[to] !== null &&
      this.board[to]!.length > 1 &&
      this.board[to]![0].color !== this.currentPlayer
    ) {
      return false;
    }
  
    // Move is valid
    return true;
  }
  
  

  private allCheckersHome(color: string): boolean {
    let startIndex = color === 'white' ? 19 : 1;
    const checkersInBoard =
      15 - (color === 'white' ? this.finishWhite : this.finishBlack);
  
    // Check for stones in prison
    if (color === 'white') {
      if (this.board[0]!.length > 0) return false;
    } else if (color === 'black') { // Corrected comparison
      if (this.board[25]!.length > 0) return false;
    }
  
    // Count checkers in the home board
    let countCheckersInHome = 0;
    for (let i = 0; i < 6; i++) {
      countCheckersInHome += this.countCheckers(color, startIndex + i);
    }
  
    // Check if all checkers are in the home board
    if (checkersInBoard !== countCheckersInHome) return false;
    return true;
  }
  
  private countCheckers(color: string, index: number): number {
    if (index < 0 || index > 24 || !this.board[index]) {
      return -1;
    }
    return (
      this.board[index]?.filter(stone => stone.color === color).length || 0
    );
  }

  public switchPlayer() {
    this.dice = this.rollDice();
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
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

  private calculateTotalDistance(color: string): number {
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

  public getCurrentPlayer(): string {
    return this.currentPlayer;
  }
}

class Stone {
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}
