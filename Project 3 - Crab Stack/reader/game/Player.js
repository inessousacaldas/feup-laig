/**
 * Player constructor.
 * @constructor
 * @param {Integer} identifier of player
 * @param {String} name of player
 * @param {String} type of player ("human", "computer")
 * @param {String} color of the player's crabs
 * @param {Integer} level of the player (not used for type "human")
 */
function Player(id, name, type, color, lvl){

    this.id = id;
	this.name = name;
	this.type = type;
	this.color = color;
	this.lvl = lvl;
	this.moves = 0;
	this.winner = false;

    if(this.id == 1)
        this.logic_color = 'g';
    else
        this.logic_color = 'r';

}

Player.prototype = Object.create(Object.prototype);
Player.prototype.constructor = Player;

/**
 * Checks if the player is a computer
 */
Player.prototype.isComputer = function (){

    if(this.type == "computer")
        return true;

    return false;

}
