/**
 * Texture
 * @constructor
 * @param {CFGscene} scene
 * @param {String} path file path of texture
 * @param {String} id identification of the texture
 */
function Texture(scene, path, id) {
    CGFtexture.call(this, scene, path);
    this.id = id;
    this.amplifyFactor = {s: 1,
                          t: 1};
};

Texture.prototype = Object.create(CGFtexture.prototype);
Texture.prototype.constructor = Texture;

/**
 * Texture amplify factors
 * @param {Float} s amplify factor for direction s of texture
 * @param {Float} t amplify factor for direction t of texture
 */
Texture.prototype.setAmplifyFactor = function(s, t) {
    this.amplifyFactor.s = s;
    this.amplifyFactor.t = t;
}