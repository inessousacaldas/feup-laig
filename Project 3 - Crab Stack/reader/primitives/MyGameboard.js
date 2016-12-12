/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function MyGameboard(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.tile = new MyTile(this.scene,1,this,null);

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;

/**
 * Display function of the scene to render this object.
 */
MyGameboard.prototype.display = function() {


    this.scene.pushMatrix();
        //1st row - 3 hexagons
        for (var i=0;i<3;i++){
            this.scene.pushMatrix();
                this.scene.translate(0,0,i*1.75)
                this.tile.display();
            this.scene.popMatrix();
        }
        //2nd row - 4 hexagons
        for (var i=0;i<4;i++){
            this.scene.pushMatrix();
            this.scene.translate(1.5,0,i*1.75-0.75)
            this.tile.display();
            this.scene.popMatrix();
        }

        for (var i=0;i<5;i++){
            if (i==2)
                continue;
            this.scene.pushMatrix();
            this.scene.translate(3,0,i*1.75-1.5)
            this.tile.display();
            this.scene.popMatrix();
        }

        for (var i=0;i<4;i++){
            this.scene.pushMatrix();
            this.scene.translate(4.5,0,i*1.75-0.75)
            this.tile.display();
            this.scene.popMatrix();
        }

        for (var i=0;i<3;i++){
            this.scene.pushMatrix();
            this.scene.translate(6,0,i*1.75)
            this.tile.display();
            this.scene.popMatrix();
        }

    this.scene.popMatrix();
}



/**
 * texCoords scaling (no effect)
 */
MyGameboard.prototype.scaleTexCoords = function() {}