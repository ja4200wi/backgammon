export class Move {
    private from: number;
    private to: number;
  
    constructor(from: number, to: number) {
      this.from = from;
      this.to = to;
    }

    getFrom(): number {
      return this.from;
    }
  
    getTo(): number {
      return this.to;
    }
}