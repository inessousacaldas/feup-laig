/**
 * MyRectangle 
 * @constructor
 * @param {CGFscene} scene 
 * @param {Float} x1 x-coord of point 1
 * @param {Float} y1 y-coord of point 1
 * @param {Float} x2 x-coord of point 2
 * @param {Float} y2 y-coord of point 2
 */
function MyRectangle(scene,x1,y1,x2,y2){
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    
    this.x2 = x2;
    this.y2 = y2;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

/*
 * Initializes the the buffers to draw the rectangle
 */
MyRectangle.prototype.initBuffers = function() {

    this.vertices = [
    	this.x1, this.y2, 0,
    	this.x2, this.y2, 0,
    	this.x2, this.y1, 0,
    	this.x1, this.y1, 0
    ];

    this.indices = [
    	0, 1, 2,
    	0, 2, 3
    ];

	this.normals = [
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1
    ];

    this.nonScaledTexCoords = [
    	0, this.y1-this.y2,
    	this.x2-this.x1, this.y1-this.y2,
    	this.x2-this.x1, 0,
    	0, 0
    ];

	this.texCoords = this.nonScaledTexCoords.slice(0);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}


/**
 * Texture amplify factors
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyRectangle.prototype.scaleTexCoords = function(s, t) {
	for (var i = 0; i < this.texCoords.length; i += 2) {
		this.texCoords[i] = this.nonScaledTexCoords[i] / s;
		this.texCoords[i + 1] = this.nonScaledTexCoords[i+1] / t;
	}

	this.updateTexCoordsGLBuffers();
}