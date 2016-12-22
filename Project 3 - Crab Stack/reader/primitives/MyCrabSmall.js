/**
 * MyCrabSmall constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabSmall(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 0.8;

    this.cylinder = new MyFullCylinder(this.scene,0.8,0.15,0.15,16,16);
}

MyCrabSmall.prototype = Object.create(CGFobject.prototype);
MyCrabSmall.prototype.constructor = MyCrabSmall;


/**
 * Display function of the scene to render this object.
 */
MyCrabSmall.prototype.display = function() {

    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyCrabSmall.prototype.scaleTexCoords = function(){}
