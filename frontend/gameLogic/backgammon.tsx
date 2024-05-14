class Game {
  private board: (Stone[] | null)[];
  private finishWhite: number;
  private finishBlack: number;
  private prisonWhite: Stone[];
  private prisonBlack: Stone[];
  public currentPlayer: string;
  public dice: [number, number];
  public movesLeft: number[];
  private totalDistanceWhite: number;
  private totalDistanceBlack: number;

  // Overloaded constructor signatures
  constructor();
  constructor(homePlayer: string);

  // Single implementation of the constructor
  constructor(homePlayer?: string) {
    this.board = new Array(24).fill(null).map(() => []);
    this.finishWhite = 0;
    this.finishBlack = 0;
    this.prisonWhite = [];
    this.prisonBlack = [];
    this.currentPlayer = 'black';
    this.dice = [1, 1]; // Initialize with a default roll
    this.movesLeft = [];

    if (homePlayer === 'white') {
      // Place all white stones in the home area (last 6 tiles)
      this.board[23] = this.createStones(15, 'white');
      this.board[6] = this.createStones(15, 'black');
    } else if (homePlayer === 'black') {
      // Place all black stones in the home area (first 6 tiles)
      for (let i = 0; i < 6; i++) {
        this.board[i] = this.createStones(15 / 6, 'black');
      }

      // Randomly distribute white stones
      const whitePositions = this.getRandomPositions();
      for (let i = 0; i < 15; i++) {
        const pos = whitePositions[i];
        if (this.board[pos] === null) {
          this.board[pos] = [];
        }
        this.board[pos]?.push(new Stone('white'));
      }
    } else {
      // Default setup if no home player is specified
      // Initialize the board with the starting positions of the stones
      this.board[0] = this.createStones(2, 'white'); // 2 white stones on point 1
      this.board[11] = this.createStones(5, 'white'); // 5 white stones on point 12
      this.board[16] = this.createStones(3, 'white'); // 3 white stones on point 17
      this.board[18] = this.createStones(5, 'white'); // 5 white stones on point 19

      this.board[23] = this.createStones(2, 'black'); // 2 black stones on point 24
      this.board[12] = this.createStones(5, 'black'); // 5 black stones on point 13
      this.board[7] = this.createStones(3, 'black'); // 3 black stones on point 8
      this.board[5] = this.createStones(5, 'black'); // 5 black stones on point 6
    }

    this.totalDistanceWhite = this.calculateTotalDistance('white');
    this.totalDistanceBlack = this.calculateTotalDistance('black');
  }

  private getRandomPositions(): number[] {
    const positions = [];
    while (positions.length < 15) {
      const randomPos = Math.floor(Math.random() * 24);
      if (positions.filter(pos => pos === randomPos).length < 5) {
        positions.push(randomPos);
      }
    }
    return positions;
  }

  private createStones(count: number, color: string): Stone[] {
    const stones: Stone[] = [];
    for (let i = 0; i < count; i++) {
      stones.push(new Stone(color));
    }
    return stones;
  }

  public moveStone(from: number, steps: number): boolean {
    // Prevent taking steps that haven't been rolled with dice
    if (!this.movesLeft.includes(steps)) {
      console.log(
        `Invalid move: ${steps} is not a valid step based on the dice roll.`,
      );
      return false;
    }
    // Black player moves from prison
    if (from == -1 && this.currentPlayer == 'black') from = 24;

    const to = this.calculateDestination(from, steps);
    // Prevent invalid moves
    if (!this.isValidMove(from, to)) {
      console.log(`Invalid move from ${from + 1} to ${to + 1}`);
      return false;
    }

    const stone =
      from === -1
        ? this.currentPlayer === 'black'
          ? this.prisonBlack.pop()
          : this.prisonWhite.pop()
        : this.board[from]?.pop();

    if (!stone) {
      console.log(`No stone at position ${from + 1}`);
      return false;
    }
    // Remove enemy stone from target if alone
    if (
      this.board[to]?.length == 1 &&
      this.board[to]?.[0].color != this.currentPlayer
    ) {
      const enemyStone = this.board[to]?.pop();
      if (enemyStone && this.currentPlayer == 'white') {
        this.prisonBlack.push(enemyStone);
      } else if (enemyStone) {
        this.prisonWhite.push(enemyStone);
      }
    }

    // Check if only legal finish moves are handled by this
    if (!this.board[to] && this.currentPlayer == 'white') {
      this.finishWhite += 1;
    } else if (!this.board[to]) {
      this.finishBlack += 1;
    } else {
      this.board[to]?.push(stone);
    }

    if (this.board[from]?.length === 0) {
      this.board[from] = null;
    }

    // Remove only one move
    const indexOfMove = this.movesLeft.indexOf(steps);
    if (indexOfMove !== -1) {
      this.movesLeft.splice(indexOfMove, 1);
    }

    this.movesLeft.splice(steps, 1);
    return true;
  }

  private calculateDestination(from: number, steps: number): number {
    if (this.currentPlayer === 'white') {
      return from + steps;
    } else {
      return from - steps;
    }
  }

  public isGameOver(): boolean {
    if (this.finishBlack == 15 || this.finishWhite == 15) {
      return true;
    }
    return false;
  }

  public whoIsWinner(): string {
    if (this.finishBlack == 15) return 'black';
    if (this.finishWhite == 15) return 'white';
    return 'no one';
  }

  //TODO test this method
  public isMovePossible(dice1: number, dice2: number): boolean {
    // Get the list of possible dice moves
    const possibleMoves =
      dice1 === dice2 ? [dice1, dice1, dice1, dice1] : [dice1, dice2];

    // Check for the current player's prison status
    const prison =
      this.currentPlayer === 'white' ? this.prisonWhite : this.prisonBlack;
    if (prison.length > 0) {
      // If the player has stones in prison, they must move them out first
      for (let move of possibleMoves) {
        const to = this.calculateDestination(-1, move);
        if (this.isValidMove(-1, to)) {
          return true;
        }
      }
      return false;
    }

    // Iterate through each tile on the board
    for (let i = 0; i < this.board.length; i++) {
      const stones = this.board[i];
      if (
        stones &&
        stones.length > 0 &&
        stones[0].color === this.currentPlayer
      ) {
        for (let move of possibleMoves) {
          const to = this.calculateDestination(i, move);
          if (this.isValidMove(i, to)) {
            return true;
          }
        }
      }
    }

    // No valid moves found
    return false;
  }

  private isValidMove(from: number, to: number): boolean {
    // First check prison moves
    if (from == -1 && this.prisonWhite.length != 0) return true;
    if (from == 24 && this.prisonBlack.length != 0) return true;
    // Check if source is on board
    if (from < 0 || from > 23) return false;
    // Check if source has coins at all
    if (!this.board[from] || this.board[from]?.length === 0) return false;
    // Check if white target is on board or can finish or has prisoner
    if (this.currentPlayer == 'white') {
      if (this.prisonWhite.length > 0) return false; //TODO: if source is not Prison
      if (to < 0) return false;
      if (to > 23 && !this.allCoinsHome('white')) {
        console.log(
          'We tried to check if this is a valid move to finish this coin',
          this.allCoinsHome('white'),
        );
        return false;
      }
    } // Check if black target is on board or can finish or has prisoner
    else if (this.currentPlayer == 'black') {
      if (this.prisonBlack.length > 0) return false; //TODO: if source is not Prison
      if (to > 23) return false;
      if (to < 0 && !this.allCoinsHome('black')) return false;
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

  public allCoinsHome(color: string): boolean {
    let startIndex = color == 'white' ? 18 : 0;
    const coinsInBoard =
      15 - (color == 'white' ? this.finishWhite : this.finishBlack);
    if (color == 'white') {
      if (this.prisonWhite.length > 0) return false;
    } else if ((color = 'black')) {
      if (this.prisonBlack.length > 0) return false;
    }
    let countCoinsInHome = 0;
    for (let i = 0; i < 6; i++) {
      countCoinsInHome += this.countCoins(color, startIndex + i);
    }
    console.log(
      `Coins in board: ${coinsInBoard} and coins counted: ${countCoinsInHome}`,
    );
    if (coinsInBoard != countCoinsInHome) return false;
    return true;
  }

  public countCoins(color: string, index: number): number {
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

  public updateDistances() {
    this.totalDistanceBlack = this.calculateTotalDistance('black');
    this.totalDistanceWhite = this.calculateTotalDistance('white');
  }

  public displayBoard() {
    console.log(`Current Player: ${this.currentPlayer}`);
    this.updateDistances();

    const formatTile = (tile: string): string => tile.padEnd(3, ' ');

    const topRow = this.board
      .slice(0, 12)
      .map(this.formatPoint)
      .map(formatTile)
      .join(' ');
    const bottomRow = this.board
      .slice(12)
      .map(this.formatPoint)
      .reverse()
      .map(formatTile)
      .join(' ');

    console.log(`[${topRow}]`);
    console.log(`[${bottomRow}]`);
    console.log(
      `White Prison: ${this.prisonWhite.length} stones\t\t\tBlack Prison: ${this.prisonBlack.length} stones`,
    );
    console.log(
      `Coins Finished: White = ${this.finishWhite}\t\tBlack = ${this.finishBlack}`,
    );
    console.log(
      `Total Distance: White = ${this.totalDistanceWhite} steps\tBlack = ${this.totalDistanceBlack} steps`,
    );
    console.log(
      `Dice Roll: ${this.dice[0]}, ${
        this.dice[1]
      }\t\t\t\tMoves Left: ${this.movesLeft.join(', ')}`,
    );
  }

  private formatPoint(point: Stone[] | null, index: number): string {
    if (!point || point.length === 0) {
      return '0';
    }
    const color = point[0].color.charAt(0).toUpperCase();
    return `${point.length}${color}`;
  }
}

class Stone {
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}

// Example of playing the game from the command line
const game = new Game();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptMove() {
  if (game.isGameOver()) {
    console.log(`The game is finished, player ${game.whoIsWinner()} has won.`);
    return;
  }
  if (game.movesLeft.length === 0) {
    game.switchPlayer();
    game.rollDice();
    if (!game.isMovePossible(game.dice[0], game.dice[1])) {
      console.log(
        `No possible moves for ${game.currentPlayer}. Skipping turn.`,
      );
      game.switchPlayer();
      game.rollDice();
    }
    game.displayBoard();
  }

  readline.question('Enter your move (from steps): ', (move: string) => {
    const [from, steps] = move.split(' ').map(num => parseInt(num, 10));
    if (game.moveStone(from - 1, steps)) {
      game.displayBoard();
    } else {
      console.log('Invalid move. Please enter a valid move.');
    }
    promptMove();
  });
}

promptMove();
