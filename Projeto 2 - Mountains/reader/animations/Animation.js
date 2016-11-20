/**
 * Animation
 * @constructor
 * @param {String} id of animation
 * @param {Float} timeSpan duration of animation in seconds
 @ @param {String} type of animations ("circular" or "linear")
 */
function Animation(id, timeSpan, type) {
   this.id = id;
   this.timeSpan = timeSpan;
   this.type = type;

   this.currentTime = 0;
}

Animation.prototype = Object.create(Animation.prototype);
Animation.prototype.constructor = Animation;

/**
 * Restarts animation
 */
Animation.prototype.restart = function(){
    this.currentTime = 0;
}