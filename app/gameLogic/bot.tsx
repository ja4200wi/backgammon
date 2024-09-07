import { BOT_DIFFICULTY } from "../utils/constants";
import { Checker } from "./checker";
export class Bot {
    private difficulty: BOT_DIFFICULTY

    constructor(difficulty: BOT_DIFFICULTY) {
        this.difficulty = difficulty
    }

    public makeMove(positions:(Checker[] | null)[], dice: [number, number]): (Checker[] | null)[] {
        switch(this.difficulty) {
            case BOT_DIFFICULTY.EASY:
                this.makeMoveEasyBot(positions,dice)
                break
            case BOT_DIFFICULTY.MEDIUM:
                this.makeMoveMediumBot(positions,dice)
                break
            case BOT_DIFFICULTY.HARD:
                this.makeMoveHardBot(positions,dice)
                break
            default:
                return []
                
        }
        return []
    }
    private makeMoveEasyBot(positions:(Checker[] | null)[], dice: [number, number]): (Checker[] | null)[] {
        return []
    }
    private makeMoveMediumBot(positions:(Checker[] | null)[], dice: [number, number]): (Checker[] | null)[] {
        return []
    }
    private makeMoveHardBot(positions:(Checker[] | null)[], dice: [number, number]): (Checker[] | null)[] {
        return []
    }
}