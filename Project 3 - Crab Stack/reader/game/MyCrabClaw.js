/**
 * MyCrabClaw constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyCrabClaw(scene){
    CGFobject.call(this,scene);
    this.pyramid = new MyPyramid(this.scene, 1, 1);
    this.angle = 90 * deg2rad;

}

MyCrabClaw.prototype = Object.create(CGFobject.prototype);
MyCrabClaw.prototype.constructor = MyCrabClaw;

/**
 * Display function of the scene to render this object.
 */
MyCrabClaw.prototype.display = function() {

    var height = 0.43*Math.sin(this.angle);

    this.scene.pushMatrix();
        this.scene.translate(-1.5,0,-1.28);

        this.scene.rotate(80*deg2rad,0,1,0);
        //    this.scene.rotate(-45*deg2rad,1,0,0);
        this.scene.scale(0.7,0.7,2);
        this.pyramid.display();
     this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(-180*deg2rad,0,1,0);
        this.pyramid.display();
     this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(1,1,1);
        this.pyramid.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,-height,0.43);
        this.scene.rotate(this.angle,1,0,0);
        this.pyramid.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(180*deg2rad,0,1,0);
        this.scene.scale(1,1,3);
    this.scene.popMatrix();


}



/**
 * texCoords scaling (no effect)
 */
MyCrabClaw.prototype.scaleTexCoords = function(){}
