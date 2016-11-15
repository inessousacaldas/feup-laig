/**
 * MyPatch extends CGFnurbsSurface
 * @constructor
 * @param {CGFscene} scene 
 * @param {Integer} order order of patch
 * @param {Integer} partsU number of parts in V
 * @param {Integer} partsV number of parts in V
 * @param {Array} controlPoints array with the controlpoint to draw the surface
 */
function MyPatch(scene, order ,partsU, partsV, controlPoints){
	
	if(order == 1){
		knots = [0, 0, 1, 1];
	}else if(order == 2){
		knots = [0, 0, 0, 1, 1, 1];
	}else if(order == 3){
		knots = [0, 0, 0, 0, 1, 1, 1, 1];
	}else{
		console.error("Wrong order of Pacth");
		return;
	}
	
	var nurbsSurface = new CGFnurbsSurface(order, order, knots, knots, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, partsU, partsV);
}

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyPatch.prototype.scaleTexCoords = function(s, t) {}