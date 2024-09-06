export class Move {
    private from: number
    private to: number

    constructor({from,to}: {from:number,to:number}) {
        this.from = from
        this.to = to
    }
}