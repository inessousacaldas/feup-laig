/**
 * MyFullCylinder
 * @constructor
 * @param {CGFscene} scene
 * @param {Float} height height of cylinder
 * @param {Float} bRadius radius ob bottom
 * @param {Float} tRadius radius of top
 * @param {Integer} stacks number of slices to draw the cylinder
 * @param {Integer} slices number of slices to draw the cylinder
 */
function MyFullCylinder(scene, height, bRadius, tRadius, stacks, slices) {
	 CGFobject.call(this,scene);
	 
    this.slices = slices || 16;
    this.stacks = stacks || 16;
    this.tRadius = tRadius || 1;
    this.bRadius = bRadius || 1;
    this.height = height || 1;


    this.cylinder = new MyCylinder(scene, this.height, this.bRadius, this.tRadius, this.stacks, this.slices) ;
    this.cylinder.initBuffers();

    this.topFace = new MyCircle(scene, this.tRadius, this.slices);
 	 this.topFace.initBuffers();

    this.botFace = new MyCircle(scene, this.bRadius, this.slices);
 	this.botFace.initBuffers();
};

MyFullCylinder.prototype = Object.create(CGFobject.prototype);
MyFullCylinder.prototype.constructor = MyFullCylinder;

/*
 * Displays de cylinder
 */
MyFullCylinder.prototype.display = function()
{
    this.scene.pushMatrix();

    this.scene.translate(0, 0, this.height/2);

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height/2);
    this.topFace.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -this.height/2);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.botFace.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
};

/**
 * Texture amplify factors
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyFullCylinder.prototype.scaleTexCoords = function(s, t) {
    this.cylinder.scaleTexCoords(s, t);
};