/**
 * MyTile constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function Player(id, name, type, color, lvl){

    this.id = id;
	this.name = name;
	this.type = type;
	this.color = color;
	this.lvl = lvl;

    if(this.id == 1)
        this.logic_color = 'g';
    else
        this.logic_color = 'r';

}

Player.prototype = Object.create(Object.prototype);
Player.prototype.constructor = Player;
