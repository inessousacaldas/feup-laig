/**
 * MyPlane
 * @constructor
 * @param {CGFscene} scene
 * @param {Integer} parts number of parts
 */
function MyPlane(scene, dimX, dimY, partsX, partsY){

	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
	this.getSurfacePoint = null;
	
	
	// Direction to +Z
	var controlPoints = [];
	
  	temp =  [
        [-this.dimX/2, -this.dimY/2, 0, 1],
		[-this.dimX/2, 0, 0, 1],
        [-this.dimX/2, this.dimY/2, 0,  1]
    ];

   
    controlPoints.push(temp);
	
	temp = [
		[0, -this.dimY/2, 0, 1], 
		[0, 0, 0, 1],
		[0, this.dimY/2, 0, 1]
	];
				
	controlPoints.push(temp);
	
	

	 var temp = [
        [this.dimX/2, -this.dimY/2, 0, 1],
		[this.dimX/2, 0, 0, 1],
        [this.dimX/2, this.dimY/2, 0, 1]
    ];


    controlPoints.push(temp);
	
	var knots = this.getKnotsVector(2)

	var nurbsSurface = new CGFnurbsSurface(2, 2, knots, knots, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};		
	
    CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

/**
 * Get knots vector according to degree
 * @param {Integer} degree
 */
MyPlane.prototype.getKnotsVector = function(degree) { 
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}


/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}


