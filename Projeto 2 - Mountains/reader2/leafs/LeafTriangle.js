/**
 * LeafTriangle
 * @constructor
 * @param {String} id identification of leaf triangle
 * @param {Float} x1 x-coord of vertice v1
 * @param {Float} y1 y-coord of vertice v1
 * @param {Float} z1 z-coord of vertice v1
 * @param {Float} x2 x-coord of vertice v2
 * @param {Float} y2 y-coord of vertice v2
 * @param {Float} z2 z-coord of vertice v2
 * @param {Float} x3 x-coord of vertice v3
 * @param {Float} y3 y-coord of vertice v3
 * @param {Float} z3 xzcoord of vertice v3
 */
function LeafTriangle(id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    Leaf.call(this, id, "triangle");
    this.v1 = vec3.fromValues(x1, y1, z1);
    this.v2 = vec3.fromValues(x2, y2, z2);
    this.v3 = vec3.fromValues(x3, y3, z3);
}

LeafTriangle.prototype = Object.create(Leaf.prototype);
LeafTriangle.prototype.constructor = LeafTriangle;