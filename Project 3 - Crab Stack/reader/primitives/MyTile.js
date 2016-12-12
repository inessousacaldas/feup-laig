/**
 * MyTile constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyTile(scene, id, board, piece){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.board = board;
    this.piece = piece;


    this.hexagon = new MyHexagon(this.scene);
}

MyTile.prototype = Object.create(CGFobject.prototype);
MyTile.prototype.constructor = MyTile;

/**
 * Set the piece on top of this tile.
 * @param {MyPiece} piece The piece that will be on top of this tile.
 */
MyTile.prototype.setPiece = function(piece) {
   this.piece = piece;
}


/**
 * Display function of the scene to render this object.
 */
MyTile.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.scale(1,0.5,1)
        this.hexagon.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyTile.prototype.scaleTexCoords = function(){}