/**
 * LeafTriangle
 * @constructor
 * @param id of rectangle
 * @param x0 x-coord of first vertice
 * @param y0 y-coord of first vertice
 * @param z0 z-coord of first vertice
 * @param x1 x-coord of second vertice
 * @param y1 y-coord of second vertice
 * @param z1 y-coord of second vertice
 * @param x2 x-coord of third vertice
 * @param y2 y-coord of third vertice
 * @param z2 z-coord of third vertice
 */
function LeafTorus(id, inner, outer, slices, loops) {
    Leaf.call(this, id, "torus");
    this.inner = inner;
	this.outer = outer;
	this.slices = slices;
	this.loops = loops;
}

LeafTriangle.prototype = Object.create(Leaf.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;