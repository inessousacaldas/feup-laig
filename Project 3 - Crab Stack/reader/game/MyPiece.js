/**
 * MyPiece constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyPiece(scene, id, tile, crab, player){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.tile = tile;
    this.crabType = crab;
    this.player = player;
    this.time = 0;

    this.posX = this.tile.posX;
    this.posZ = this.tile.posZ;

    this.newPosX = 0;
    this.newPosZ = 0;

    this.height = 0;

    this.posY = 0;


    this.localTransformations = mat4.create();
    mat4.identity(this.localTransformations);

    this.teste = mat4.create();
    mat4.identity(this.teste);
    
    this.chooseCrab()

    this.materialRed = new Material(this.scene,1);
    this.materialRed.setEmission(1,0,0,1);
    this.materialRed.setAmbient(1,0,0,1);
    this.materialRed.setDiffuse(1,0,0,1);
    this.materialRed.setSpecular(1,0,0,1);
    this.materialRed.setShininess(0.2);

    this.materialBlue = new Material(this.scene,2);
    this.materialBlue.setEmission(0,0,1,1);
    this.materialBlue.setAmbient(0,0,1,1);
    this.materialBlue.setDiffuse(0,0,1,1);
    this.materialBlue.setSpecular(0,0,1,1);
    this.materialBlue.setShininess(0.2);
}

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;


MyPiece.prototype.setTile = function(tile) {

    this.tile = tile;
}

MyPiece.prototype.toString = function() {

   return this.crabType + this.player + "";
}

MyPiece.prototype.chooseCrab = function() {

    switch (this.crabType){
        case "B":
        case "b":
            this.crab = new MyCrabBig(this.scene, this.player);
            break;
        case "M":
        case "m":
            this.crab = new MyCrabMedium(this.scene, this.player);
            break;
        case "S":
        case "s":
            this.crab = new MyCrabSmall(this.scene, this.player);
            break;
    }

    this.height = this.crab.height;
    //this.tile.addHeight(this.height);
    //console.log(this.tile.height);
}

/**
 * Display function of the scene to render this object.
 */
MyPiece.prototype.display = function() {

    this.scene.pushMatrix();

        this.scene.rotate(90*deg2rad,1,0,0);
        this.scene.rotate(180*deg2rad,0,0,1);
        this.scene.rotate(180*deg2rad,0,1,0);
        this.scene.translate(0.5,0.8,0);
        this.scene.translate(this.posX, this.posZ, this.posY);

        if(this.crab.isMoving()){
            //mat4.multiply(this.localTransformations, this.crab.update(this.time), this.localTransformations);
            this.teste = this.crab.update(this.time);
            this.scene.multMatrix(this.teste);
            //this.scene.multMatrix(this.localTransformations);
            this.crab.display();
            this.scene.setDefaultAppearance();
        } else if (this.crab.isFinishedMoving()){

            this.crab.setFinishedMoving(false);

            this.scene.multMatrix(this.teste);
            //this.scene.multMatrix(this.localTransformations);
            this.crab.display();
            this.posX = this.newPosX;
            this.posZ = this.newPosZ;
            this.calculateNewPosY();
            this.scene.setDefaultAppearance();

        }else{
            mat4.identity(this.teste);
            this.scene.multMatrix(this.teste);
            //this.scene.multMatrix(this.localTransformations);
            this.crab.display();
            this.scene.setDefaultAppearance();
        }


    this.scene.popMatrix();
}

MyPiece.prototype.update = function(currTime) {

    this.time = currTime;

}

MyPiece.prototype.calculateNewPosY = function() {

    var currHeight = 0;
    for (var i=0;i<this.tile.pieces.length;i++){
        if (this.tile.pieces[i].id == this.id)
            break;
        currHeight += this.tile.pieces[i].height;
    }

    this.posY = currHeight;

}


MyPiece.prototype.move = function(tile, graph) {

    var origin = this.tile.id;
    if (this.tile.id < 10)
        origin = this.tile.id - 1;
    graph.BFSearch(origin);
    var id = tile.id;
    if (tile.id < 10)
        id = tile.id - 1;
    var path = [];
    console.log("Origem: " + origin);
    console.log("ID: " + id);
    while (id != origin){
        path.push([graph.vertexSet[id].parent, id]);
        id = graph.vertexSet[id].parent;
        console.log("ID: " + id);
    }
    console.log("Destino: " + tile.id);

    //COMENTAR ESTE BLOCO PARA PEÇA NAO IR PARA O DESTINO
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    this.newPosX = tile.posX;
    this.newPosZ = tile.posZ;
    //+++++++++++++++++++++++++++++++++++++++++++++++++++
    console.log(this.tile.getCurrentHeight());
    var _currentHeight = this.tile.currentHeight;
    this.tile = tile;
    //this.tile.addHeight(this.height);
    //path.reverse();
    this.crab.makeMove(this.time, path, _currentHeight, this.tile.currentHeight);
}



/**
 * texCoords scaling (no effect)
 */
MyPiece.prototype.scaleTexCoords = function(){}
