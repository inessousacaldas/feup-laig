/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function Gameboard(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.board = new MyHexagon(this.scene);

}

Gameboard.prototype = Object.create(Object.prototype);
Gameboard.prototype.constructor = Gameboard;

