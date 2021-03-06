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
    this.animations = [];
    this.animationTransformation = mat4.create();

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

/*
 * Adds a material to the node
 * @param material 
 */
Node.prototype.addMaterial = function(material) {
    this.materials.push(material);
	
}

/*
 * Changes the current material of the node
 */
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


/*
 * Adds an animation to the node
 * @param {Animation} newAnimation new animation to node
 */
Node.prototype.addAnimation = function(newAnimation){

    this.animations.push(newAnimation);
}

/*
 * Calculates animation matrix for the current time
 * @param {Float} currTime current time
 */
Node.prototype.update = function(currTime){

    if (this.animations.length == 0)
        return 'null';

    var time = currTime;
    var i;


    for (i = 0; i < this.animations.length - 1 ; i++) {
        if (time < this.animations[i].timeSpan)
            break;
        time = time - this.animations[i].timeSpan;
    }
    this.animationTransformation = this.animations[i].update(time);
    return this.animationTransformation;

}

