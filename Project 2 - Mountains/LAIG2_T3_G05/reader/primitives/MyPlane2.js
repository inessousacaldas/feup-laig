/**
 * MyMyPlane
 * @constructor
 * @param {CGFscene} scene
 * @param {Integer} dimX dimension in x
 * @param {Integer} dimY dimension in y
 * @param {Integer} partsX parts in x
 * @param {Integer} partsY parts in y
 */
function MyPlane(scene, dimX, dimY, partsX, partsY) {
	//CGFnurbsObject.call(this,scene);

	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
	this.getSurfacePoint = null;

	//this.initBuffers();
	
	//CGFnurbsObject.call(this, scene, this.getSurfacePoint, this.partsX, this.partsY);
	
	
	var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1],
	[
        [
            [0.5, 0, -0.5, 1],
            [0.5, 0, 0.5, 1]
        ],
        [
            [-0.5, 0, -0.5, 1],
            [-0.5, 0, 0.5, 1, 1]
        ]
    ]);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};		
	
    CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
	
};

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function () {
	
	var controlPoints = [];


    var temp = [
        [this.dimX/2, -this.dimY/2, 0, 1],
        [this.dimX/2, this.dimY/2, 0, 1]
    ];

    controlPoints.push(temp);


  	temp =  [
        [-this.dimX/2, -this.dimY/2, 0, 1],
        [-this.dimX/2, this.dimY/2, 0,  1]
    ];

    controlPoints.push(temp);


	//To center in origin
	/*var temp =  [
					[-this.dimX/2, -this.dimY/2, 0, 1], 
					[-this.dimX/2, 0, 0, 1],
					[-this.dimX/2, this.dimY/2, 0, 1]
				];
	
	controlPoints.push(temp);
	
	temp = [
					[0, -this.dimY/2, 0, 1], 
					[0, 0, 0, 1],
					[0, this.dimY/2, 0, 1]
				];
				
	controlPoints.push(temp);
				
	temp = [
				[this.dimX/2, -this.dimY/2, 0, 1],
				[this.dimX/2, 0, 0, 1],
				[this.dimX/2, this.dimY/2, 0, 1]
			];
	
	controlPoints.push(temp);
	*/
	
	this.makeSurface(1,1, controlPoints);
};

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

MyPlane.prototype.makeSurface = function (degree1, degree2, controlPoints) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2); 
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlPoints); 
	this.getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	
}

/*
MyPlane.prototype.display = function () {

    this.plane.display();

}*/

/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}