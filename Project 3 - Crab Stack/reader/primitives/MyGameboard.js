/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function MyGameboard(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.board = new MyHexagon(this.scene);
    this.tile = new MyTile(this.scene,1,this,null);

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;

/**
 * Display function of the scene to render this object.
 */
MyGameboard.prototype.display = function() {

    //top hexagon
    this.scene.pushMatrix();
        this.board.display();
        this.tile.display();
    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyGameboard.prototype.scaleTexCoords = function() {}