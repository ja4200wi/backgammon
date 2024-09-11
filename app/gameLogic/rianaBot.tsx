import { validateConditionObject } from "aws-cdk-lib/aws-iam"
import { PLAYER_COLORS } from "../utils/constants"
import { Game } from "./backgammon"
import { Board } from "./board"

export class Riana {
    private castleScore: number
    private stackScore: number
    private backCheckerScore: number
    private hitScore: number

    constructor(board: Board, player: PLAYER_COLORS) {
        this.castleScore = this.getCastleScore(board,player)
        this.stackScore = this.getStackScore(board,player)
        this.backCheckerScore = this.getBackCheckerScore(board,player)
        this.hitScore = this.getHitScore(board,player)
    }

    private getCastleScore(board:Board, player: PLAYER_COLORS):number {
        let castleScore = 0
        let home = this.getHomeCheckerStacks(board,player)
        for (let i = 0; i <6; i++) {
            if (i < 3 && home[i] >= 2) {
                // value stacks at the beginning of home more
                castleScore = castleScore + 7.5
            } else if(i >= 3 && home[i] >= 2) {
                castleScore = castleScore + 2.5
            }
        }
        return castleScore
    }
    private getStackScore(board:Board, player: PLAYER_COLORS):number {
        let checkerStacks = this.getCheckerStacks(board,player)
        let stackScore = this.evaluateCheckerStacks(checkerStacks)
        return stackScore
    }
    private getBackCheckerScore(board:Board, player: PLAYER_COLORS):number {
        let backCheckerStack = this.getBackCheckerStack(board,player)
        let checkerCount = backCheckerStack.reduce((acc,val) => acc + val,0) //sum of back checkers
        return this.backCheckerEvaluation(checkerCount)
    }
    private getHitScore(board:Board, player: PLAYER_COLORS):number {
        const prisonIndex = player === PLAYER_COLORS.WHITE ? 0 : 25
        const prisonChecker = board.getNumCheckersOnSpike(prisonIndex)
        return 4 * prisonChecker
    }
    // helper methods
    private getCheckerStackFromTo(board:Board,player:PLAYER_COLORS,from:number,to:number):number[] {
        //this could be a more general way to get rid of doublicated code!
        return []
    }
    private getHomeCheckerStacks(board:Board, player:PLAYER_COLORS):number[] {
        let home = new Array(6).fill(0);
        let startCount = player === PLAYER_COLORS.WHITE ? 19 : 1
        for (let i = 0; i <6; i++) {
            home[i] = board.getNumCheckersOnSpikeOffColor(player,startCount)
            startCount += 1
        }
        // revers home for white player for valuation logic
        return player === PLAYER_COLORS.WHITE ? home.reverse() : home
    }
    private getCheckerStacks(board:Board , player : PLAYER_COLORS) :number[] {
        let checkerStack = new Array(24).fill(0);
        for(let i = 0; i< checkerStack.length; i++) {
            checkerStack[i] = board.getNumCheckersOnSpikeOffColor(player,i+1)
        }  
        // reverse home for white
        return player === PLAYER_COLORS.WHITE ? checkerStack.reverse() : checkerStack
    }
    private evaluateCheckerStacks(checkerStack:number[]) : number {
        let count = 0
        for (let i = 0; i < checkerStack.length; i++) {
            // reward for stacking checkers in stacks of 2 or 3
            if (i < 12 && checkerStack[i] === 2) {
                count += 6;
            } else if (i < 12 && checkerStack[i] === 3) {
                count += 4;
            } else if (i >= 12 && checkerStack[i] === 2) {
                count += 3;
            } else if (i >= 12 && checkerStack[i] === 3) {
                count += 2;
            }
            // punish for checker stacks larger than 4
            else if (checkerStack[i] >= 5) {
                count -= 3;
            }
            // check for single checkers
            else if (i < 6 && checkerStack[i] === 1) {
                count -= 8;
            } else if (i >= 6 && i < 12 && checkerStack[i] === 1) {
                count -= 3;
            } else if (i >= 12 && i < 18 && checkerStack[i] === 1) {
                count -= 2;
            } else if (i >= 18 && checkerStack[i] === 1) {
                count -= 1;
            }
        }
        
        return count
    }
    private getBackCheckerStack(board:Board,player:PLAYER_COLORS):number[]{
        let backCheckerStack = new Array(6).fill(0);
        let count = player === PLAYER_COLORS.BLACK ? 19 : 1
        for (let i = 0; i <6; i++) {
            backCheckerStack[i] = board.getNumCheckersOnSpikeOffColor(player,count)
            count += 1
        }
        // revers for consistency
        return player === PLAYER_COLORS.BLACK ? backCheckerStack.reverse() : backCheckerStack
    }
    private backCheckerEvaluation(checkerCount:number):number {
        //reward no backcheckers, punish a lot of backcheckers
        switch (checkerCount) {
            case 0:
                return 10;
            case 1:
                return 5;
            case 2:
                return 0;
            default:
                return -checkerCount;
        }
    }
    public getPositionScore():number {
        return (this.castleScore + this.stackScore + this.backCheckerScore + this.hitScore)
    }
}