/**
 * MyPlane constructor.
 * @constructor
 * @param scene {CGFscene} The scene to which this cylinder belongs.
 * @param parts {Integer} Number of parts of the plane along each coordinate.
 */
function MyPlaneText(scene, parts){
	var nurbsSurface = new CGFnurbsSurface(1, 1, [0,0,1,1], [0,0,1,1], [[[0.5,0,-0.5,1],[0.5,0,0.5,1]], [[-0.5,0,-0.5,1], [-0.5,0,0.5,1]]]);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, parts, parts);
    this.fixTexCoords();
}

MyPlaneText.prototype = Object.create(CGFnurbsObject.prototype);
MyPlaneText.prototype.constructor = MyPlaneText;

/**
 * fixes the texCoords along the s axis.
 */
MyPlaneText.prototype.fixTexCoords = function() {
	for (var i = 0; i < this.texCoords.length; i += 2)
		this.texCoords[i] = 1 - this.texCoords[i];

	this.initGLBuffers();
}

/**
 * texCoords scaling (no effect).
 */
MyPlaneText.prototype.scaleTexCoords = function() {}