import { Move } from "./move";

export class Turn {
  firstMove: Move;
  secondMove: Move;
  thirdMove?: Move;
  fourthMove?: Move;

  constructor(moves: Move[]) {
    if (moves.length < 2) {
      throw new Error("At least two moves are required to create a Turn.");
    }
    this.firstMove = moves[0];
    this.secondMove = moves[1];
    if(moves.length === 4) {
        this.thirdMove = moves[2];
        this.fourthMove = moves[3];
    }
  }
}
