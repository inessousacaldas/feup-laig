/**
 * LeafPlane
 * @constructor
 * @param {String} id of plane
 * @param {Integer} parts number of parts
 */
function LeafPlane(id, parts) {
    Leaf.call(this, id, "plane");
    this.parts = parts;
}

LeafPlane.prototype = Object.create(Leaf.prototype);
LeafPlane.prototype.constructor = LeafPlane;
