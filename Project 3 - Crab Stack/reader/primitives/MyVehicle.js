/**
 * MyVehicle constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this sphere belongs.
 */
function MyVehicle(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
	this.balloon = new MyPatch(this.scene, 3, 20, 20, [[[-0.65, 0, 0.6, 1],[-0.9, 0, 0.25, 1],[-0.9, 0, -0.25,1], [-0.65, 0, -0.6,1]],
														[[-0.25 ,0 ,0.9, 1], [-9 ,10 ,9, 1],[-9 ,10 ,-9, 1],[-0.25 ,0 ,-0.9, 1]],
														[[0.25 ,0 ,0.9,1],[9 ,10 ,9,1],[9 ,10 ,-9,1],[0.25 ,0 ,-0.9,1]],
														[[0.65 ,0 ,0.6,1],[0.9 ,0 ,0.25,1],[0.9 ,0 ,-0.25,1],[0.65,0,-0.6,1]]]);


	this.cube = new MyCube(this.scene);
	this.rope =  new MyFullCylinder(this.scene, 5, 0.05, 0.05, 20, 20);

	this.textures = [];
	this.textures["balloon"] = new Texture(this.scene, "scenes/textures/balloon.jpg", 'balloon');
	this.textures["rope"] = new Texture(this.scene, "scenes/textures/rope.jpg", 'rope');
	this.textures["basket"] = new Texture(this.scene, "scenes/textures/basket.jpg", 'basket');

										 						   
													   
}

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

/** 
 * Display function of the scene to render this object.
 */
MyVehicle.prototype.display = function() {
	
	
	this.scene.pushMatrix();
	this.scene.scale(1.2,1.2,1.2);
	this.scene.translate(0,-0.1,0);
	this.textures["balloon"].bind();
	this.balloon.display();
	this.textures["balloon"].unbind();
	this.scene.popMatrix();


	this.scene.pushMatrix();
	this.scene.scale(2,2,2);
	this.scene.translate(0,-2.5,0);
	this.textures["basket"].bind();
	this.cube.display();
	this.textures["basket"].unbind();
	this.scene.popMatrix();
	
	this.textures["rope"].bind();
	this.scene.pushMatrix();
	this.scene.rotate(88*Math.PI/180,1,0,0);
	this.scene.rotate(9*Math.PI/180,0,1,1);
	this.scene.translate(0.3,0.5,0);
	this.rope.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI,0,1,0);
	this.scene.rotate(88*Math.PI/180,1,0,0);
	this.scene.rotate(9*Math.PI/180,0,1,1);
	this.scene.translate(0.3,0.5,0);
	this.rope.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2,0,1,0);
	this.scene.rotate(88*Math.PI/180,1,0,0);
	this.scene.rotate(9*Math.PI/180,0,1,1);
	this.scene.translate(0.3,0.5,0);
	this.rope.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(3*Math.PI/2,0,1,0);
	this.scene.rotate(88*Math.PI/180,1,0,0);
	this.scene.rotate(9*Math.PI/180,0,1,1);
	this.scene.translate(0.3,0.5,0);
	this.rope.display();
	this.scene.popMatrix();
}	



/**
 * texCoords scaling (no effect)
 */
MyVehicle.prototype.scaleTexCoords = function() {}