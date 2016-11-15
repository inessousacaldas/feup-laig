/**
 * MySphere
 * @constructor
 * @param {CGFscene} scene
 * @param {Float} radius radius of sphere
 * @param {Integer} slices number of slices to draw the sphere
 * @param {Integer} stacks number of stacks to draw the sphere
 */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius=radius;
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

/*
 * Initializes the the buffers to draw the sphere
 */
 MySphere.prototype.initBuffers = function() {

	this.indices = [];
 	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];

 	var dTheta = Math.PI / this.stacks;
 	var dPhi = 2 * Math.PI / this.slices;

	for (var stack = 0; stack <= this.stacks; ++stack) {
		for (var slice = 0; slice <= this.slices; ++slice) {
			this.vertices.push(this.radius * Math.sin(stack * dTheta) * Math.cos(slice * dPhi), this.radius * Math.sin(stack * dTheta) * Math.sin(slice * dPhi), this.radius * Math.cos(stack * dTheta));
			this.normals.push(Math.sin(stack * dTheta) * Math.cos(slice * dPhi), Math.sin(stack * dTheta) * Math.sin(slice * dPhi), Math.cos(stack * dTheta));
			this.texCoords.push(slice/this.slices, stack/this.stacks);
		}
	}

	for (var stack = 0; stack < this.stacks; ++stack) {
		for (var slice = 0; slice < this.slices; ++slice) {
			this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice + 1);
			this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + slice + 1, stack * (this.slices + 1) + slice + 1);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 
/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MySphere.prototype.scaleTexCoords = function(s, t) {
	this.updateTexCoordsGLBuffers();
}