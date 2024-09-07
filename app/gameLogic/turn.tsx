import { Move } from "./move";

export class Turn {
  firstMove?: Move;
  secondMove?: Move;
  thirdMove?: Move;
  fourthMove?: Move;

  constructor(moves: Move[] = []) {
    if (moves.length >= 1) {
      this.firstMove = moves[0];
    }
    if (moves.length >= 2) {
      this.secondMove = moves[1];
    }
    if (moves.length >= 3) {
      this.thirdMove = moves[2];
    }
    if (moves.length >= 4) {
      this.fourthMove = moves[3];
    }
  }
}
