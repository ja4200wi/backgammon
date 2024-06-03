import { Position , COLORS } from "../components/Board";
export class GameInstance {
    public dice: [number, number];
    public movesLeft: number[];
    public gameisover: boolean
    public positions: Position[]
    public currentPlayer: COLORS;

    constructor() {
        this.dice = [1,1]
        this.movesLeft = []
        this.gameisover = false
        this.positions = [
          {index: 0, color: COLORS.WHITE, count: 2},
          {index: 11, color: COLORS.WHITE, count: 5},
          {index: 16, color: COLORS.WHITE, count: 3},
          {index: 18, color: COLORS.WHITE, count: 5},
          {index: 23, color: COLORS.BLACK, count: 2},
          {index: 12, color: COLORS.BLACK, count: 5},
          {index: 7, color: COLORS.BLACK, count: 3},
          {index: 5, color: COLORS.BLACK, count: 5},
        ];
        //start with black because we switch players while creating the game (not perfect)
        this.currentPlayer = COLORS.BLACK
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

      public moveChecker(sourceIndex: number, targetIndex: number): boolean {
        // Validate move (implement game rules here)
        console.log('currentPlayer',this.currentPlayer)
        console.log('this is from backend',sourceIndex,targetIndex)
        if (!this.isMoveValid(sourceIndex, targetIndex)) {
            console.log('move not valid: return false')
            return false;
        }
        const steps = (sourceIndex - targetIndex) > 0 ? (sourceIndex - targetIndex) : (targetIndex - sourceIndex)
        console.log('this are the steps we did',steps)
        // Update positions
        const source = this.positions.find(item => item.index === sourceIndex)!;
        const target = this.positions.find(item => item.index === targetIndex)!;

        if(!source) return false; //make sure sourceindex was found
        //case 1: spike with target index does not exist yet
        if (!target) {
          this.positions.push({ index: targetIndex, color: this.currentPlayer, count: 1 });
          source.count--;
        } 
        //case 2: send to prison
        else if(target.color !== this.currentPlayer && target.count === 1) {
          const indexToRemove = this.positions.findIndex(item => item.index === targetIndex);
        }
        //case 3: target index already exists
        else if (target && source.count > 0) {
          console.log('we are inside')
          source.count--;
          target.count++;
        }
        //remove index if there is no checker on it anymore
        if (source.count === 0) {
          const indexToRemove = this.positions.findIndex(item => item.index === sourceIndex);
          this.positions.splice(indexToRemove,1)
        }
        console.log('after update',this.positions)
        //remove from movesLeft
        const removeindex = this.movesLeft.indexOf(steps);
        console.log(removeindex, 'this index will get removed')
        if(removeindex !== -1) {
          this.movesLeft.splice(removeindex,1)
          console.log(this.movesLeft)
          return true
        }
        console.log('remove steps from moveleft did not work')
        return false;
    }  

    private isMoveValid(sourceIndex: number, targetIndex: number): boolean {
      const source = this.positions.find(item => item.index === sourceIndex)!;
      const target = this.positions.find(item => item.index === targetIndex);
      console.log(source)
      if(!source) {
        console.log('source error')
        return false
      }
      //moves left?
      if(this.movesLeft.length === 0) {
        console.log('no moves left error')
        return false
      }
      //correct steps
      if(!this.movesLeft.includes(targetIndex-sourceIndex) && !this.movesLeft.includes(sourceIndex-targetIndex)) {
        console.log('wrong amount of steps error')
        return false
      }
      //check if source color = currentPlayer
      if(source.color !== this.currentPlayer) {
        console.log('wrong color error')
        return false
      }
      // Check if move direction is valid
      if(this.currentPlayer === COLORS.WHITE && targetIndex <= sourceIndex) {
        console.log('wrong direction w error')
        return false
      }
      if(this.currentPlayer === COLORS.BLACK && targetIndex >= sourceIndex) {
        console.log('wrong direction b error')
        return false
      }

      //target is not occupied
      if(target) {
        if(this.currentPlayer !== target.color && target.count > 1) {
          console.log('target occupied error')
          return false
        }
      }
      return true;
      }

  private sendToPrison(index: number) {
      // Implement sending checker to prison logic
     }
}