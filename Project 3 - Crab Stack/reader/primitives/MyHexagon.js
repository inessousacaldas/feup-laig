/**
 * MyHexagon constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this hexagon belongs.
 */
function MyHexagon(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.triangleBackward = new MyTriangle(this.scene,1,0,0,0.5,0,0.87,0,0,0);
    this.triangle = new MyTriangle(this.scene,0.5,0,0.87,1,0,0,0,0,0);

    this.rectangle = new MyRectangle(this.scene,0,0,1,1);
    this.rectangleBackward = new MyRectangle(this.scene,0,1,1,0);



}

MyHexagon.prototype = Object.create(CGFobject.prototype);
MyHexagon.prototype.constructor = MyHexagon;

/**
 * Display function of the scene to render this object.
 */
MyHexagon.prototype.display = function() {

    //top hexagon
    this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.scale(4,4,4);

        for (var i=0;i<6;i++){
            this.scene.translate(1,0,0);
            this.scene.rotate(-60*Math.PI/180,0,1,0);
            this.triangle.display();
            this.triangleBackward.display();
        }

    this.scene.popMatrix();

    //bottom hexagon
    this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.scale(4,4,4);

        for (var i=0;i<6;i++){
            this.scene.translate(1,0,0);
            this.scene.rotate(-60*Math.PI/180,0,1,0);
            this.triangle.display();
            this.triangleBackward.display();
        }

    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.scale(4,1,4);

        for (var i=0;i<6;i++){
            this.scene.translate(1,0,0);
            this.scene.rotate(-60*Math.PI/180,0,1,0);
            this.rectangle.display();
            this.rectangleBackward.display();
        }

    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyHexagon.prototype.scaleTexCoords = function() {}