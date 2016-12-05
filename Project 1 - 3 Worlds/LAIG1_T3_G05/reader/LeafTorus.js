/**
 * LeafTorus
 * @constructor
 * @param id of torus
 * @param inner radius of inner circle
 * @param outer radius of outer circle
 * @param slices number of slices
 * @param loops number of loops
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