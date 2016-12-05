/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTorus(scene, inner, outer, slices, loops) {
	CGFobject.call(this,scene);
	this.inner = inner;
	this.outer = outer;
	this.slices = slices;
	this.loops = loops;
	this.initBuffers();
};

MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor=MyTorus;

MyTorus.prototype.initBuffers = function () {
    this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

 	//Build the cylinder's main surface
 	var deltaAlpha = 360.0/this.slices
 	var deltaBeta = 360.0/this.loops;
 	var radius = (this.outer - this.inner)/2;

 	var deg2Rad = Math.PI/180.0;

	var beta = 0;
	for(var j = 0; j <= this.loops; j++)
	{
		var alpha = 0;
		var betaRad = beta*deg2Rad;
		
		for(var i = 0; i <= this.slices; i++)
		{
			var alphaRad = alpha*deg2Rad;

			//Generate the vertices
			var d = this.inner + radius + radius*Math.cos(betaRad);
			this.vertices.push(d*Math.cos(alphaRad),d*Math.sin(alphaRad),radius*Math.sin(betaRad));

			//Generate the indices
			if(i > 0 && j > 0)
			{
				this.indices.push((this.slices + 1) * j + i, (this.slices + 1) * j + (i-1), (this.slices + 1) * (j-1) + (i-1));
				this.indices.push((this.slices + 1) * j + i, (this.slices + 1) * (j-1) + (i-1), (this.slices + 1) * (j-1) + i);
			}

			//Generate the normals
			this.normals.push(d * radius * Math.cos(alphaRad) * Math.cos(betaRad), d * radius * Math.sin(alphaRad) * Math.cos(betaRad), d * radius * Math.sin(betaRad));

			//Generate the texture coords
			this.texCoords.push(i/(this.slices), 1-j/this.loops);

			alpha += deltaAlpha;
		}
		
		beta += deltaBeta;
	}

	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTorus.prototype.scaleTexCoords = function(ampS, ampT) {
	this.updateTexCoordsGLBuffers();
}