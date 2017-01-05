/**
 * GameHistory constructor.
 * @constructor
 * @param {String} _init_board The string representing the initial board
 * @param {Player} player1 Player1
 * @param {Player} player2 Player2
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

/**
 * Adds a move to the history
 * @param {String} init_board Board
 * @param {MyTile} to Destination tile
 * @param {MyTile} from Origin tile
 */
GameHistory.prototype.addMove = function(init_board, to, from) {

    var move = new PlayerMove(init_board, to, from);
    this.moves.push(move);
    this.moves_replay.push(move);
}

/**
 * Undo the last move
 */
GameHistory.prototype.undo = function() {

    if(this.moves.length != 0){
        this.moves_replay.pop();
        return this.moves.pop();

    }


    else return null;
}

/**
 * Starts the game replay
 */
GameHistory.prototype.startReplay = function(){

    this.moves_replay.reverse();

}

/**
 * Replays the game
 */
GameHistory.prototype.replay = function() {

    if(this.moves_replay.length != 0)
        return this.moves_replay.pop();

    //Re-instance the moves for the replay
    this.moves_replay = this.moves;

     return null;
}
