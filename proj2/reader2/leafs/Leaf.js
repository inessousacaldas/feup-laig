/**
 * Leaf
 * @constructor
 * @param {String} id identification of leaf
 * @param {String} type the type of leaf
 */
function Leaf(id, type) {
    this.id = id;
    this.type = type;
}

Leaf.prototype = Object.create(Object.prototype);
Leaf.prototype.constructor = Leaf;