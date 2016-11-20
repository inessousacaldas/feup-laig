/**
 * LeafVehicle constructor.
 * @constructor
 * @param {String} identification of vehicle
 */
function LeafVehicle(id) {
    Leaf.call(this, id, "vehicle");

}

LeafVehicle.prototype = Object.create(Leaf.prototype);
LeafVehicle.prototype.constructor = LeafVehicle;
