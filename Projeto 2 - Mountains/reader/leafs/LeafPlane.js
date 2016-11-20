/**
 * LeafPlane
 * @constructor
 * @param {String} id of plane
 * @param {Integer} parts number of parts
 */
function LeafPlane(id, dimX, dimY, partsX, partsY) {
    Leaf.call(this, id, "plane");
    this.partsX = partsX;
	this.partsY = partsY;
	this.dimX = dimX;
	this.dimY = dimY;
}

LeafPlane.prototype = Object.create(Leaf.prototype);
LeafPlane.prototype.constructor = LeafPlane;
