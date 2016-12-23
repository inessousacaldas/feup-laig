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

    this.tileSelected = null;

    this.startBoard();

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.sendRequest = function(requestString){
    var self = this;

    this.scene.prologConnection.getPrologRequest(requestString, function(data){

        //self.initBoard(data.target.response);
        console.log('AAAA' + data);
    });

}



MyGameboard.prototype.processPick = function(picked_obj) {

    if (this.tileSelected == null){
        picked_obj.processPick();
        if (picked_obj.selected){
            this.tileSelected = picked_obj.id;
            console.log("Selecionei o tile " + this.tileSelected);
        } else {
            console.log("Desselecionei o tile " + this.tileSelected);
            this.tileSelected = null;
        }
    } else {
        this.movePiece(this.tiles[this.tileSelected-1], picked_obj);
        this.unselectAllTiles();
    }

}

MyGameboard.prototype.movePiece = function(tileFrom, tileTo) {
    if (tileFrom.pieces.length > 0){
        tileTo.addPiece(tileFrom.removePiece());
        console.log("O tile " + tileTo.id + " ficou com " + tileTo.pieces.length + " peças");
        console.log("O tile " + tileFrom.id + " ficou com " + tileFrom.pieces.length + " peças");
    }

}

MyGameboard.prototype.startBoard = function() {
    this.tiles[0].addPiece(new MyPiece(this.scene,0,0,"S",1));
    this.tiles[1].addPiece(new MyPiece(this.scene,1,1,"S",2));
    this.tiles[2].addPiece(new MyPiece(this.scene,2,2,"S",2));
    this.tiles[3].addPiece(new MyPiece(this.scene,3,3,"S",2));
    this.tiles[4].addPiece(new MyPiece(this.scene,4,4,"M",2));
    this.tiles[5].addPiece(new MyPiece(this.scene,5,5,"M",1));
    this.tiles[6].addPiece(new MyPiece(this.scene,6,6,"B",1));
    this.tiles[7].addPiece(new MyPiece(this.scene,7,7,"S",1));
    this.tiles[8].addPiece(new MyPiece(this.scene,8,8,"M",1));
    this.tiles[9].addPiece(new MyPiece(this.scene,9,9,"B",2));
    this.tiles[10].addPiece(new MyPiece(this.scene,10,10,"B",1));
    this.tiles[11].addPiece(new MyPiece(this.scene,11,11,"M",1));
    this.tiles[12].addPiece(new MyPiece(this.scene,12,12,"S",1));
    this.tiles[13].addPiece(new MyPiece(this.scene,13,13,"B",2));
    this.tiles[14].addPiece(new MyPiece(this.scene,14,14,"M",2));
    this.tiles[15].addPiece(new MyPiece(this.scene,15,15,"B",2));
    this.tiles[16].addPiece(new MyPiece(this.scene,16,16,"M",2));
    this.tiles[17].addPiece(new MyPiece(this.scene,17,17,"B",1));

}

MyGameboard.prototype.unselectAllTiles = function() {
    for (var i=0;i<this.tiles.length;i++){
        this.tiles[i].unselect();
    }
    this.tileSelected = null;
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