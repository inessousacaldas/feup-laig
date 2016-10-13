/**
 * Views
 * @constructor
 * @param scene CFGscene
 * @param path to file of texture
 * @param id identification of the texture
 */
function Views(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ) {
	
	this.views = [];
	this.idDefault = null;
};

Views.prototype = Object.create(Object.prototype);
Views.prototype.constructor = Views;

/**
 * Texture amplify factors
 * @param s 
 * @param t
 */
Views.prototype.addView = function(id, near, far, angle, fromX, fromY, fromZ, toX, toY, toZ) {
	
	
    var camera = new CGFcamera(angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
	console.log('nova camera');
	this.views.push(camera);
	
};

Views.prototype.getDefault = function(){
	return this.idDefault;
};

Views.prototype.setDefault = function(id){
	this.idDefault = id;
};

Views.prototype.repetedId = function(id){
	return (id in this.views);
};

Views.prototype.getCurrentView = function() {
	return this.views[this.idDefault];
};

Views.prototype.changeView = function(){
	
	if(this.idDefault == this.views.length - 1)
		this.idDefault = 0;
	else this.idDefault++;
	
};