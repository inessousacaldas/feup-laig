/**
 * MyPiece constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyPiece(scene, id, tileId, crab, player){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.tileId = tileId;
    this.crabType = crab;
    this.player = player;

    this.height = 0;
    
    this.chooseCrab()

    this.materialRed = new Material(this.scene,1);
    this.materialRed.setEmission(1,0,0,1);
    this.materialRed.setAmbient(1,0,0,1);
    this.materialRed.setDiffuse(1,0,0,1);
    this.materialRed.setSpecular(1,0,0,1);
    this.materialRed.setShininess(0.2);

    this.materialBlue = new Material(this.scene,2);
    this.materialBlue.setEmission(0,0,1,1);
    this.materialBlue.setAmbient(0,0,1,1);
    this.materialBlue.setDiffuse(0,0,1,1);
    this.materialBlue.setSpecular(0,0,1,1);
    this.materialBlue.setShininess(0.2);
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;


MyPiece.prototype.chooseCrab = function() {

    switch (this.crabType){
        case "B":
        case "b":
            this.crab = new MyCrabBig(this.scene);
            break;
        case "M":
        case "m":
            this.crab = new MyCrabMedium(this.scene);
            break;
        case "S":
        case "s":
            this.crab = new MyCrabSmall(this.scene);
            break;
    }

    this.height = this.crab.height;
}

/**
 * Display function of the scene to render this object.
 */
MyPiece.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.rotate(90*deg2rad,1,0,0);
        this.scene.translate(0.5,0.7,0);
        if (this.player == 1)
            this.materialRed.apply();
        else
            this.materialBlue.apply();
        this.crab.display();
        this.scene.setDefaultAppearance();

    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyPiece.prototype.scaleTexCoords = function(){}
