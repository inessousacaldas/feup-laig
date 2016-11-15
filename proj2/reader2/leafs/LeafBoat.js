/**
 * LeafBoat
 * @constructor
 * @param id identification of vehicle
 */
function LeafBoat(id) {
    Leaf.call(this, id, "boat");

}

LeafBoat.prototype = Object.create(Leaf.prototype);
LeafBoat.prototype.constructor = LeafBoat;
