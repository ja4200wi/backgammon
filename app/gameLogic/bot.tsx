import { BOT_DIFFICULTY, PLAYER_COLORS } from "../utils/constants";
import { Game } from "./backgammon";
import { Board } from "./board";
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
        const firstMoves = game.getAllPossibleMoves()
        const board = this.transformPositionToBoard(game.getCurrentPositions())
        for(let move of firstMoves) {
            //continue here!
            board.makeMove(move,game.getCurrentPlayer())
        }
        return null
    }
    private makeMoveHardBot(game:Game): (Move | null) {
        return null
    }
    // helper methods
    private transformPositionToBoard(positions: {
        index: number;
        color: PLAYER_COLORS;
        count: number;
    }[]): Board {
        let board = new Board();
    
        for (let i = 0; i < 26; i++) {
            board.makeSpikeEmpty(i);
    
            // Check if there is a position for this index
            const position = positions.find(pos => pos.index === i);
            if (position) {
                board.pushXCheckersOnSpike(position.count, position.index, position.color);
            }
        }
        return board;
    }    
    
}