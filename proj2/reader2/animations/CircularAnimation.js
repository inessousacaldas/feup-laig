/**
 * CircularAnimation
 * @constructor
 * @param {String} id identification of animation
 * @param {Float} timeSpan duration of animation
 * @param {vec3} center position of center of the circular motion
 * @param {Float} radius in radians of the circular motion
 * @param {Float} startAngle start angle in radians of the circular motion
 * @param {Float} rotAngle angle of rotation in radians of the circular motion
 */
function CircularAnimation(id, timeSpan, center, radius, startAngle, rotAng) {
    Animation.call(this, id, timeSpan, "circular");
    this.timeSpan = timeSpan;
    this.center = center;
    this.radius = radius;
    this.startAngle = startAngle;
    this.rotAngle = rotAng;
    this.animateTransformations = mat4.create();
    this.dw = rotAng/timeSpan;
    this.init();
    this.animationTransformation = mat4.create();
   

}

//CircularAnimation extends Animation
CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Sets initial position of animated object
 */
CircularAnimation.prototype.init = function() {
	mat4.identity(this.animateTransformations);
	 
	mat4.rotateY(this.animateTransformations, this.animateTransformations, this.startAngle);

	mat4.translate(this.animateTransformations, this.animateTransformations,
				   vec3.fromValues(0, 0, this.radius));
				   
	mat4.rotateY(this.animateTransformations, this.animateTransformations,
				this.rotAngle > 0 ? Math.PI / 2 : - Math.PI / 2);

}


/**
 * Restarts animation
 */
CircularAnimation.prototype.restart = function(){
    this.currentAng = this.startAngle;
    this.animateTransformations = mat4.create();
    mat4.identity(this.animateTransformations);
   // Animation.restart();
}

/**
 * Updates coordinates for current time
 * @param {Float} currTime current time
 */
CircularAnimation.prototype.update = function(currTime){
 	currTime = Math.min(currTime, this.timeSpan);
	
	var transformation = mat4.create();
	mat4.identity(transformation);

	if (currTime < 0)
		return transformation;
	
	var rot = this.dw*currTime;

	mat4.translate(transformation, transformation, this.center);
	mat4.rotateY(transformation, transformation, rot);
	mat4.multiply(transformation, transformation, this.animateTransformations);
	this.animationTransformation = transformation;
	return transformation;

}


