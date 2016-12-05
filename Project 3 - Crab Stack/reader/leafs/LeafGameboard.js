/**
 * LeafGameboard constructor
 * @constructor
 * @param {String} identification of gameboard
 */
function LeafGameboard(id) {
    Leaf.call(this, id, "gameboard");
}

LeafGameboard.prototype = Object.create(Leaf.prototype);
LeafGameboard.prototype.constructor = LeafGameboard;

