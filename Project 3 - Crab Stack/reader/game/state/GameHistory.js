/**
 * GameHistory constructor.
 * @constructor
 * @param {String} The string representing the initial board
 */
function GameHistory(_init_board){

    this.init_board = _init_board;
    this.moves = [];

}

GameHistory.prototype = Object.create(Object.prototype);
GameHistory.prototype.constructor = GameHistory;


GameHistory.prototype.addMove = function(init_board, to, from) {

    var move = new PlayerMove(init_board, to, from);
    this.moves.push(move);
}

GameHistory.prototype.undo = function() {

    if(this.moves.length != 0)
        return moves.pop();

    else return null;
}
