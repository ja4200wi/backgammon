import { BOT_DIFFICULTY } from "../utils/constants";
import { Game } from "./backgammon";
import { Checker } from "./checker";
export class Bot {
    private difficulty: BOT_DIFFICULTY

    constructor(difficulty: BOT_DIFFICULTY) {
        this.difficulty = difficulty
    }

    public makeMove(game:Game): (Checker[] | null)[] {
        switch(this.difficulty) {
            case BOT_DIFFICULTY.EASY:
                this.makeMoveEasyBot(game)
                break
            case BOT_DIFFICULTY.MEDIUM:
                this.makeMoveMediumBot(game)
                break
            case BOT_DIFFICULTY.HARD:
                this.makeMoveHardBot(game)
                break
            default:
                return []
                
        }
        return []
    }
    private makeMoveEasyBot(game:Game): (Checker[] | null)[] {
        const move = game.getRandomMove()
        return []
    }
    private makeMoveMediumBot(game:Game): (Checker[] | null)[] {
        return []
    }
    private makeMoveHardBot(game:Game): (Checker[] | null)[] {
        return []
    }
}