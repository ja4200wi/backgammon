import {Checker} from './Checker';

export class Board {
  private board: (Checker[] | null)[];

  constructor() {
    this.board = new Array(26).fill([]).map(() => []);
    this.setupDefaultBoard();
  }

  private setupDefaultBoard() {
    this.board[1] = this.createChecker(2, 'white');
    this.board[12] = this.createChecker(5, 'white');
    this.board[17] = this.createChecker(3, 'white');
    this.board[19] = this.createChecker(5, 'white');
    this.board[24] = this.createChecker(2, 'black');
    this.board[13] = this.createChecker(5, 'black');
    this.board[8] = this.createChecker(3, 'black');
    this.board[6] = this.createChecker(5, 'black');
  }

  private createChecker(count: number, color: string): Checker[] {
    const checkers: Checker[] = [];
    for (let i = 0; i < count; i++) {
      checkers.push(new Checker(color));
    }
    return checkers;
  }

  public popCheckerOnSpike(index: number): Checker | undefined {
    if (this.board[index] === null) {
      return undefined;
    } else {
      const checker = this.board[index].pop();
      if (this.board[index].length === 0) {
        this.board[index] = [];
      }
      return checker;
    }
  }

  public pushCheckerOnSpike(index: number, checker: Checker): boolean {
    if (this.board[index] === null) {
      this.board[index] = [];
    }
    this.board[index].push(checker);
    return true;
  }

  public getNumCheckersOnSpikeOffColor(color: string, index: number): number {
    if (this.board[index] === null) return 0;
    return this.board[index].filter(checker => checker.getColor() === color)
      .length;
  }

  public getNumCheckersOnSpike(index: number): number {
    if (this.board[index] === null) return 0;
    return this.board[index].length;
  }

  public getColorOnSpike(index: number): string | null {
    if (this.board[index] === null) return null;
    return this.board[index][0].getColor();
  }

  public getWhitePrisoners(): Checker[] {
    return this.board[0] || [];
  }

  public getBlackPrisoners(): Checker[] {
    return this.board[25] || [];
  }

  // Returns true if the checkers of the spike have different color
  public isOccupiedByEnemy(color: string, index: number): boolean {
    if (this.board[index] === null) return false;
    return (
      this.board[index][0].getColor() !== color && this.board[index].length > 1
    );
  }

  public getLength(): number {
    return this.board.length;
  }

  public getCheckersOnSpike(index: number): Checker[] {
    return this.board[index] || [];
  }
}
