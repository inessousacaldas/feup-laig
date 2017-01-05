/**
 * MyTerrain constructor.
 * @constructor 
 * @param {CGFscene} scene The scene that contains the terrain
 * @param {String} textureUrl Url of the texture
 * @param {String} heightmapUrl Url of the heightmap texture
 * @param {Float} height minimum value of scale for the heightmap
 * @param {Float} maxHeight maximum value of scale for the heightmap
 */
function MyTerrain(scene, textureUrl, heightMapUrl, height, maxHeight){
    CGFobject.call(this,scene);
	this.plane = new MyPlane(this.scene, 80, 80, 60, 60);
	this.texture = new CGFtexture(this.scene, textureUrl);
	this.heightMap = new CGFtexture(this.scene, heightMapUrl);
	this.height = height;
	this.scale = height;
	this.maxHeight = maxHeight;
	this.dheight = (maxHeight - height)/15;
	this.shader = new CGFshader(this.scene.gl, 'shaders/terrain.vert', 'shaders/terrain.frag');
    this.shader.setUniformsValues({uSampler2: 1});
    this.shader.setUniformsValues({scale: this.scale});
    this.timer = 0;
    this.dtime = 2;
}

MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;

/** 
 * Display function of the scene to render this object.
 */
MyTerrain.prototype.display = function() {
	
	if(this.scale > this.maxHeight || this.scale < this.height){
		this.dheight = -this.dheight;
	}

	this.scale = this.scale + this.dheight;
	this.shader.setUniformsValues({scale: this.scale});

    this.scene.setActiveShader(this.shader);

    this.texture.bind();
    this.heightMap.bind(1);
	
	this.plane.display();

    this.heightMap.unbind(1);
    this.texture.unbind();

	this.scene.setActiveShader(this.scene.defaultShader);
}

/**
 * texCoords scaling (no effect)
 */
MyTerrain.prototype.scaleTexCoords = function() {}