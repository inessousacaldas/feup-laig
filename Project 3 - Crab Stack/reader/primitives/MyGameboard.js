/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function MyGameboard(scene){
    CGFobject.call(this, scene);
    this.scene = scene;
    this.time = 0;

    this.tiles = [];
    this.currentTile = 0;

    for (var i=0;i<=17;i++)
        this.tiles[i] = new MyTile(this.scene,i+1,this,null);

    this.tileSelected = null;

    this.sendRequest('init_board');

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;

MyGameboard.prototype.sendRequest = function(requestString){
    var self = this;


    if(requestString == 'init_board'){

        this.scene.prologConnection.getPrologRequest(requestString, function(data){

            //self.initBoard(data.target.response);
            var data = data.target.response;
            data = data.replace(/\[|\]/g,'');
            var array = data.split(",").map(String);
            self.startBoard(array);

        });


    }
    else if(/dist\(\'\w\',\d+\)/g.test(requestString)){
        this.scene.prologConnection.getPrologRequest(requestString, function(data){

            var data = data.target.response;
            data = data.replace(/\[|\]/g,'');
            var array = data.split(',').map(Number)
            self.highlightMoves(array);

        });
    }
    else
        console.log('Unknown request string');


}


MyGameboard.prototype.processPick = function(picked_obj) {

    var piece = picked_obj.topPieceType();
    picked_obj.processPick();
    if (this.tileSelected == null && picked_obj.selected){

        var requestMoves = "dist('"+ piece.crabType + "'," + picked_obj.id + ")";
        this.sendRequest(requestMoves);
        this.tileSelected = picked_obj.id;
        console.log("Selecionei o tile " + this.tileSelected);
    }else if(this.tileSelected == picked_obj.id && !picked_obj.selected){
            console.log("Desselecionei o tile " + this.tileSelected);
            this.dehighlightMoves();
            this.tileSelected = null;
    } else if(this.tileSelected != null) {
        this.movePiece(this.tiles[this.tileSelected-1], picked_obj);
        this.dehighlightMoves();
        this.unselectAllTiles();

    }

}

MyGameboard.prototype.dehighlightMoves = function() {

    for(var i = 0; i < this.tiles.length; i++)
       if(this.tiles[i].id == this.tileSelected){
            var moves = this.tiles[i].moves;
            this.tiles[i].removeMoves();
       }
    for(var i = 0; i < moves.length; i++)
        for(var j = 0; j < this.tiles.length; j++)
            if(moves[i] == this.tiles[j].id)
                this.tiles[j].dehighlight();

}


MyGameboard.prototype.highlightMoves = function(moves) {

    for(var i = 0; i < moves.length; i++)
        for(var j = 0; j < this.tiles.length; j++)
            if(moves[i] == this.tiles[j].id)
                this.tiles[j].highlight();
            else if(this.tiles[j].id == this.tileSelected)
                this.tiles[j].addMoves(moves);
}


MyGameboard.prototype.movePiece = function(tileFrom, tileTo) {
    if (tileFrom.pieces.length > 0){
        var piece = tileFrom.removePiece();
        piece.move();
        tileTo.addPiece(piece);
        console.log("O tile " + tileTo.id + " ficou com " + tileTo.pieces.length + " peças");
        console.log("O tile " + tileFrom.id + " ficou com " + tileFrom.pieces.length + " peças");
    }

}

MyGameboard.prototype.startBoard = function(data) {


   for(var i = 0; i < data.length; i++){

        var size = data[i][0];
        var player = data[i][1];
        this.tiles[i].addPiece(new MyPiece(this.scene,i,i,size,player));
    }


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

MyGameboard.prototype.update = function(currTime) {

    this.time = currTime;
    for (var i = 0; i < this.tiles.length; i++)
        this.tiles[i].update(currTime);
}

/**
 * texCoords scaling (no effect)
 */
MyGameboard.prototype.scaleTexCoords = function() {}