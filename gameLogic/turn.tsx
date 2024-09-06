import { Move } from "./move";

export class Turn {
  firstMove: Move;
  secondMove: Move;
  thirdMove?: Move;
  fourthMove?: Move;

  constructor({
    firstMove,
    secondMove,
    thirdMove,
    fourthMove,
  }: {
    firstMove: Move;
    secondMove: Move;
    thirdMove?: Move;
    fourthMove?: Move;
  }) {
    this.firstMove = firstMove;
    this.secondMove = secondMove;
    this.thirdMove = thirdMove;
    this.fourthMove = fourthMove;
  }
}
