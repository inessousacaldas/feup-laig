/**
 * MyTile constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} id Id of the tile.
 * @param {MyGameboard} board The board this tile belongs to.
 * @param {String} ambient Type of ambient of the game
 */
function MyTile(scene, id, board, ambient){
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
	
	this.ambient = ambient;
	
	this.materialBrown = new Material(this.scene,2);
    this.materialBrown.setEmission(0.8,0.91,0,1);
    this.materialBrown.setAmbient(0.8,0.91,0,1);
    this.materialBrown.setDiffuse(0.8,0.91,0.8,1);
    this.materialBrown.setSpecular(0.8,0.91,0,1);
    this.materialBrown.setShininess(0.4);

}

MyTile.prototype = Object.create(CGFobject.prototype);
MyTile.prototype.constructor = MyTile;

/**
 * Gets the current height of the tile
 */
MyTile.prototype.getCurrentHeight = function() {
    console.log(this.currentHeight);
    return this.currentHeight;
}

/**
 * Gets the top piece of the tile
 */
MyTile.prototype.topPiece = function() {
	if (this.pieces.length == 0)
		return null;
    return this.pieces[this.pieces.length - 1];
}

/**
 * Adds a piece to the tile
 * @param {MyPiece} piece The piece to add
 */
MyTile.prototype.addPiece = function(piece) {

    this.pieces.push(piece);
    this.currentHeight += piece.height;
}

/**
 * Removes the top piece of the tile
 */
MyTile.prototype.removePiece = function() {
    this.currentHeight -= this.topPiece().height;
    return this.pieces.pop();
}

/**
 * Selects this tile
 */
MyTile.prototype.select = function() {
    this.selected = true;
}

/**
 * Unselects this tile
 */
MyTile.prototype.unselect = function() {
    this.selected = false;
}

/**
 * Highlights this tile
 */
MyTile.prototype.highlight = function() {
    this.highlighted = true;
}

/**
 * Dehighlights this tile
 */
MyTile.prototype.dehighlight = function() {
    this.highlighted = false;
}

/**
 * Adds moves to this tile
 * @param {String} moves The moves to highlight
 */
MyTile.prototype.addMoves = function(moves) {
    this.moves = moves;
}

/**
 * Removes the moves from this tile
 */
MyTile.prototype.removeMoves = function() {
    this.moves = [];
}

/**
 * Sets the position of this tile
 * @param {Integer} x Position in x
 * @param {Integer} z Position in z
 */
MyTile.prototype.setPosition = function(x, z) {
    this.posX = x;
    this.posZ = z;
}

/**
 * Process this tile when it is picked
 */
MyTile.prototype.processPick = function() {
    if (this.selected)
        this.unselect();
    else
        this.select();
}

/**
 * Checks if this tile has no pieces
 */
MyTile.prototype.empty = function() {
   if(this.pieces.length == 0)
        return true;
    return false;
}

/**
 * Remove this tile and its pieces from play
 */
MyTile.prototype.washCrabs = function() {
   //while(!this.empty())
        //this.pieces.pop();
	this.pickable = false;
	for (var i=0;i<this.pieces.length;i++){
		this.pieces[i].washCrabs();
	}
}

/**
 * Removes all pieces from the tile
 */
MyTile.prototype.cleanTile = function() {
   this.pieces = [];
   this.currentHeight = 0;
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
			if (this.ambient == "sea")
				this.rock.display();
			else {
				//this.materialBrown.apply();
				this.hexagon.display();
			}
				
			
		this.scene.popMatrix();
        this.scene.setDefaultAppearance();

    this.scene.popMatrix();
	
		
}

/**
 * Updates the time of the tile
 * @param {Float} currTime current time
 */
MyTile.prototype.update = function(currTime) {

    this.time = currTime;
    for (var i = 0; i < this.pieces.length; i++)
        this.pieces[i].update(currTime);
	
}




/**
 * texCoords scaling (no effect)
 */
MyTile.prototype.scaleTexCoords = function(){}