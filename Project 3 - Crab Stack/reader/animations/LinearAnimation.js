/**
 * LinearAnimation
 * @constructor
 * @param {String} id of linear animation
 * @param {Float} timeSpan duration of animation
 * @param {Array} controlPoints points describing linear transformation
 */
function LinearAnimation(id, timeSpan, controlPoints) {
    Animation.call(this, id, timeSpan, "linear");

    this.controlPoints = controlPoints;
    this.animationTransformation = mat4.create();
    this.init();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


/**
 * Sets variables for linear animation from calculation of direction and distance from controlpoints 
 */
LinearAnimation.prototype.init = function() {
    
	var distance = 0;
    this.translations = new Array(this.controlPoints.length - 1);
    this.rotations = new Array(this.controlPoints.length - 1);

    for (var i = 0; i < this.controlPoints.length - 1; i++) {
        var vector = vec3.create();
        vec3.sub(vector, this.controlPoints[i + 1], this.controlPoints[i]);
        this.translations[i] = vector;

        var projection = vec3.fromValues(vector[0], 0, vector[2]);

        if (vec3.length(projection) > 0) {
            var sign = projection[0] < 0 ? -1 : 1;
            this.rotations[i] = sign * Math.acos(vec3.dot(projection, vec3.fromValues(0, 0, 1))/ vec3.length(projection));
        } else {
            this.rotations[i] = (i == 0 ? 0 : this.rotations[i - 1]);  
        }
    
        distance += vec3.length(vector);
    }

    var velocity = distance / this.timeSpan;

    this.controlPointsTime = new Array(this.controlPoints.length);
    this.controlPointsTime[0] = 0;

    this.controlPointsTimeSpan = new Array(this.controlPoints.length - 1);

    for (var i = 1; i < this.controlPoints.length; ++i) {    
        this.controlPointsTime[i] = this.controlPointsTime[i - 1] +
                               vec3.length(this.translations[i-1]) / velocity;
        this.controlPointsTimeSpan[i-1] = this.controlPointsTime[i] - this.controlPointsTime[i-1]; 
    }
}


/**
 * Updates coordinates for current time
 * @param {Float} currTime current time
 */
LinearAnimation.prototype.update = function(currTime) {
    
    var matrix = mat4.create();
    mat4.identity(matrix);
    
    if (currTime < 0)
        return matrix;

    currTime = Math.min(currTime, this.timeSpan);
   
    var index;
    for (index = this.controlPointsTime.length - 1; index > 0; --index)
        if (this.controlPointsTime[index] < currTime)
            break;

    var tScale = (currTime - this.controlPointsTime[index]) / this.controlPointsTimeSpan[index];
    var position = vec3.clone(this.controlPoints[index]);
    var translation_amount = vec3.create();
    vec3.scale(translation_amount, this.translations[index], tScale);
    vec3.add(position, position, translation_amount); 

    mat4.translate(matrix, matrix, position);
    mat4.rotateY(matrix,matrix,this.rotations[index]);
    
    this.animationTransformation = matrix;
    return matrix;
}

















