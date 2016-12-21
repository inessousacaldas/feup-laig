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

    this.material = new Material(this.scene,1);
    this.material.setEmission(1,1,1,1);
    this.material.setAmbient(0.1,0.1,0.5,1);
    this.material.setDiffuse(0.8,0.8,0.8,1);
    this.material.setSpecular(0.5,0.5,0.5,1);
    this.material.setShininess(0.2);

    this.hexagon = new MyHexagon(this.scene);

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
MyTile.prototype.scaleTexCoords = function(){}