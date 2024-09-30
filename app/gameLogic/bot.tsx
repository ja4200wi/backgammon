import { BOARD_TYPE, BOT_DIFFICULTY, BOT_NAMES, PLAYER_COLORS } from "../utils/constants";
import { Game } from "./backgammon";
import { Board } from "./board";
import { Move } from "./move";
import { Riana } from "./rianaBot";
import { Turn } from "./turn";
export class Bot {
    private lastTurn: Turn
    private botType: BOT_NAMES // set DEFAULT if difficulty is not custom

    constructor(botType: BOT_NAMES) {
        this.botType = botType
        this.lastTurn = new Turn()
    }
    public getLastTurn() {
        return this.lastTurn
    }

    public makeMove(game:Game): (Turn|null) {
       return this.makeBotMove(game)
    }
    
    private makeBotMove(game: Game): (Turn | null) {
        if(this.botType === BOT_NAMES.LARRY) {
            return this.tempTurnEasyBot(game)
        }
        let bestTurn = this.getMediumScore(game, [],this.botType);
        return bestTurn.turn;
    }    
    private makeMoveHardBot(game:Game): (Turn | null) {
        return null
    }
    // helper methods
    private transformPositionToBoard(positions: {
        index: number;
        color: PLAYER_COLORS;
        count: number;
    }[]): Board {
        let board = new Board(BOARD_TYPE.EMPTY);
    
        for (let i = 0; i < 26; i++) {
            // Check if there is a position for this index
            const position = positions.find(pos => pos.index === i);
            if (position) {
                board.pushXCheckersOnSpike(position.count, position.index, position.color);
            }
        }
        return board;
    }
    public tempTurnEasyBot(game:Game): Turn {
        const deepGameCopy = game.deepCopy()
        let moves:Move[] = []
        while (deepGameCopy.getMovesLeft().length !== 0) {
            const move = deepGameCopy.getRandomMove()
            if(move) {
                deepGameCopy.moveStone(move.getFrom(),move.getTo())
                moves.push(move)
            }
        }
        return new Turn(moves)
    }
    private getMediumScore(game: Game, savedMoves: Move[],botType:BOT_NAMES,count?:number): { turn: Turn, score: number } {
        // Base case: if no moves are left, calculate the score
        if (game.getMovesLeft().length === 0 || !game.hasLegalMove()) {
            const board = this.transformPositionToBoard(game.getCurrentPositions());
            let bot:any
            switch (botType) {
                case BOT_NAMES.RIANA:
                    bot = new Riana(board, game.getCurrentPlayer());
                    break;
            
                default:
                    bot = new Riana(board, game.getCurrentPlayer());
                    break;
            }
            const positionScore = bot.getPositionScore();
            return { turn: new Turn(savedMoves), score: positionScore };
        }
    
        let bestResult = { turn: new Turn(), score: -Infinity }; // Start with a very low score
    
        // Recursive case: explore each possible move
        const moves = game.getAllPossibleMoves();
        for (let move of moves) {
            const deepGameCopy = game.deepCopy(); // Create a fresh copy of the game for each move
            deepGameCopy.moveStone(move.getFrom(), move.getTo()); // Apply the move on the copied game
    
            const updatedMoves = [...savedMoves, move]; // Add the current move to the saved moves
    
            // Recursively calculate the score for this move and all future moves
            const result = this.getMediumScore(deepGameCopy, updatedMoves, BOT_NAMES.RIANA);
    
            // Keep track of the best score
            if (result.score > bestResult.score) {
                bestResult = result;
            }
        }
    
        return bestResult; // Return the best result found
    }
    
    
}