/**
 * LeafSphere
 * @constructor
 * @param {String} id identification of sphere
 * @param {Float} radius radius of sphere
 * @param {Integer} slices number of slices to draw the sphere
 * @param {Integer} stacks number of stacks to draw the sphere
 */
function LeafSphere(id, radius, stacks, sections) {
    Leaf.call(this, id, "sphere");
    this.radius = radius;
    this.stacks = stacks;
    this.sections = sections;
}

LeafSphere.prototype = Object.create(Leaf.prototype);
LeafSphere.prototype.constructor = LeafSphere;