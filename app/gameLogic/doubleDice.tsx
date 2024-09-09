import { PLAYER_COLORS } from "../utils/constants"

export class doubleDice {
    private multiplicator: number
    private lastDouble:PLAYER_COLORS

    constructor() {
        this.multiplicator = 1
        this.lastDouble = PLAYER_COLORS.NAP
    }
    public getMultiplicator():number {
        return this.multiplicator
    }
    public getLastDobule():PLAYER_COLORS {
        return this.lastDouble
    }
    public double(player:PLAYER_COLORS) {
        if(player !== this.lastDouble) {
            this.multiplicator = this.multiplicator*2
            this.lastDouble = player
        }
    }
}