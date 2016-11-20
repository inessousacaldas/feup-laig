/**
 * MyPlane
 * @constructor
 * @param {CGFscene} scene
 * @param {Integer} parts number of parts
 */
function MyPlane(scene, dimX, dimY, partsX, partsY){


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
}

MyPlane.prototype = Object.create(CGFnurbsObject.prototype);
MyPlane.prototype.constructor = MyPlane;

/**
 * Texture amplify factors - no effect
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
MyPlane.prototype.scaleTexCoords = function(ampS, ampT) {}


