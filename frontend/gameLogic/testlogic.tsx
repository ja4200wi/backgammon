export class GameInstance {
    public dice: [number, number];
    public movesLeft: number[];
    public gameisover: boolean

    constructor() {
        this.dice = [1,1]
        this.movesLeft = []
        this.gameisover = false
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
}