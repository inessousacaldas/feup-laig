/**
 * LeafChessboard constructor
 * @constructor 
 * @param {String} id identification of chessboard
 * @param {Integer} du number of pieces in direction u
 * @param {Integer} dv number of pieces in direction v
 * @param {CGFtexture} texture chessboard texture
 * @param {Integer} su u-coord of the selected piece (-1 for none)
 * @param {Integer} sv v-cood of the selected piece (-1 for none)
 * @param {RGBA} c1 first color of chessboard
 * @param {RGBA} c2 second color of chessboard
 * @param {RGBA} c3 selected color of chessboard
 */
function LeafChessboard(id, du, dv, texture, su, sv, c1, c2, cs) {
    Leaf.call(this, id, "chessboard");
	this.du = du;
    this.dv = dv;
	this.texture = texture;
	this.su = su;
	this.sv = sv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;
}

LeafChessboard.prototype = Object.create(Leaf.prototype);
LeafChessboard.prototype.constructor = LeafChessboard;

