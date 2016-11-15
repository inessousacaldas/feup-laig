/**
 * Light
 * @constructor
 * @param {CGFscene} scene
 * @param {Int} an Shader light array index
 * @param {String} id light identification name
 */

function Light(scene, an, id) {
	console.log(an);
    CGFlight.call(this, scene, an);
    this.name = id;
}

Light.prototype = Object.create(CGFlight.prototype);
Light.prototype.constructor = Light;


