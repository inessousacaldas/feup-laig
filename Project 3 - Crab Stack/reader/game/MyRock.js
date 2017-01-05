/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */

deg2rad = Math.PI / 180;

function MyRock(scene){
    CGFobject.call(this,scene);
    this.scene = scene;
    this.scale = 0.15;
    this.texture = new Texture(this.scene, 'scenes/textures/rock/rock.jpg', 'rock');
    this.heightMap = new Texture(this.scene, 'scenes/textures/rock/rock_map.png', 'rock_map');

    this.rock = new MySphere(this.scene, 1, 16, 16);
    this.shader = new CGFshader(this.scene.gl, 'shaders/rock.vert', 'shaders/rock.frag');
    this.shader.setUniformsValues({uSampler2: 1});
    this.shader.setUniformsValues({scale: this.scale});
    this.c1 = [1,0,0,1];
    [this.c1[0], this.c1[1], this.c1[2], this.c1[3]]
    this.shader.setUniformsValues({color: this.c1});

}

MyRock.prototype = Object.create(CGFobject.prototype);
MyRock.prototype.constructor = MyRock;

/**
 * Display function of the scene to render this object.
 */
MyRock.prototype.display = function() {

    this.scene.setActiveShader(this.shader);

    this.texture.bind();
    this.heightMap.bind(1);

    this.scene.pushMatrix();
        this.scene.scale(1.6,1,1.6);
        this.rock.display();
   this.scene.popMatrix();

    this.heightMap.unbind(1);
    this.texture.unbind();

	this.scene.setActiveShader(this.scene.defaultShader);



}



/**
 * texCoords scaling (no effect)
 */
MyRock.prototype.scaleTexCoords = function(){}
