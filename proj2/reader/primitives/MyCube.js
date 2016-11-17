/**
 * MyCube
 * @constructor
 * @param {CGFscene} scene
 */
function MyCube(scene) {
    CGFobject.call(this,scene);

    this.square = new MyRectangle(scene, 0, 1, 1, 0);
};

MyCube.prototype = Object.create(CGFobject.prototype);
MyCube.prototype.constructor=MyCube;

/**
 * Function to display a unity cube
 */
MyCube.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(0,0,0.5);
    this.displaySquare();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.5,0,0);
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.displaySquare();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0,0,-0.5);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.displaySquare();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.5,0,0.0);
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    this.displaySquare();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0,-0.5,0.0);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.displaySquare();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0,0.5,0.0);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.displaySquare();
    this.scene.popMatrix();
};
/**
 * Function to display a unity square.
 * Call by display
 */
MyCube.prototype.displaySquare = function() {
    this.scene.pushMatrix();
    this.scene.translate(-0.5, -0.5, 0);
    this.square.display();
    this.scene.popMatrix();
};
