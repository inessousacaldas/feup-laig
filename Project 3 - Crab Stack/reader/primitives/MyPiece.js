/**
 * MyPiece constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyPiece(scene, id, tileId){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.tileId = tileId;
    this.selected = false;

    this.cylinder = new MyFullCylinder(this.scene,1,0.3,0.3,16,16);
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.processPick = function() {
    //console.log("Selecionei a peça do tile " + this.tileId);
    if (this.selected)
        this.selected = false;
    else
        this.selected = true;
}

/**
 * Display function of the scene to render this object.
 */
MyPiece.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.rotate(90*deg2rad,1,0,0);
        this.scene.translate(0.5,0.7,0);
        this.cylinder.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyPiece.prototype.scaleTexCoords = function(){}
