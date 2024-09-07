export class Move {
    public from: number;
    public to: number;
  
    constructor(from: number, to: number) {
      this.from = from;
      this.to = to;
    }

    public getFrom(): number {
      return this.from;
    }
  
    public getTo(): number {
      return this.to;
    }
}