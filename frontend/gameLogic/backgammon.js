var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Game = /** @class */ (function () {
    // Single implementation of the constructor
    function Game(homePlayer) {
        var _a;
        this.board = new Array(24).fill(null).map(function () { return []; });
        this.finishWhite = 0;
        this.finishBlack = 0;
        this.prisonWhite = [];
        this.prisonBlack = [];
        this.currentPlayer = 'black';
        this.dice = [1, 1]; // Initialize with a default roll
        this.movesLeft = [];
        if (homePlayer === 'white') {
            // Place all white stones in the home area (last 6 tiles)
            this.board[23] = this.createStones(15, 'white');
            this.board[6] = this.createStones(15, 'black');
        }
        else if (homePlayer === 'black') {
            // Place all black stones in the home area (first 6 tiles)
            for (var i = 0; i < 6; i++) {
                this.board[i] = this.createStones(15 / 6, 'black');
            }
            // Randomly distribute white stones
            var whitePositions = this.getRandomPositions();
            for (var i = 0; i < 15; i++) {
                var pos = whitePositions[i];
                if (this.board[pos] === null) {
                    this.board[pos] = [];
                }
                (_a = this.board[pos]) === null || _a === void 0 ? void 0 : _a.push(new Stone('white'));
            }
        }
        else {
            // Default setup if no home player is specified
            // Initialize the board with the starting positions of the stones
            this.board[0] = this.createStones(2, 'white'); // 2 white stones on point 1
            this.board[11] = this.createStones(5, 'white'); // 5 white stones on point 12
            this.board[16] = this.createStones(3, 'white'); // 3 white stones on point 17
            this.board[18] = this.createStones(5, 'white'); // 5 white stones on point 19
            this.board[23] = this.createStones(2, 'black'); // 2 black stones on point 24
            this.board[12] = this.createStones(5, 'black'); // 5 black stones on point 13
            this.board[7] = this.createStones(3, 'black'); // 3 black stones on point 8
            this.board[5] = this.createStones(5, 'black'); // 5 black stones on point 6
        }
        this.totalDistanceWhite = this.calculateTotalDistance('white');
        this.totalDistanceBlack = this.calculateTotalDistance('black');
    }
    Game.prototype.getRandomPositions = function () {
        var positions = [];
        var _loop_1 = function () {
            var randomPos = Math.floor(Math.random() * 24);
            if (positions.filter(function (pos) { return pos === randomPos; }).length < 5) {
                positions.push(randomPos);
            }
        };
        while (positions.length < 15) {
            _loop_1();
        }
        return positions;
    };
    Game.prototype.createStones = function (count, color) {
        var stones = [];
        for (var i = 0; i < count; i++) {
            stones.push(new Stone(color));
        }
        return stones;
    };
    Game.prototype.moveStone = function (from, steps) {
        var _a, _b, _c, _d, _e, _f;
        // Prevent taking steps that haven't been rolled with dice
        if (!this.movesLeft.includes(steps)) {
            console.log("Invalid move: ".concat(steps, " is not a valid step based on the dice roll."));
            return false;
        }
        // Black player moves from prison
        if (from == -1 && this.currentPlayer == 'black')
            from = 24;
        var to = this.calculateDestination(from, steps);
        // Prevent invalid moves
        if (!this.isValidMove(from, to)) {
            console.log("Invalid move from ".concat(from + 1, " to ").concat(to + 1));
            return false;
        }
        var stone = from === -1
            ? this.currentPlayer === 'black'
                ? this.prisonBlack.pop()
                : this.prisonWhite.pop()
            : (_a = this.board[from]) === null || _a === void 0 ? void 0 : _a.pop();
        if (!stone) {
            console.log("No stone at position ".concat(from + 1));
            return false;
        }
        // Remove enemy stone from target if alone
        if (((_b = this.board[to]) === null || _b === void 0 ? void 0 : _b.length) == 1 &&
            ((_c = this.board[to]) === null || _c === void 0 ? void 0 : _c[0].color) != this.currentPlayer) {
            var enemyStone = (_d = this.board[to]) === null || _d === void 0 ? void 0 : _d.pop();
            if (enemyStone && this.currentPlayer == 'white') {
                this.prisonBlack.push(enemyStone);
            }
            else if (enemyStone) {
                this.prisonWhite.push(enemyStone);
            }
        }
        // Check if only legal finish moves are handled by this
        if (!this.board[to] && this.currentPlayer == 'white') {
            this.finishWhite += 1;
        }
        else if (!this.board[to]) {
            this.finishBlack += 1;
        }
        else {
            (_e = this.board[to]) === null || _e === void 0 ? void 0 : _e.push(stone);
        }
        if (((_f = this.board[from]) === null || _f === void 0 ? void 0 : _f.length) === 0) {
            this.board[from] = null;
        }
        // Remove only one move
        var indexOfMove = this.movesLeft.indexOf(steps);
        if (indexOfMove !== -1) {
            this.movesLeft.splice(indexOfMove, 1);
        }
        this.movesLeft.splice(steps, 1);
        return true;
    };
    Game.prototype.calculateDestination = function (from, steps) {
        if (this.currentPlayer === 'white') {
            return from + steps;
        }
        else {
            return from - steps;
        }
    };
    Game.prototype.isGameOver = function () {
        if (this.finishBlack == 15 || this.finishWhite == 15) {
            return true;
        }
        return false;
    };
    Game.prototype.whoIsWinner = function () {
        if (this.finishBlack == 15)
            return 'black';
        if (this.finishWhite == 15)
            return 'white';
        return 'no one';
    };
    //TODO test this method
    Game.prototype.isMovePossible = function (dice1, dice2) {
        // Get the list of possible dice moves
        var possibleMoves = dice1 === dice2 ? [dice1, dice1, dice1, dice1] : [dice1, dice2];
        // Check for the current player's prison status
        var prison = this.currentPlayer === 'white' ? this.prisonWhite : this.prisonBlack;
        if (prison.length > 0) {
            // If the player has stones in prison, they must move them out first
            for (var _i = 0, possibleMoves_1 = possibleMoves; _i < possibleMoves_1.length; _i++) {
                var move = possibleMoves_1[_i];
                var to = this.calculateDestination(-1, move);
                if (this.isValidMove(-1, to)) {
                    return true;
                }
            }
            return false;
        }
        // Iterate through each tile on the board
        for (var i = 0; i < this.board.length; i++) {
            var stones = this.board[i];
            if (stones &&
                stones.length > 0 &&
                stones[0].color === this.currentPlayer) {
                for (var _a = 0, possibleMoves_2 = possibleMoves; _a < possibleMoves_2.length; _a++) {
                    var move = possibleMoves_2[_a];
                    var to = this.calculateDestination(i, move);
                    if (this.isValidMove(i, to)) {
                        return true;
                    }
                }
            }
        }
        // No valid moves found
        return false;
    };
    Game.prototype.isValidMove = function (from, to) {
        var _a, _b;
        // First check prison moves
        if (from == -1 && this.prisonWhite.length != 0)
            return true;
        if (from == 24 && this.prisonBlack.length != 0)
            return true;
        // Check if source is on board
        if (from < 0 || from > 23)
            return false;
        // Check if source has coins at all
        if (!this.board[from] || ((_a = this.board[from]) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return false;
        // Check if white target is on board or can finish or has prisoner
        if (this.currentPlayer == 'white') {
            if (this.prisonWhite.length > 0)
                return false; //TODO: if source is not Prison
            if (to < 0)
                return false;
            if (to > 23 && !this.allCoinsHome('white')) {
                console.log('We tried to check if this is a valid move to finish this coin', this.allCoinsHome('white'));
                return false;
            }
        } // Check if black target is on board or can finish or has prisoner
        else if (this.currentPlayer == 'black') {
            if (this.prisonBlack.length > 0)
                return false; //TODO: if source is not Prison
            if (to > 23)
                return false;
            if (to < 0 && !this.allCoinsHome('black'))
                return false;
        }
        // Check source tile for correct color and existence
        var stone = (_b = this.board[from]) === null || _b === void 0 ? void 0 : _b[0];
        if (!stone || stone.color !== this.currentPlayer)
            return false;
        //Check destination for eligibility
        var destinationStones = this.board[to];
        if (destinationStones && destinationStones.length > 0) {
            if (destinationStones[0].color !== this.currentPlayer &&
                destinationStones.length > 1) {
                return false;
            }
        }
        return true;
    };
    Game.prototype.allCoinsHome = function (color) {
        var startIndex = color == 'white' ? 18 : 0;
        var coinsInBoard = 15 - (color == 'white' ? this.finishWhite : this.finishBlack);
        if (color == 'white') {
            if (this.prisonWhite.length > 0)
                return false;
        }
        else if ((color = 'black')) {
            if (this.prisonBlack.length > 0)
                return false;
        }
        var countCoinsInHome = 0;
        for (var i = 0; i < 6; i++) {
            countCoinsInHome += this.countCoins(color, startIndex + i);
        }
        console.log("Coins in board: ".concat(coinsInBoard, " and coins counted: ").concat(countCoinsInHome));
        if (coinsInBoard != countCoinsInHome)
            return false;
        return true;
    };
    Game.prototype.countCoins = function (color, index) {
        var _a;
        if (index < 0 || index >= 24 || !this.board[index]) {
            return -1;
        }
        return (((_a = this.board[index]) === null || _a === void 0 ? void 0 : _a.filter(function (stone) { return stone.color === color; }).length) || 0);
    };
    Game.prototype.switchPlayer = function () {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    };
    Game.prototype.rollDice = function () {
        this.dice = [this.getRandomDieRoll(), this.getRandomDieRoll()];
        if (this.dice[0] === this.dice[1]) {
            this.movesLeft = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]];
        }
        else {
            this.movesLeft = __spreadArray([], this.dice, true);
        }
        return this.dice;
    };
    Game.prototype.getRandomDieRoll = function () {
        return Math.floor(Math.random() * 6) + 1;
    };
    Game.prototype.calculateTotalDistance = function (color) {
        var totalDistance = 0;
        for (var i = 0; i < this.board.length; i++) {
            var stones = this.board[i];
            if (stones !== null) {
                for (var _i = 0, stones_1 = stones; _i < stones_1.length; _i++) {
                    var stone = stones_1[_i];
                    if (stone.color === color) {
                        if (color === 'white') {
                            totalDistance += 24 - i;
                        }
                        else if (color === 'black') {
                            totalDistance += i + 1;
                        }
                    }
                }
            }
        }
        return totalDistance;
    };
    Game.prototype.updateDistances = function () {
        this.totalDistanceBlack = this.calculateTotalDistance('black');
        this.totalDistanceWhite = this.calculateTotalDistance('white');
    };
    Game.prototype.displayBoard = function () {
        console.log("Current Player: ".concat(this.currentPlayer));
        this.updateDistances();
        var formatTile = function (tile) { return tile.padEnd(3, ' '); };
        var topRow = this.board
            .slice(0, 12)
            .map(this.formatPoint)
            .map(formatTile)
            .join(' ');
        var bottomRow = this.board
            .slice(12)
            .map(this.formatPoint)
            .reverse()
            .map(formatTile)
            .join(' ');
        console.log("[".concat(topRow, "]"));
        console.log("[".concat(bottomRow, "]"));
        console.log("White Prison: ".concat(this.prisonWhite.length, " stones\t\t\tBlack Prison: ").concat(this.prisonBlack.length, " stones"));
        console.log("Coins Finished: White = ".concat(this.finishWhite, "\t\tBlack = ").concat(this.finishBlack));
        console.log("Total Distance: White = ".concat(this.totalDistanceWhite, " steps\tBlack = ").concat(this.totalDistanceBlack, " steps"));
        console.log("Dice Roll: ".concat(this.dice[0], ", ").concat(this.dice[1], "\t\t\t\tMoves Left: ").concat(this.movesLeft.join(', ')));
    };
    Game.prototype.formatPoint = function (point, index) {
        if (!point || point.length === 0) {
            return '0';
        }
        var color = point[0].color.charAt(0).toUpperCase();
        return "".concat(point.length).concat(color);
    };
    return Game;
}());
var Stone = /** @class */ (function () {
    function Stone(color) {
        this.color = color;
    }
    return Stone;
}());
// Example of playing the game from the command line
var game = new Game();
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
function promptMove() {
    if (game.isGameOver()) {
        console.log("The game is finished, player ".concat(game.whoIsWinner(), " has won."));
        return;
    }
    if (game.movesLeft.length === 0) {
        game.switchPlayer();
        game.rollDice();
        if (!game.isMovePossible(game.dice[0], game.dice[1])) {
            console.log("No possible moves for ".concat(game.currentPlayer, ". Skipping turn."));
            game.switchPlayer();
            game.rollDice();
        }
        game.displayBoard();
    }
    readline.question('Enter your move (from steps): ', function (move) {
        var _a = move.split(' ').map(function (num) { return parseInt(num, 10); }), from = _a[0], steps = _a[1];
        if (game.moveStone(from - 1, steps)) {
            game.displayBoard();
        }
        else {
            console.log('Invalid move. Please enter a valid move.');
        }
        promptMove();
    });
}
promptMove();
