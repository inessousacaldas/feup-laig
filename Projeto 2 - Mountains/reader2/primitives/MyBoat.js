/**
 * MyBoat constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which the boat belongs.
 */
function MyBoat(scene){
     CGFobject.call(this,scene);
    this.scene = scene;
	this.boat = new MyPatch(this.scene, 3, 20, 20, [[[0,0.5,2,1],[0,0.5,2,1],[0,0.5,2,1],[0,0.5,2,1]],
												     [[-1,0,1,1],[0,-2,1,1],[0,-2,1,1],[1,0,1,1]],
												     [[-1,0,0,1],[0,-2,0,1],[0,-2,0,1],[1,0,0,1]],
												     [[-1,0,-1,1],[0,0,-1.5,1],[0,0,-1.5,1],[1,0,-1,1]]]);
		
	this.floor =  new MyPatch(this.scene, 3, 20, 20, [[[0,0.5,2,1],[0,0.5,2,1],[0,0.5,2,1],[0,0.5,2,1]],
												      [[1,0,1,1],[-0.33,0,1,1],[0.33,-0,1,1],[-1,0,1,1]],
												     [[1,0,0,1],[-0.33,0,0,1],[0.33,-0,0,1],[-1,0,0,1]],
												     [[1,0,-1,1],[0,0,-1.5,1],[0,0,-1.5,1],[-1,0,-1,1]]]);

	this.pole = new MyCylinder(this.scene,1.5,0.05,0.05, 20, 20);
	
	
	this.flag_front = new MyPatch(this.scene, 1,20,20,[[[0,0,1],[0,0,1.5]],
													[[1,0,1],[1,0,1.5]]]);

	this.flag_back = new MyPatch(this.scene, 1,20,20,[[[1,0,1],[1,0,1.5]],
												 [[0,0,1],[0,0,1.5]]]);



	this.textures = [];
	this.textures["boat"] = new Texture(this.scene, "scenes/textures/wood.png", 'wood');
	this.textures["floor"] = new Texture(this.scene, "scenes/textures/woodFloor.png", 'floor');
	this.textures["flag"] = new Texture(this.scene, "scenes/textures/basket.jpg", 'basket');

										 						   
													   
}

MyBoat.prototype = Object.create(CGFobject.prototype);
MyBoat.prototype.constructor = MyBoat;

/** 
 * Display function of the scene to render this object.
 */
MyBoat.prototype.display = function() {
	
	this.scene.pushMatrix();

	this.textures["boat"].bind();
	this.boat.display();
	this.textures["boat"].unbind();

	this.textures["floor"].bind();
	this.floor.display();
	this.textures["floor"].unbind();
	
	
	this.scene.popMatrix();
}	



/**
 * texCoords scaling (no effect).
 */
MyBoat.prototype.scaleTexCoords = function() {}


		

	
