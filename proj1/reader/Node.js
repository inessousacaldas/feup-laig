/**
 * Node
 * @constructor
 * @id node id
 */
function Node(id) {
    this.id = id;
    this.material = "inherit";
	this.materials = [];
	this.materialIter = 0;
    this.texture = "none";
    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);
    this.children = [];
}

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

/*
 * Sets the material of the node
 * @param material 
 */

Node.prototype.setMaterial = function(material) {
    this.material = material;
}

Node.prototype.addMaterial = function(material) {
    this.materials.push(material);
	
}

Node.prototype.changeMaterial = function() {
	this.materialIter++;
	if (this.materialIter >= this.materials.length)
		this.materialIter = 0;
	this.material = this.materials[this.materialIter];
	
}

/*
 * Sets the texture of the node
 * @param texture
 */
Node.prototype.setTexture = function(texture) {
     this.texture = texture;
}

/*
 * Add a new child to the node
 * @param child
 */
Node.prototype.addChild = function(child) {
    this.children.push(child);
}

/*
 * Applies a rotation to the axis x
 * @param rad degrees in radians
 */
Node.prototype.rotateX = function(rad) {
    mat4.rotateX(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis y
 * @param rad degrees in radians
 */
Node.prototype.rotateY = function(rad) {
    mat4.rotateY(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis z
 * @param rad degrees in radians
 */
Node.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a scaling to the node
 * @param sx
 * @param sy
 * @param sz
 */
Node.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.localTransformations, this.localTransformations, vec3.fromValues(sx,sy,sz));
}

/*
 * Applies a translation to the node
 * @param x
 * @param y
 * @param z
 */
Node.prototype.translate = function(x, y, z) {
    mat4.translate(this.localTransformations, this.localTransformations, vec3.fromValues(x, y, z));
}

/*
 * Multiplies a transformation matrix with local transformations
 * @param matrix transformation matrix (mat4)

 */
Node.prototype.multMatrix = function(matrix){
	
	//this.localTransformations = mat4.multiply(this.localTransformations, matrix);
	mat4.multiply(this.localTransformations, matrix, this.localTransformations);
}


