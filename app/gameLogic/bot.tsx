import { BOT_DIFFICULTY } from "../utils/constants";
import { Game } from "./backgammon";
import { Checker } from "./checker";
import { Move } from "./move";
export class Bot {
    private difficulty: BOT_DIFFICULTY

    constructor(difficulty: BOT_DIFFICULTY) {
        this.difficulty = difficulty
    }

    public makeMove(game:Game): (Move|null) {
        switch(this.difficulty) {
            case BOT_DIFFICULTY.EASY:
                return (this.makeMoveEasyBot(game))
                break
            case BOT_DIFFICULTY.MEDIUM:
                return (this.makeMoveMediumBot(game))
                break
            case BOT_DIFFICULTY.HARD:
                return (this.makeMoveHardBot(game))
                break
            default:
                return null
        }
    }
    private makeMoveEasyBot(game:Game): (Move | null) {
        const move = game.getRandomMove()
        return move
    }
    private makeMoveMediumBot(game:Game): (Move | null) {
        return null
    }
    private makeMoveHardBot(game:Game): (Move | null) {
        return null
    }
}