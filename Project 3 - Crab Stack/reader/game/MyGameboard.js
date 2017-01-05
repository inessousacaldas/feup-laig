/**
 * MyGameboard constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this gameboard belongs.
 */
function MyGameboard(scene, player1, player2){
    CGFobject.call(this, scene);
    this.scene = scene;
    this.board = null;
    this.time = 0;
    this.pieces = 18;
    /* TESTE*/
    this.text = new Marker(scene);
    this.text.setText("Undo");

    this.currentPlayer = player1;
    this.otherPlayer = player2;

    this.tiles = [];
    this.currentTile = 0;

    this.gameHistory = null;
    this.currPlayer;

    this.freeTurn = true;
	this.wave = false;

    for (var i=0;i<=17;i++)
        this.tiles[i] = new MyTile(this.scene,i+1,this,null);

    this.tileSelected = null;
    this.toTileSelected = null;
    //this.sendRequest('quit');
    this.sendRequest('init_board');

    this.tree = new MyTree(this.scene);

    this.graph = new Graph();

}

MyGameboard.prototype = Object.create(CGFobject.prototype);
MyGameboard.prototype.constructor = MyGameboard;


MyGameboard.prototype.sendRequest = function(requestString){
    var self = this;


    if(requestString == 'init_board'){

        this.scene.prologConnection.getPrologRequest(requestString, function(data){

            //self.initBoard(data.target.response);
            self.board = data.target.response;
            self.gameHistory = new GameHistory(self.board);
            var data = data.target.response;
            data = data.replace(/\[|\]/g,'');
            var array = data.split(",").map(String);
            self.startBoard(array);

        });


    }
    else if(requestString.startsWith("dist_crab")){
        this.scene.prologConnection.getPrologRequest(requestString, function(data){

            var data = data.target.response;
            data = data.replace(/\[|\]/g,'');
            var array = data.split(',').map(Number)
            self.highlightMoves(array);

        });
    }
     else if(requestString.startsWith("valid_crab_movement")){
        this.scene.prologConnection.getPrologRequest(requestString, function(data){
            var data = data.target.response;
            self.movePiece(data);

        });
    }
    else if(requestString.startsWith("move_computer")){
        this.scene.prologConnection.getPrologRequest(requestString, function(data){

            var data = data.target.response;

            self.movePieceByComputer(data);

        });
    }
    else{
        this.scene.prologConnection.getPrologRequest(requestString)
         console.log('Unknown request string');
    }

}

MyGameboard.prototype.processPick = function(picked_obj) {

    if(!this.freeTurn)
        return;
    if (picked_obj instanceof Marker){
        console.log('aaaaaa ' + picked_obj);
        this.freeTurn = false;
        this.undoMove();

    }
    else if (picked_obj instanceof MyTile){
        this.processPickedTile(picked_obj);
    } else {
        this.processPickedTile(picked_obj.tile);
    }

}

MyGameboard.prototype.processPickedTile = function(picked_tile) {
    var piece = picked_tile.topPiece();

    if(piece.player != this.currentPlayer && this.tileSelected == null)
            return;
    picked_tile.processPick();

    if (this.tileSelected == null && picked_tile.selected && piece != null){

        var requestMoves = "dist_crab(" + this.board + "," + piece.crabType + "," + picked_tile.id + ")";
        this.sendRequest(requestMoves);
        this.tileSelected = picked_tile.id;
        console.log("Selecionei o tile " + this.tileSelected);
    } else if (this.tileSelected == picked_tile.id && !picked_tile.selected){
        console.log("Desselecionei o tile " + this.tileSelected);
        this.dehighlightMoves();
        this.tileSelected = null;
    } else if (this.tileSelected != null) {
        this.toTileSelected = picked_tile;
        for(var i = 0; i < this.tiles.length; i++)
            if(this.tiles[i].id == this.tileSelected)
                var crab = this.tiles[i].topPiece().toString();
        this.freeTurn = false;
        var string = 'valid_crab_movement(' + this.board + ',' + this.tileSelected + ',' + picked_tile.id + ',' + crab + ',' + crab[0] + ')';
        this.sendRequest(string);

    } else
        console.log("Unknown request string.")
}


MyGameboard.prototype.dehighlightMoves = function() {

    var moves;

    for(var i = 0; i < this.tiles.length; i++)
       if(this.tiles[i].id == this.tileSelected){
            moves = this.tiles[i].moves;
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

MyGameboard.prototype.movePiece = function(){

    var move = this.gameHistory.undo();

    if(move == null)
        return;

}


MyGameboard.prototype.movePiece = function(data) {

    if(data != 'Bad Request'){
        this.gameHistory.addMove();
        var tileFrom = this.tiles[this.tileSelected-1];

        if (tileFrom.pieces.length > 0){
			this.checkWave(data);
            this.board = data;
            var piece = tileFrom.removePiece();
            piece.move(this.toTileSelected, this.graph);
            this.toTileSelected.addPiece(piece);
            this.gameHistory.addMove(this.board, tileFrom, this.toTileSelected);
            console.log("O tile " +  this.toTileSelected.id + " ficou com " +  this.toTileSelected.pieces.length + " peças");
            console.log("O tile " + tileFrom.id + " ficou com " + tileFrom.pieces.length + " peças");
        }
        var player = this.currentPlayer;
        this.currentPlayer = this.otherPlayer;
        this.otherPlayer = player;
        //this.scene.updateCamera();
        this.sendRequest('game_over(' + this.board + ')');


    }else{
        this.freeTurn = true;
    }

    this.dehighlightMoves();
}

/**
 * movePieceByComputer
 * @param data{string} response from server
 */
MyGameboard.prototype.movePieceByComputer = function(data) {

    console.log(data);
    if(data != 'Bad Request'){
        var array = data.match(/(\d+)|(\[\[\[.*(\d|\[)\]\]\])/g);
        console.log(array);
        this.tileSelected = array[0];
        this.toTileSelected = this.tiles[array[1] - 1];
        this.movePiece(array[2]);
    }

}


MyGameboard.prototype.checkWave = function(data) {

    var _board = this.board.replace(/\[|\]/g,'');
    var array = _board.split(',').map(String);
    var curr_pieces = array.filter(function(n){ return n != "" });
	
	_board = data.replace(/\[|\]/g,'');
    array = _board.split(',').map(String);
    var n_crabs = array.filter(function(n){ return n != "" });

   if(n_crabs.length != curr_pieces.length)
	   this.wave = true;
	
   
}

MyGameboard.prototype.createWave = function(){

    var array = this.board.match(/[\[]([bms]\d+([\,][bms]\d+)*)*[\]]/g);
    for(var i = 0; i < array.length; i++){

        if(array[i] == '[]' && !this.tiles[i].empty())
            this.tiles[i].washCrabs();

    }
	console.log("Wave criada");

}

MyGameboard.prototype.startBoard = function(data) {

	var posX = -16;
	var posZ = -14;

    var z_dist = 8;
    var x_dist = 0;
    var x_inc = z_dist;
    //1st row - 3 hexagons
    for (var i=0;i<3;i++){
        this.tiles[this.currentTile++].setPosition(x_dist+posX,i*z_dist+6+posZ);
    }

    x_dist += x_inc;

    //2nd row - 4 hexagons
    for (var i=0;i<4;i++){
        this.tiles[this.currentTile++].setPosition(x_dist+posX,i*z_dist+1.75+posZ);
    }

    x_dist += x_inc;

    //3rd row - 5 hexagons, but skips middle one
    for (var i=0;i<5;i++){
        if (i==2)
            continue;
        this.tiles[this.currentTile++].setPosition(x_dist+posX,i*z_dist-2.5+posZ);
    }

    x_dist += x_inc;

    //4th row - 4 hexagons
    for (var i=0;i<4;i++){
        this.tiles[this.currentTile++].setPosition(x_dist+posX,i*z_dist+1.75+posZ);
    }

    x_dist += x_inc;

    //5th row - 3 hexagons
    for (var i=0;i<3;i++){
        this.tiles[this.currentTile++].setPosition(x_dist+posX,i*z_dist+6+posZ);
    }

    this.currentTile = 0;

   for(var i = 0; i < data.length; i++){

        var size = data[i][0];
        var player_id = data[i][1];
        if(player_id == this.currentPlayer.id)
            var player = this.currentPlayer;
        else
            var player = this.otherPlayer;

        this.tiles[i].addPiece(new MyPiece(this.scene,i,this.tiles[i],size, player));
    }

}


MyGameboard.prototype.unselectAllTiles = function() {
    for (var i=0;i<this.tiles.length;i++){
        this.tiles[i].unselect();
    }
    this.tileSelected = null;
    this.toTileSelected = null;
}

/**
 * Display function of the scene to render this object.
 */
MyGameboard.prototype.display = function() {

    var idPick = 1;

     this.scene.pushMatrix();

       // this.tree.display();

        this.scene.popMatrix();
     this.scene.pushMatrix();

    this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 1, 0, 0);

        for (var i=0;i<=17;i++){
            this.scene.pushMatrix();
				if (this.tiles[i].pickable)
					this.scene.registerForPick(idPick++, this.tiles[i]);
                this.scene.translate(this.tiles[i].posX,0,this.tiles[i].posZ);
                this.tiles[i].display();
            this.scene.popMatrix();
        }

    this.scene.popMatrix();

    for (var i=0;i<=17;i++){
        for (var j=0;j<this.tiles[i].pieces.length;j++){
			if (this.tiles[i].pickable)
				this.scene.registerForPick(idPick++, this.tiles[i].pieces[j]);
            this.tiles[i].pieces[j].display();
        }
    }

    /* TESTE*/
    this.scene.registerForPick(idPick++, this.text);
    this.scene.pushMatrix();
        this.scene.translate(-4.5, 8, 0);
        //this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.scale(2, 2, 2);
        this.text.display();

        this.scene.popMatrix();
    this.scene.pushMatrix();

}

MyGameboard.prototype.update = function(currTime) {

    this.time = currTime;
    for (var i = 0; i < this.tiles.length; i++)
        this.tiles[i].update(currTime);

    if(this.board != null && this.freeTurn && this.currentPlayer.isComputer()){
         this.freeTurn = false;
         var a = 'move_computer(' + this.board + ',r,1)';
         var string = 'move_computer(' + this.board + ',' + this.currentPlayer.logic_color + ',' + this.currentPlayer.lvl + ')';
         console.log(a);
         console.log(string);

         this.sendRequest(string);
    }

    if(!this.freeTurn && this.toTileSelected != null){

        var topPiece = this.toTileSelected.topPiece();
        if(topPiece != null && topPiece.crab.finishedMoving){
            if(this.wave){
				this.wave = false;
				this.createWave();
			}
            this.unselectAllTiles();
            this.freeTurn = true;
        }

    }


}

/**
 * texCoords scaling (no effect)
 */
MyGameboard.prototype.scaleTexCoords = function() {}