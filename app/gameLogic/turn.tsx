import { Move } from './move';

export class Turn {
  public moves: Move[];

  constructor(moves: Move[] = []) {
    this.moves = moves;
  }

  // Returns the first available move and removes it from the list
  nextMove(): Move | undefined {
    return this.moves.shift(); // Removes the first element from the array
  }

  // Checks if there are any remaining moves
  hasMoves(): boolean {
    return this.moves.length > 0;
  }
}
