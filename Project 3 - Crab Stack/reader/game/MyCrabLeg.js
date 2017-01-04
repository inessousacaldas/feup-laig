/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyCrabLeg(scene){
    CGFobject.call(this,scene);
    this.pyramid = new MyPyramid(this.scene, 1, 1);

}

MyCrabLeg.prototype = Object.create(CGFobject.prototype);
MyCrabLeg.prototype.constructor = MyCrabLeg;

/**
 * Display function of the scene to render this object.
 */
MyCrabLeg.prototype.display = function() {

    this.scene.pushMatrix();
            this.scene.translate(0,-0.5,1.3);
            this.scene.scale(1,1,1.3);
            this.scene.rotate(-180*deg2rad,0,1,0);
            this.scene.rotate(-45*deg2rad,1,0,0);
            this.pyramid.display();
        this.scene.popMatrix();

    this.scene.pushMatrix();
        this.pyramid.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
            this.scene.rotate(180*deg2rad,0,1,0);
            this.scene.scale(1,1,3);
            this.pyramid.display();
    this.scene.popMatrix();


}



/**
 * texCoords scaling (no effect)
 */
MyCrabLeg.prototype.scaleTexCoords = function(){}
