/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyRock(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.texture = new Texture(this.scene, 'scenes/textures/rock.jpg', 'rock');

    this.rightSide = new MyQuad(this.scene, 1, 0.8, 1, 100, 100);
    this.side1 = new MyQuad(this.scene, 0.3, 1, 1, 100, 100);
    this.side2 = new MyQuad(this.scene, 0.2, 1, 1, 100, 100);
    this.frontSide = new MyQuad(this.scene, 0.5, 1, 1, 100, 100);
    this.side3 = new MyQuad(this.scene, 0.1, 1, 1, 100, 100);

    /*this.bodyTriangle = new MyTriangle(this.scene, 0,0,0, 0.09, this.x, -0.14, 0.25, this.x, 0.5);
    this.bodyTriangle2 = new MyTriangle(this.scene, 0,0,0, 0.16, 0, -0.64, 0.25, -this.x, -0.5);
    this.bottomEye = new MyFullCylinder(this.scene, 0.30, 0.05, 0.025);
    this.eye = new MySphere(this.scene, 0.1, 16, 16);
    this.pyramid = new MyPyramid(this.scene, 1, 5);*/

}

MyRock.prototype = Object.create(CGFobject.prototype);
MyRock.prototype.constructor = MyRock;

/**
 * Display function of the scene to render this object.
 */
MyRock.prototype.display = function() {

    //this.texture.bind();

    this.scene.scale(4,4,4);

    this.scene.pushMatrix();
            this.scene.translate(0,0,5);
            //this.pyramid.display();
       this.scene.popMatrix();


    //Top shell right
   this.scene.pushMatrix();
        this.rightSide.display();
   this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.62,0,-0.071);
        this.scene.rotate(30*deg2rad,0,1,0);
        this.side1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.775,0,-0.24);
        this.scene.rotate(75*deg2rad,0,1,0);
        this.side2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.8,0,-0.57);
        this.scene.rotate(90*deg2rad,0,1,0);
        this.frontSide.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.783,0,-0.865);
        this.scene.rotate(110*deg2rad,0,1,0);
        this.side3.display();
    this.scene.popMatrix();

   

   //this.texture.unbind();

}



/**
 * texCoords scaling (no effect)
 */
MyRock.prototype.scaleTexCoords = function(){}
