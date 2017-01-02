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

    this.topShell = new MyQuad(this.scene, 1, 1, 0.5, 100, 100);
    /*this.bottomShell = new MyQuad(this.scene, 0.88, 0.7, 0.5, 100, 100);

    this.bodyTriangle = new MyTriangle(this.scene, 0,0,0, 0.09, this.x, -0.14, 0.25, this.x, 0.5);
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

    this.texture.bind();

    this.scene.pushMatrix();
            this.scene.translate(0,0,5);
            //this.pyramid.display();
       this.scene.popMatrix();


    //Top shell right
   this.scene.pushMatrix();
        //this.scene.translate(0,0.43,0);
        //this.scene.rotate(Math.PI/2, 0,0,1);
        //this.scene.rotate(30*deg2rad, 0,1,0);
        this.topShell.display();
   this.scene.popMatrix();

   

   this.texture.unbind();

}



/**
 * texCoords scaling (no effect)
 */
MyRock.prototype.scaleTexCoords = function(){}
