/**
 * MyPiece constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyPiece(scene, id, tile){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.tile = tile;

    //this.cylinder = new MyFullCylinder(this.scene);

    this.applyMaterial=false;
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

MyTile.prototype.processPick = function() {
    console.log("Estou a mudar de cor!");
    if (this.applyMaterial)
        this.applyMaterial = false;
    else
        this.applyMaterial = true;
}


/**
 * Display function of the scene to render this object.
 */
MyTile.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(1,0.5,1);
    if (this.applyMaterial)
        this.material.apply();
    this.hexagon.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyTile.prototype.scaleTexCoords = function(){}/**
 * Created by cmigu on 21/12/2016.
 */
