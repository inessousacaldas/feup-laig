/**
 * PlayerMove constructor.
 * @constructor
 * @param {String} _init_board Board
 * @param {MyTile} _from Destination tile
 * @param {MyTile} _to Origin tile
 */
function PlayerMove(_init_board, _from, _to){

    this.init_board = _init_board;
    this.from = _from;
    this.to = _to;

}

PlayerMove.prototype = Object.create(Object.prototype);
PlayerMove.prototype.constructor = PlayerMove;



