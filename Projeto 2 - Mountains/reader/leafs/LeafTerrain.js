/**
 * LeafTerrain constructor
 * @constructor 
 * @param {String} id identification of terrain
 * @param {String} texture Url of the texture
 * @param {String} heightmap Url of the heightmap texture
 * @param {Float} height minimum value of scale for the heightmap
 * @param {Float} maxHeight maximum value of scale for the heightmap
 */
function LeafTerrain(id, texture, heightMap, height, maxHeight) {
    Leaf.call(this, id, "terrain");
	this.texture = texture;
	this.heightMap = heightMap;
	this.height = height;
	this.maxHeight = maxHeight;
}

LeafTerrain.prototype = Object.create(Leaf.prototype);
LeafTerrain.prototype.constructor = LeafTerrain;

