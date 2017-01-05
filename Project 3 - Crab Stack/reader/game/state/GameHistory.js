/**
 * GameHistory constructor.
 * @constructor
 * @param {String} The string representing the initial board
 */
function GameHistory(_init_board, player1, player2){

    this.init_board = _init_board;
    this.moves = [];
    this.moves_replay = [];
    this.player1 = player1;
    this.player2 = player2;

}

GameHistory.prototype = Object.create(Object.prototype);
GameHistory.prototype.constructor = GameHistory;


GameHistory.prototype.addMove = function(init_board, to, from) {

    var move = new PlayerMove(init_board, to, from);
    this.moves.push(move);
    this.moves_replay.push(move);
}

GameHistory.prototype.undo = function() {

    if(this.moves.length != 0){
        this.moves_replay.pop();
        return this.moves.pop();

    }


    else return null;
}

GameHistory.prototype.startReplay = function(){

    this.moves_replay.reverse();

}

GameHistory.prototype.replay = function() {

    if(this.moves_replay.length != 0)
        return this.moves_replay.pop();

    //Re-instance the moves for the replay
    this.moves_replay = this.moves;

     return null;
}
