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
	

	var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1]);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};		
	
    CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}


