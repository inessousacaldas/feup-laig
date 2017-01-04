/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyCrab(scene, player, color){
    this.x = 0.863;
    this.player = player;
    CGFobject.call(this,scene);
    this.scene = scene;

     this.texture = new Texture(this.scene, 'scenes/textures/crab/crab_' + this.player.color +'.jpg', 'crab');

    this.textureChest = new Texture(this.scene, 'scenes/textures/crab/crabChest.jpg', 'crabChest');
    this.textureEye = new Texture(this.scene, 'scenes/textures/crab/crabEye.jpg', 'crabEye');

    this.topShell = new MyQuad(this.scene, 1, 1.5, 1, 100, 100);
    this.bottomShell = new MyQuad(this.scene, 0.88, 1.2, 1, 100, 100);

    this.bodyTriangle = new MyTriangle(this.scene, 0,0,0, 0.09, this.x, -0.14, 0.25, this.x, 0.5);
    this.bodyTriangle2 = new MyTriangle(this.scene, 0,0,0, 0.16, 0, -0.64, 0.25, -this.x, -0.5);
    this.bottomEye = new MyFullCylinder(this.scene, 0.30, 0.05, 0.025);
    this.eye = new MySphere(this.scene, 0.1, 16, 16);
    this.leg = new MyCrabLeg(this.scene);
    this.claw = new MyCrabClaw(this.scene);

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
        //this.scene.rotate(15*deg2rad, 0,0,1);
       // this.scene.rotate(-60*deg2rad, 1,0,0);
       // this.scene.scale(0.16,0.29,0.16 );
     //   this.claw.display();
   this.scene.popMatrix();

    /* CRAB LEGS */

    //FRONT LEGS
    this.scene.pushMatrix();
        this.scene.translate(0.3,-0.8,-0.55);
        this.scene.rotate(15*deg2rad, 0,0,1);
        this.scene.rotate(-60*deg2rad, 1,0,0);
        this.scene.scale(0.16,0.29,0.16 );
        this.leg.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
       this.scene.translate(0.3,0.8,-0.55);
       this.scene.rotate(165*deg2rad, 0,0,1);
       this.scene.rotate(-60*deg2rad, 1,0,0);
       this.scene.scale(0.16,0.29,0.16);
       this.leg.display();
  this.scene.popMatrix();

    //MIDDLE LEGES
    this.scene.pushMatrix();
        this.scene.translate(-0.05,-0.8,-0.50);
        this.scene.rotate(-10*deg2rad, 0,0,1);
        this.scene.rotate(-60*deg2rad, 1,0,0);
        this.scene.scale(0.15,0.27,0.15);
        this.leg.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
       this.scene.translate(-0.05,0.8,-0.50);
       this.scene.rotate(190*deg2rad, 0,0,1);
       this.scene.rotate(-60*deg2rad, 1,0,0);
       this.scene.scale(0.15,0.27,0.15);
       this.leg.display();
  this.scene.popMatrix();

    //BACK LEGS
    this.scene.pushMatrix();
        this.scene.translate(-0.3,-0.8,-0.50);
        this.scene.rotate(-30*deg2rad, 0,0,1);
        this.scene.rotate(-60*deg2rad, 1,0,0);
        this.scene.scale(0.13,0.24,0.13);
        this.leg.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
       this.scene.translate(-0.3,0.8,-0.50);
       this.scene.rotate(210*deg2rad, 0,0,1);
       this.scene.rotate(-60*deg2rad, 1,0,0);
       this.scene.scale(0.13,0.24,0.13);
       this.leg.display();
  this.scene.popMatrix();

  /* -- END LEGS --*/

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
        this.scene.translate(-0.50,this.x,-0.25); //aqui
        this.scene.rotate(180*deg2rad, 0,0,1);
        this.bodyTriangle.display();
    this.scene.popMatrix();

    //Shell chest back
    this.scene.pushMatrix();
        this.scene.translate(-0.75,0,0.25); //aqui
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
        this.scene.translate(0.50,-this.x,-0.25);
        this.bodyTriangle.display();
    this.scene.popMatrix();

    //Shell chest
    this.scene.pushMatrix();
        this.scene.translate(0.75,0,0.25);
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
