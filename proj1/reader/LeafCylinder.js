/**
 * LeafCylinder
 * @constructor
 * @param id of cylinder
 * @param bottomR radius of bottom
 * @param topR radius of top
 * @param h height of the cylinder
 * @param sections number of sections
 * @param parts number of parts
 */
function LeafCylinder(id, bottomR, topR, h, sections, parts) {
    Leaf.call(this, id, "cylinder");
    this.height = h;
    this.bottomRadius = bottomR;
    this.topRadius = topR;
    this.sections = sections;
    this.parts = parts;
}

LeafCylinder.prototype = Object.create(Leaf.prototype);
LeafCylinder.prototype.constructor = LeafCylinder;