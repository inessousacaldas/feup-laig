/**
 * MyChessboard constructor.
 * @constructor 
 * @param {CGFscene} scene The scene that contains the chessboard
 * @param {Integer} du number of pieces in direction u
 * @param {Integer} dv number of pieces in direction v
 * @param {CGFtexture} texture chessboard texture
 * @param {Integer} su u-coord of the selected piece (-1 for none)
 * @param {Integer} sv v-cood of the selected piece (-1 for none)
 * @param {RGBA} c1 first color of chessboard
 * @param {RGBA} c2 second color of chessboard
 * @param {RGBA} c3 selected color of chessboard
 */
function MyChessboard(scene, du, dv, texture, su, sv, c1, c2, cs){
    CGFobject.call(this,scene);

    this.du = du;
    this.dv = dv;
    this.texture = texture;
    this.su = su; //No piece selected (su,sv) = (-1, -1)
    this.sv = sv;
    this.c1 = c1;
    this.c2 = c2;
    this.cs = cs;


    this.shader = new CGFshader(this.scene.gl,"shaders/chess.vert", "shaders/chess.frag");

    this.shader.setUniformsValues({uSampler: 1});
    this.shader.setUniformsValues({du: this.du});
    this.shader.setUniformsValues({dv: this.dv});
    this.shader.setUniformsValues({su: this.su});
    this.shader.setUniformsValues({sv: this.sv});
    this.shader.setUniformsValues({c1: [this.c1[0], this.c1[1], this.c1[2], this.c1[3]]});
    this.shader.setUniformsValues({c2: [this.c2[0], this.c2[1], this.c2[2], this.c2[3]]});
    this.shader.setUniformsValues({cs: [this.cs[0], this.cs[1], this.cs[2], this.cs[3]]});


	var U_PARTS_PER_DIV = 4;
	this.partsU = du*U_PARTS_PER_DIV;

	var V_PARTS_PER_DIV = 4;
	this.partsV = dv*V_PARTS_PER_DIV;
	
    this.chessboard = new MyPlane(this.scene, du, dv, this.partsU , this.partsV);

};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function(){

    this.texture.bind(0);
    this.scene.setActiveShader(this.shader);
    this.chessboard.display();
    this.scene.setActiveShader(this.scene.defaultShader);
    this.texture.unbind(0);
}



/**
 * texCoords scaling (no effect)
 */
MyChessboard.prototype.scaleTexCoords = function() {}