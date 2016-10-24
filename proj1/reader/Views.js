/**
 * Views
 * @constructor
 * @param id identification of the view
 * @param near value near of CGFcamera
 * @param far value far of CGFcamera
 * @param angle value angle of CGFcamera
 * @param fromX x value of position of CGFcamera
 * @param fromY y value of position of CGFcamera
 * @param fromZ z value of position of CGFcamera
 * @param toX x value of target of CGFcamera
 * @param toY y value of target of CGFcamera
 * @param toZ z value of target of CGFcamera
 */
function Views(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ) {
	
	this.views = [];
	this.idDefault = null;
};

Views.prototype = Object.create(Object.prototype);
Views.prototype.constructor = Views;

/**
 * Adds a view to the array
 * @param id identification of the view
 * @param near value near of CGFcamera
 * @param far value far of CGFcamera
 * @param angle value angle of CGFcamera
 * @param fromX x value of position of CGFcamera
 * @param fromY y value of position of CGFcamera
 * @param fromZ z value of position of CGFcamera
 * @param toX x value of target of CGFcamera
 * @param toY y value of target of CGFcamera
 * @param toZ z value of target of CGFcamera
 */
Views.prototype.addView = function(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ) {
	
	
	
	var view = {
		id:id,
		near:near,
		far:far,
		angle:angle,
		fromX:fromX,
		fromY:fromY,
		fromZ:fromZ,
		toX:toX,
		toY:toY,
		toZ:toZ
	};
	
	this.views.push(view);
	
};


/**
 * Gets the current active id
 */
Views.prototype.getDefault = function(){
	return this.idDefault;
};

/**
 * Sets the active id
 * @param id identification of the view
 */
Views.prototype.setDefault = function(id){
	this.idDefault = id;
};

/**
 * Gets the active view
 */
Views.prototype.getCurrentView = function() {
	
	return this.views[this.idDefault];
};

/**
 * Changes the current active view
 */
Views.prototype.changeView = function(){
	
	if(this.idDefault == this.views.length - 1)
		this.idDefault = 0;
	else this.idDefault++;
	
};