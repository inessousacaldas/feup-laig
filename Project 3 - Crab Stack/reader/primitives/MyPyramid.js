/**
 * MyPyramid
 * @constructor
 * @param scene CGFscene
 * @param x1 x-coord of vertice v1
 * @param y1 y-coord of vertice v1
 * @param z1 z-coord of vertice v1
 * @param x2 x-coord of vertice v2
 * @param y2 y-coord of vertice v2
 * @param z2 z-coord of vertice v2
 * @param x3 x-coord of vertice v3
 * @param y3 y-coord of vertice v3
 * @param z3 xzcoord of vertice v3
 */


function MyPyramid(scene, dimBase, height) {
    CGFobject.call(this, scene);

    this.dimBase = dimBase;
    this.height = height;

    this.h = Math.sqrt(3)*this.dimBase / 2;
    this.base = new MyTriangle(this.scene, -this.dimBase/2, -this.h/2, 0, this.dimBase/2, -this.h/2, 0, 0, this.h/2, 0);
    this.pyramidSide = new MyTriangle(this.scene, -this.dimBase/2, 0, 0, this.dimBase/2, 0, 0, 0, this.height, 0);
};

MyPyramid.prototype = Object.create(CGFobject.prototype);
MyPyramid.prototype.constructor = MyPyramid;

MyPyramid.prototype.display = function() {

    var _height = Math.sqrt(Math.pow(this.height,2) + Math.pow(0.5*this.dimBase,2));
    var angle = Math.acos(0.5*this.h/this.height);

    this.scene.pushMatrix();
        this.scene.rotate(180*deg2rad, 0, 1, 0);
        this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
            this.scene.translate(0,-this.h/2,0);
            this.scene.rotate(angle, 1,0,0);
            this.pyramidSide.display();
        this.scene.popMatrix();

    this.scene.pushMatrix();
       this.scene.translate(this.dimBase/4,0,0);
        this.scene.rotate(120*deg2rad, 0,0,1);
        this.scene.rotate(angle, 1,0,0);
        this.pyramidSide.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
        this.scene.translate(-this.dimBase/4,0,0);
        this.scene.rotate(-120*deg2rad, 0,0,1);
        this.scene.rotate(angle, 1,0,0);
        this.pyramidSide.display();
    this.scene.popMatrix();

}

