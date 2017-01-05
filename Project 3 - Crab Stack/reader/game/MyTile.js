/**
 * MyTile constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {MyPiece} piece The piece that is on top of this tile.
 */
function MyTile(scene, id, board, piece){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.id = id;
    this.board = board;
    this.pieces = [];

    this.hexagon = new MyHexagon(this.scene);
	this.rock = new MyRock(this.scene);

    this.selected = false;
    this.highlighted = false;
    this.moves = [];

    this.material = new Material(this.scene,1);
    this.material.setEmission(0,1,0,1);
    this.material.setAmbient(0,1,0,1);
    this.material.setDiffuse(0,1,0,1);
    this.material.setSpecular(0,1,0,1);
    this.material.setShininess(0.2);

    this.highlightedMaterial = new Material(this.scene,1);
    this.highlightedMaterial.setEmission(1,1,0,1);
    this.highlightedMaterial.setAmbient(1,1,0,1);
    this.highlightedMaterial.setDiffuse(1,1,0,1);
    this.highlightedMaterial.setSpecular(1,1,0,1);
    this.highlightedMaterial.setShininess(0.2);

    this.posX = 0;
    this.posZ = 0;

    this.currentHeight = 0;
	
	this.pickable = true;
	
	this.waveHeight = 0;

}

MyTile.prototype = Object.create(CGFobject.prototype);
MyTile.prototype.constructor = MyTile;

MyTile.prototype.getCurrentHeight = function() {
    console.log(this.currentHeight);
    return this.currentHeight;
}

MyTile.prototype.topPiece = function() {

    return this.pieces[this.pieces.length - 1];
}

MyTile.prototype.addPiece = function(piece) {

    this.pieces.push(piece);
    this.currentHeight += piece.height;
}

MyTile.prototype.removePiece = function() {
    this.currentHeight -= this.topPiece().height;
    return this.pieces.pop();
}

MyTile.prototype.select = function() {
    this.selected = true;
}

MyTile.prototype.unselect = function() {
    this.selected = false;
}

MyTile.prototype.highlight = function() {
    this.highlighted = true;
}

MyTile.prototype.dehighlight = function() {
    this.highlighted = false;
}

MyTile.prototype.addMoves = function(moves) {
    this.moves = moves;
}

MyTile.prototype.removeMoves = function() {
    this.moves = [];
}


MyTile.prototype.setPosition = function(x, z) {
    this.posX = x;
    this.posZ = z;
}

MyTile.prototype.processPick = function() {
    if (this.selected)
        this.unselect();
    else
        this.select();
}

MyTile.prototype.empty = function() {
   if(this.pieces.length == 0)
        return true;
    return false;
}

MyTile.prototype.washCrabs = function() {
   //while(!this.empty())
        //this.pieces.pop();
	this.pickable = false;
	for (var i=0;i<this.pieces.length;i++){
		this.pieces[i].washCrabs();
	}
}



/**
 * Display function of the scene to render this object.
 */
MyTile.prototype.display = function() {

    this.scene.pushMatrix();
        for (var i=0;i<this.pieces.length;i++){
            this.scene.pushMatrix();
      //      this.scene.translate(0,-this.currentHeight,0);
            this.scene.popMatrix();
        }
        if (this.selected)
            this.material.apply();
        else if(this.highlighted)
            this.highlightedMaterial.apply();
		this.scene.pushMatrix();
			if (!this.pickable && this.waveHeight > -7)
				this.waveHeight = this.waveHeight - 0.2;
			this.scene.translate(0,-this.waveHeight,0);
			this.rock.display();
		this.scene.popMatrix();
        this.scene.setDefaultAppearance();

    this.scene.popMatrix();
	
	
		
}

MyTile.prototype.update = function(currTime) {

    this.time = currTime;
    for (var i = 0; i < this.pieces.length; i++)
        this.pieces[i].update(currTime);
	
}




/**
 * texCoords scaling (no effect)
 */
MyTile.prototype.scaleTexCoords = function(){}