/**
 * Node
 * @constructor
 * @param {Float} id node identification
 */
function Node(id) {
    this.id = id;
    this.material = "null";
    this.texture = "clear";
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
 * @param {String} material identification of material
 */

Node.prototype.setMaterial = function(material) {
    this.material = material;
}

/*
 * Sets the texture of the node
 * @param {String} texture identification of texture
 */
Node.prototype.setTexture = function(texture) {
     this.texture = texture;
}

/*
 * Add a new child to the node
 * @param {String} child identification of child
 */
Node.prototype.addChild = function(child) {
    this.children.push(child);
}

/*
 * Applies a rotation to the axis x
 * @param {Float} rad degrees in radians for rotaion
 */
Node.prototype.rotateX = function(rad) {
    mat4.rotateX(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis y
 * @param {Float} rad degrees in radians for rotaion
 */
Node.prototype.rotateY = function(rad) {
    mat4.rotateY(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a rotation to the axis z
 * @param {Float} rad degrees in radians for rotaion
 */
Node.prototype.rotateZ = function(rad) {
    mat4.rotateZ(this.localTransformations, this.localTransformations, rad);
}

/*
 * Applies a scaling to the node
 * @param {Float} sx scale factor in the direction of x-axis
 * @param {Float} sy scale factor in the direction of y-axis
 * @param {Float} sz scale factor in the direction of z-axis
 */
Node.prototype.scale = function(sx, sy, sz) {
    mat4.scale(this.localTransformations, this.localTransformations, vec3.fromValues(sx,sy,sz));
}

/*
 * Applies a translation to the node
 * @param {Float} x coordinate of x-axis
 * @param {Float} y coordinate of y-axis
 * @param {Float} z coordinate of z-axis
 */
Node.prototype.translate = function(x, y, z) {
    mat4.translate(this.localTransformations, this.localTransformations, vec3.fromValues(x, y, z));
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
