import { PLAYER_COLORS } from "../utils/constants";
export class Checker {
  private color: PLAYER_COLORS;

  constructor(color: PLAYER_COLORS) {
    this.color = color;
  }

  getColor(): PLAYER_COLORS {
    return this.color;
  }
}
