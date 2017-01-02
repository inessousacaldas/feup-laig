/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyCrab(scene, player){
    this.x = 0.863;
    this.player = player;
    CGFobject.call(this,scene);
    this.scene = scene;

    if (this.player == 1)
                 this.texture = new Texture(this.scene, 'scenes/textures/crab.jpg', 'crab');
            else
                 this.texture = new Texture(this.scene, 'scenes/textures/crab2.jpg', 'crab');

    this.textureChest = new Texture(this.scene, 'scenes/textures/crabChest.jpg', 'crabChest');
    this.textureEye = new Texture(this.scene, 'scenes/textures/crabEye.jpg', 'crabEye');

    this.topShell = new MyQuad(this.scene, 1, 1, 0.5, 100, 100);
    this.bottomShell = new MyQuad(this.scene, 0.88, 0.7, 0.5, 100, 100);

    this.bodyTriangle = new MyTriangle(this.scene, 0,0,0, 0.09, this.x, -0.14, 0.25, this.x, 0.5);
    this.bodyTriangle2 = new MyTriangle(this.scene, 0,0,0, 0.16, 0, -0.64, 0.25, -this.x, -0.5);
    this.bottomEye = new MyFullCylinder(this.scene, 0.30, 0.05, 0.025);
    this.eye = new MySphere(this.scene, 0.1, 16, 16);
    this.pyramid = new MyPyramid(this.scene, 1, 5);

}

MyCrab.prototype = Object.create(CGFobject.prototype);
MyCrab.prototype.constructor = MyCrab;

/**
 * Display function of the scene to render this object.
 */
MyCrab.prototype.display = function() {

    this.texture.bind();

    this.scene.pushMatrix();
            this.scene.translate(0,0,2);
            //this.pyramid.display();
       this.scene.popMatrix();


    //Top shell right
   this.scene.pushMatrix();
        this.scene.translate(0,0.43,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.rotate(30*deg2rad, 0,1,0);
        this.topShell.display();
   this.scene.popMatrix();

   //Top shell left
   this.scene.pushMatrix();
       this.scene.translate(0,-0.43,0);
       this.scene.rotate(-Math.PI/2, 0,0,1);
       this.scene.rotate(30*deg2rad, 0,1,0);
       this.topShell.display();
    this.scene.popMatrix();

    //Bottom shell right
   this.scene.pushMatrix();
        this.scene.translate(0,0.43,-0.32);
        this.scene.rotate(180*deg2rad, 0, 1, 0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.rotate(10*deg2rad, 0,1,0);
        this.bottomShell.display();
   this.scene.popMatrix();

    //Bottom shell left
    this.scene.pushMatrix();
        this.scene.translate(0,-0.43,-0.32);
        this.scene.rotate(180*deg2rad, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 0,0,1);
        this.scene.rotate(10*deg2rad, 0,1,0);
        this.bottomShell.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.25,this.x,-0.25);
        this.scene.rotate(180*deg2rad, 0,0,1);
        this.bodyTriangle.display();
    this.scene.popMatrix();

    //Shell chest back
    this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0.25);
        this.bodyTriangle2.display();
    this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(0.2,0.3,0.08);
        this.scene.rotate(-10*deg2rad, 1,0,0);
        this.bottomEye.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.2,-0.3,0.08);
        this.scene.rotate(10*deg2rad, 1,0,0);
        this.bottomEye.display();
    this.scene.popMatrix();

    this.texture.unbind();

    this.textureChest.bind();

    //Shell chest back
    this.scene.pushMatrix();
        this.scene.translate(0.25,-this.x,-0.25);
        this.bodyTriangle.display();
    this.scene.popMatrix();

    //Shell chest
    this.scene.pushMatrix();
        this.scene.translate(0.5,0,0.25);
        this.scene.rotate(-180*deg2rad, 0,0,1);
        this.bodyTriangle2.display();
    this.scene.popMatrix();

    this.textureChest.unbind();


    //Eyes
    this.textureEye.bind();

    this.scene.pushMatrix();
        this.scene.translate(0.2,0.3,0.08);
        this.scene.rotate(-10*deg2rad, 1,0,0);
        this.scene.translate(0.05, 0, 0.35);
        this.scene.rotate(180*deg2rad, 0,0,1);
        this.scene.scale(1,1,1.5)
        this.eye.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.2,-0.3,0.08);
        this.scene.rotate(10*deg2rad, 1,0,0);
        this.scene.translate(0.05, 0, 0.35);
        this.scene.rotate(180*deg2rad, 0,0,1);
        this.scene.scale(1,1,1.5)
        this.eye.display();
    this.scene.popMatrix();

    this.textureEye.unbind();

}



/**
 * texCoords scaling (no effect)
 */
MyCrab.prototype.scaleTexCoords = function(){}
