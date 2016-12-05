/**
 * RotationAnimation
 * @constructor
 * @param id identification of animation
 * @param timeSpan duration of animation
 * @param dw angular velocity
 * @param axis axis of the rotation
 */
function RotationAnimation(id, timeSpan, dw, axis) {
    Animation.call(this, id, timeSpan, "rotation");
    this.timeSpan = timeSpan;
    this.animateTransformations = mat4.create();
    this.dw = dw;
    this.axis = axis;
    this.center = vec3.fromValues(0, 0, 0);
    this.radius = 0;
    this.init();
   

}

//RotationAnimation extends Animation
RotationAnimation.prototype = Object.create(Animation.prototype);
RotationAnimation.prototype.constructor = RotationAnimation;

/**
 * Sets initial position of animated object
 */
RotationAnimation.prototype.init = function() {
	
	mat4.identity(this.animateTransformations); 


}




/**
 * Restarts animation
 */
RotationAnimation.prototype.restart = function(){
    this.currentAng = this.startAngle;
    this.animateTransformations = mat4.create();
    mat4.identity(this.animateTransformations);
   // Animation.restart();
}

/**
 * Updates coordinates for current time
 * @param currTime current time
 */
RotationAnimation.prototype.update = function(currTime){
	//If timeSpan = -1 duration of animation is infinite
 	if(this.timeSpan != -1)
 		currTime = Math.min(currTime, this.timeSpan);
	
	var transformation = mat4.create();
	mat4.identity(transformation);

	if (currTime < 0)
		return transformation;
	
	var rot = this.dw*currTime;

    switch (this.axis){

        case "x":
        case "X":
            mat4.rotateX(transformation, transformation, rot);
            break;
        case "y":
        case "Y":
            mat4.rotateY(transformation, transformation, rot);
            break;
        case "z":
        case "Z":
            mat4.rotateZ(transformation, transformation, rot);
            break;
    }

	return transformation;

}


