/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyTree(scene){
    CGFobject.call(this,scene);
    this.pyramid = new MyPyramid(this.scene, 1, 1);
    this.coconut = new MySphere(this.scene, .6, 16, 16);
    this.textureTrunk = new Texture(this.scene, 'scenes/textures/tree/trunk.jpg', 'treeTrunk');
    this.textureLeaves = new Texture(this.scene, 'scenes/textures/tree/leaves.jpg', 'treeTrunk');
    this.textureCoconut = new Texture(this.scene, 'scenes/textures/tree/coconut.jpg', 'treeTrunk');

}

MyTree.prototype = Object.create(CGFobject.prototype);
MyTree.prototype.constructor = MyTree;

/**
 * Display function of the scene to render this object.
 */
MyTree.prototype.display = function() {
    this.scene.translate(0,3,5);

    this.textureTrunk.bind();

    var angle = 90;
    var zTrans = 1;
    var yTrans = 1;

    for(var i = 0; i < 7; i++){

        this.scene.pushMatrix();
            this.scene.translate(0,yTrans,zTrans);
            this.scene.rotate(-angle*deg2rad,1,0,0);
            this.scene.scale(2,2,2);
            this.pyramid.display();
        this.scene.popMatrix();

        angle -= 5;
        yTrans += 1;

        zTrans *= 1.2;
    }

    this.textureTrunk.unbind();

    this.textureLeaves.bind();

    this.scene.pushMatrix();
        this.scene.translate(0,7,0);
        this.scene.rotate(-90*deg2rad,1,0,0);
        this.scene.scale(1,0.3,1);
        this.scene.scale(2,3,2);
        this.pyramid.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,7,0);
        this.scene.rotate(180*deg2rad,0,1,0);
        this.scene.rotate(90*deg2rad,1,0,0);

        this.scene.scale(1,0.3,1);
        this.scene.scale(2,3,2);
        this.pyramid.display();
    this.scene.popMatrix();

    this.textureLeaves.unbind();

    this.textureCoconut.bind();

    this.scene.pushMatrix();
        this.scene.translate(0,8,4.5);
        this.coconut.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,8.2,3.5);
        this.scene.scale(0.8,0.8,0.8);
        this.coconut.display();
        this.scene.popMatrix();

    this.textureCoconut.unbind();



}



/**
 * texCoords scaling (no effect)
 */
MyTree.prototype.scaleTexCoords = function(){}
