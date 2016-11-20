/**
 * LeafCylinder
 * @constructor
 * @param {String} id identification of cylinder
 * @param {Float} h height of the cylinder
 * @param {Float} bottomR radius of bottom
 * @param {Float} topR radius of top
 * @param {Integer} sections number of sections
 * @param {Integer} parts number of parts
 */
function LeafCylinder(id, h, bottomR, topR, sections, parts) {
    Leaf.call(this, id, "cylinder");
    this.height = h;
    this.bottomRadius = bottomR;
    this.topRadius = topR;
    this.sections = sections;
    this.parts = parts;
}

LeafCylinder.prototype = Object.create(Leaf.prototype);
LeafCylinder.prototype.constructor = LeafCylinder;