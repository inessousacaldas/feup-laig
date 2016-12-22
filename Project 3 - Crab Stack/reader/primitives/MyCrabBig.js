/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabBig(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 1.3;

    this.cylinder = new MyFullCylinder(this.scene,1.3,0.5,0.5,16,16);
}

MyCrabBig.prototype = Object.create(CGFobject.prototype);
MyCrabBig.prototype.constructor = MyCrabBig;


/**
 * Display function of the scene to render this object.
 */
MyCrabBig.prototype.display = function() {

    this.scene.pushMatrix();
        this.cylinder.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyCrabBig.prototype.scaleTexCoords = function(){}
