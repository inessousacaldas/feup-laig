/**
 * LeafPatch
 * @constructor
 * @param {String} id identification of patch
 * @param {Integer} degree degree of patch in U and V
 * @param {Integer} partsU number of parts in U
 * @param {Integer} partsV number of parts in V
 * @param {Array} controlPoints array with controlpoints for surface
 */
function LeafPatch(id, degree, partsU, partsV, controlPoints) {
    Leaf.call(this, id, "patch");
    this.id = id;
    this.degree = degree;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlPoints = controlPoints;

}

LeafPatch.prototype = Object.create(Leaf.prototype);
LeafPatch.prototype.constructor = LeafPatch;