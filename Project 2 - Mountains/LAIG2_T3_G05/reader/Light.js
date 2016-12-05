/**
 * Light
 * @constructor
 * @param scene CGFscene,
 * @param id id - number of position
 * @param name name of the light
 */

function Light(scene, id, name) {
    CGFlight.call(this, scene, id);
    this.name = name;
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;