/**
 * MyCrabMedium constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabMedium(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 1;

    this.cylinder = new MyFullCylinder(this.scene,1,0.3,0.3,16,16);
}

MyCrabMedium.prototype = Object.create(CGFobject.prototype);
MyCrabMedium.prototype.constructor = MyCrabMedium;


/**
 * Display function of the scene to render this object.
 */
MyCrabMedium.prototype.display = function() {

    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyCrabMedium.prototype.scaleTexCoords = function(){}
