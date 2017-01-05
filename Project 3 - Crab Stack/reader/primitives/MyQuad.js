/**
 * MyQuad
 * @constructor
 * @param {CGFscene} scene
 * @param {Integer} dimX dimension in X
 * @param {Integer} dimY dimension in Y
 * @param {Integer} dimY2 dimension in Y2
 * @param {Integer} partsX parts in X
 * @param {Integer} partsY parts in Y
 */
function MyQuad(scene, dimX, dimY, dimY2, partsX, partsY){

	this.dimX = dimX;
	this.dimY = dimY;
	this.dimY2 = dimY2;
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
    var y = Math.abs(this.dimY - this.dimY2)/2;
    y = this.dimY - y;
	temp = [
		[0, -y/2, 0, 1],
		[0, 0, 0, 1],
		[0, y/2, 0, 1]
	];

	controlPoints.push(temp);



	 var temp = [
        [this.dimX/2, -this.dimY2/2, 0, 1],
		[this.dimX/2, 0, 0, 1],
        [this.dimX/2, this.dimY2/2, 0, 1]
    ];


    controlPoints.push(temp);

	var knots = this.getKnotsVector(2)

	var nurbsSurface = new CGFnurbsSurface(2, 2, knots, knots, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
}

MyQuad.prototype = Object.create(CGFnurbsObject.prototype);
MyQuad.prototype.constructor = MyQuad;

/**
 * Get knots vector according to degree
 * @param {Integer} degree
 */
MyQuad.prototype.getKnotsVector = function(degree) {

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
MyQuad.prototype.scaleTexCoords = function(ampS, ampT) {}


