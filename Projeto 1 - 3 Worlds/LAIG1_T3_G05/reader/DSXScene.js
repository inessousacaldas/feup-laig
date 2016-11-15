/*
 * DSXScene extends CFGscene
 * @constructor
 * @param application CFGapplication
 */
function DSXScene(application) {
    CGFscene.call(this);
}

DSXScene.prototype = Object.create(CGFscene.prototype);
DSXScene.prototype.constructor = DSXScene;

/*
 * Initializes content of scene
 * @param application CFGapplication
 */
DSXScene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.myinterface = null;
    this.graph = null;

	this.allLights = 'All'; //ID To control all lights
    this.lightsEnabled = []; //Control every single light

	this.primitives = [];
 	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.enableTextures(true);
};
/*
 * Sets the interface of the scene
 */
DSXScene.prototype.setInterface = function(myinterface) {
	this.myinterface = myinterface;
}

/*
 * Create camera in default position
 */
DSXScene.prototype.initCameras = function () {
	
	var camera = this.graph.views.getCurrentView();
	
	this.camera.angle = camera.angle;
	this.camera.near = camera.near;
	this.camera.far = camera.far;
	this.camera.setPosition(vec3.fromValues(camera.fromX, camera.fromY, camera.fromZ));
	this.camera.setTarget(vec3.fromValues(camera.toX, camera.toY, camera.toZ));
	this.camera.direction = this.camera.calculateDirection();
	this.camera._up = vec3.fromValues(0.0, 1.0, 0.0);
    this.camera._viewMatrix = mat4.create();
    this.camera._projectionMatrix = mat4.create();

};
DSXScene.prototype.updateCamera = function () {
	this.graph.views.changeView();
	this.initCameras();
}


/*
 * Defines default apperence
 */
DSXScene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.5, 0.5, 0.5, 1);
    this.setDiffuse(0.5, 0.5, 0.5, 1);
    this.setSpecular(0.5, 0.5, 0.5, 1);
    this.setShininess(10.0);	
};

/*
 * Called on the graph is loaded ok
 */
DSXScene.prototype.onGraphLoaded = function () 
{
	
	this.initCameras(); //Set default configuration of camera view

    if (this.graph.axisLength > 0)
	   this.axis = new CGFaxis(this, this.graph.axisLength);
	   
	this.gl.clearColor(this.graph.illumination.background[0],this.graph.illumination.background[1],this.graph.illumination.background[2],this.graph.illumination.background[3]);
	this.setGlobalAmbientLight(this.graph.illumination.ambient[0],this.graph.illumination.ambient[1],this.graph.illumination.ambient[2],this.graph.illumination.ambient[3]);

	this.lights = [];

	//load lights from the Grahps
	//All lights are invisible, enabled or not depends from the DSX
    for (var i = 0; i < this.graph.lights.length; ++i) {
    	this.lights.push(this.graph.lights[i]);
    	this.lights[i].setVisible(false);
    	this.lightsEnabled[this.lights[i].name] = this.lights[i].enabled;
		this.lights[i].update();
    }

	
	//controls all lights
    this.lightsEnabled[this.allLights] = false;
	for (i in this.lights) {
    	if(this.lights[i].enabled){
			 this.lightsEnabled[this.allLights] = true;
			 break;
		}
    }

	//loads interface
	if (this.myinterface != null)
	    this.myinterface.onGraphLoaded();

	//sets primitives
    for (key in this.graph.leaves) {
    	var leaf = this.graph.leaves[key];
    	switch (leaf.type) {
    		case "rectangle":
    			this.primitives[key] = new MyRectangle(this, leaf.x0, leaf.y0, leaf.x1, leaf.y1);
    			break;
    		case "triangle":
    			this.primitives[key] = new MyTriangle(this, leaf.v1[0], leaf.v1[1], leaf.v1[2], leaf.v2[0], leaf.v2[1], leaf.v2[2], leaf.v3[0], leaf.v3[1], leaf.v3[2]);
    			break;
    		case "cylinder":
				this.primitives[key] = new MyFullCylinder(this, leaf.height, leaf.bottomRadius, leaf.topRadius, leaf.sections, leaf.parts);
				break;
			case "sphere":
				this.primitives[key] = new MySphere(this, leaf.radius, leaf.stacks, leaf.sections);
				break;
			case "torus":
				//descomentar qd torus estiver pronto
				this.primitives[key] = new MyTorus(this, leaf.inner, leaf.outer, leaf.slices, leaf.loops);
				break;
    	}
    }
};

/*
 * Draws the scene. Updates with changes
 */
DSXScene.prototype.display = function () {

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	//View position initialization is equal to identity
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations from the camera setup
	this.applyViewMatrix();


	//Process scene if DSX read ok
	if (this.graph != null && this.graph.loadedOk)
	{	
		this.multMatrix(this.graph.localTransformations);
	
		for (var i = 0; i < this.lights.length; ++i)
			this.lights[i].update();

		
		// Draw axis
		if (this.axis)
	   		this.axis.display();

	   	//Set default appearance
		this.setDefaultAppearance();

		//Draws the scene from the graph by processing all nodes starting from the root
		this.processScene();
	}	

};

/*
 * Process graph starting from root
 */
DSXScene.prototype.processScene = function() {
	var root = { type:"componentref", id:this.graph.root };
	this.processNode(root, "none", "inherit");
	this.setDefaultAppearance();
}

/* 
 * Process node
 * @param parentTexture receives the texture from the parent
 * @param parentMaterial receives the material from the parent
 */
DSXScene.prototype.processNode = function(node, parentTexture, parentMaterial) {
	//Node is leaf
	if (node.type == "primitiveref") {
		//set materials
		if (parentMaterial != "inherit")
			this.graph.materials[parentMaterial].apply();
		else
			this.setDefaultAppearance();
	
		//set texture
		var texture;

		if (parentTexture != "none")
		{
			texture = this.graph.textures[parentTexture];
			this.primitives[node.id].scaleTexCoords(texture.amplifyFactor.s, texture.amplifyFactor.t);
			texture.bind();
		}
		//get primitive to draw
		this.primitives[node.id].display();

		if (texture)
			texture.unbind();
		return;
	}
	
	//Applies transformations
	this.pushMatrix();
	
	this.multMatrix(this.graph.components[node.id].localTransformations);

	//Receives material and texture from parent?
	var material = this.graph.components[node.id].material;
	if (material == "inherit")
		material = parentMaterial;

	var texture = this.graph.components[node.id].texture;
	if (texture == "inherit")
		texture = parentTexture;

	//Process the node's children
	var children = this.graph.components[node.id].children;
	for (var i = 0; i < children.length; ++i) {
		this.processNode(children[i], texture, material);
	}

	this.popMatrix();
}

/*
 * Updates lights from the interface
 * @param lightId
 * @param enable boolean
 */
DSXScene.prototype.updateLight = function(lightId, enable) {
	
	//Switch only one light
	if(lightId != this.allLights){
		console.log("Changing light " + lightId);
		for (var i = 0; i < this.graph.lights.length; ++i) {
			if (this.lights[i].name == lightId) {
				var light = this.lights[i];
				enable ? light.enable() : light.disable();
				return;
			}
		}
	}else{
		//Switch all lights
		console.log("Changing all lights");
		for (var i = 0; i < this.graph.lights.length; ++i) {	
			var light = this.lights[i];
			enable ? light.enable() : light.disable();

		}
	
	}
}

DSXScene.prototype.changeMaterials=function () {
	var id;
	for (id in this.graph.components) {
		this.graph.components[id].changeMaterial();
	}
};