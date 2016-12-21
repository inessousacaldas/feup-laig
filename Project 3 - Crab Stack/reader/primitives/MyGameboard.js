/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function MyGameboard(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.tiles = [];
    this.currentTile = 0;

    for (var i=0;i<=17;i++)
        this.tiles[i] = new MyTile(this.scene,i+1,this,null);

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.processPick = function(picked_obj) {
    console.log("APANHEI O TILE " + picked_obj.id);
    for (var i=0;i<=17;i++){
        if (this.tiles[i].id == picked_obj.id)
            this.tiles[i].processPick();
    }
    //picked_obj.processPick();
}

/**
 * Display function of the scene to render this object.
 */
MyGameboard.prototype.display = function() {


    this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 1, 0, 0);

        //1st row - 3 hexagons
        for (var i=0;i<3;i++){
            this.scene.pushMatrix();
                this.scene.translate(0,0,i*1.75);
                this.scene.registerForPick(this.currentTile+1, this.tiles[this.currentTile]);
                this.tiles[this.currentTile++].display();
            this.scene.popMatrix();
        }
        //2nd row - 4 hexagons
        for (var i=0;i<4;i++){
            this.scene.pushMatrix();
            this.scene.translate(1.5,0,i*1.75-0.75);
            this.scene.registerForPick(this.currentTile+1, this.tiles[this.currentTile]);
            this.tiles[this.currentTile++].display();
            this.scene.popMatrix();
        }

        for (var i=0;i<5;i++){
            if (i==2)
                continue;
            this.scene.pushMatrix();
            this.scene.translate(3,0,i*1.75-1.5);
            this.scene.registerForPick(this.currentTile+1, this.tiles[this.currentTile]);
            this.tiles[this.currentTile++].display();
            this.scene.popMatrix();
        }

        for (var i=0;i<4;i++){
            this.scene.pushMatrix();
            this.scene.translate(4.5,0,i*1.75-0.75);
            this.scene.registerForPick(this.currentTile+1, this.tiles[this.currentTile]);
            this.tiles[this.currentTile++].display();
            this.scene.popMatrix();
        }

        for (var i=0;i<3;i++){
            this.scene.pushMatrix();
            this.scene.translate(6,0,i*1.75);
            this.scene.registerForPick(this.currentTile+1, this.tiles[this.currentTile]);
            this.tiles[this.currentTile++].display();
            this.scene.popMatrix();
        }

    this.scene.popMatrix();

    this.currentTile=0
}

/**
 * texCoords scaling (no effect)
 */
MyGameboard.prototype.scaleTexCoords = function() {}