/**
 * MyCrabMedium constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 * @param {Integer} player Player who owns this crab
 */
function MyCrabMedium(scene, player){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 1;
    this.currHeight = 0;

    this.cylinder = new MyFullCylinder(this.scene,1,0.3,0.3,16,16);
    this.crab = new MyCrab(this.scene, player);
    this.angle = 0;

    this.moving = false;
    this.finishedMoving = false;

    this.animation = [];
    this.init_time = 0;
    this.tileHeight = 0;

    this.path = [];

    this.lastTransformation = mat4.create();
    mat4.identity(this.lastTransformation);

    this.moveAnimation();
}

MyCrabMedium.prototype = Object.create(CGFobject.prototype);
MyCrabMedium.prototype.constructor = MyCrabMedium;

/**
 * sets the control points for the crab movement
 * @param {Integer} posY Initial position of the crab
 * @param {Integer} newPosY Final position of the crab, after animation
 */
MyCrabMedium.prototype.moveAnimation = function (posY, newPosY){

    if (this.moving){
        var controlPoints = [];

        var x = 0;
        var y = 0;
        var z = 0;

        var seconds = 1;
        controlPoints.push(vec3.fromValues(x,y,z));


        y += 2;
        seconds++;

        controlPoints.push(vec3.fromValues(x,y,z));

        y += 2;
        z += -1.5;
        z += -this.currHeight;

        seconds++;
        controlPoints.push(vec3.fromValues(x,y,z));
		
		var diagonal;

        while (this.path.length > 0){
			
            var currentPath = this.path.pop();
			var x_dist = 8;
			var y_dist = 4;
			var y_dist_1 = 4;
			var y_dist_2 = 4;
            if (currentPath[0] <= 2){
                if (currentPath[1] == currentPath[0] + 3){
                    console.log("1a fila - baixo esquerda");
                    x += x_dist;
                    y += -y_dist_1;
					diagonal = true;

                }
                else if (currentPath[1] == currentPath[0] + 4){
                    console.log("1a fila - baixo direita");
                    x += x_dist;
                    y += y_dist_2;
					diagonal = false;
                }
            }
            else if (currentPath[0] <= 6){
                if (currentPath[1] == currentPath[0] - 4){
                    console.log("2a fila - cima esquerda");
                    x += -x_dist;
                    y += -y_dist_2;
					diagonal = false;

                }
                else if (currentPath[1] == currentPath[0] - 3){
                    console.log("2a fila - cima direita");
                    x += -x_dist;
                    y += y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] + 4){
                    console.log("2a fila - baixo esquerda");
                    x += x_dist;
                    y += -y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] + 5){
                    console.log("2a fila - baixo direita");
                    x += x_dist;
                    y += y_dist_2;
					diagonal = false;
                }
            }
            else if (currentPath[0] <= 11){
                if (currentPath[1] == currentPath[0] - 5){
                    console.log("3a fila - cima esquerda");
                    x += -x_dist;
                    y += -y_dist_2;
					diagonal = false;

                }
                else if (currentPath[1] == currentPath[0] - 4){
                    console.log("3a fila - cima direita");
                    x += -x_dist;
                    y += y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] - 1){
                    console.log("3a fila - só esquerda");
                    y += -y_dist*2;
                }
                else if (currentPath[1] == currentPath[0] + 1){
                    console.log("3a fila - só direita");
                    y += y_dist*2;
                }
                else if (currentPath[1] == currentPath[0] + 4){
                    console.log("3a fila - baixo esquerda");
                    x += x_dist;
                    y += -y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] + 5){
                    console.log("3a fila - baixo direita");
                    x += x_dist;
                    y += y_dist_2;
					diagonal = false;
                }
            }
            else if (currentPath[0] <= 15){
                if (currentPath[1] == currentPath[0] - 5){
                    console.log("4a fila - cima esquerda");
                    x += -x_dist;
                    y += -y_dist_2;
					diagonal = false;

                }
                else if (currentPath[1] == currentPath[0] - 4){
                    console.log("4a fila - cima direita");
                    x += -x_dist;
                    y += y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] + 3){
                    console.log("4a fila - baixo esquerda");
                    x += x_dist;
                    y += -y_dist_1;
					diagonal = true;
                }
                else if (currentPath[1] == currentPath[0] + 4){
                    console.log("4a fila - baixo direita");
                    x += x_dist;
                    y += y_dist_2;
					diagonal = false;
                }
            }
            else if (currentPath[0] <= 18){
                if (currentPath[1] == currentPath[0] - 4){
                    console.log("5a fila - cima esquerda");
                    x += -x_dist;
                    y += -y_dist_2;
					diagonal = false;

                }
                else if (currentPath[1] == currentPath[0] - 3){
                    console.log("5a fila - cima direita");
                    x += -x_dist;
                    y += y_dist_1;
					diagonal = true;
                }
            }

            seconds++;
            controlPoints.push(vec3.fromValues(x,y,z));
			
			
        }

        y += -2;
        z += 1.5;

        seconds++;
        controlPoints.push(vec3.fromValues(x,y,z));

        y = newPosY - posY;
		console.log("DIAGONAL " + diagonal);
		
        z += this.tileHeight;

        seconds++;
        controlPoints.push(vec3.fromValues(x,y,z));
		
		
		
		console.log("ANIMATION X " + x);
		console.log("ANIMATION Y " + y);

        var id = "MediumCrab";

        this.animation = new LinearAnimation(id, seconds, controlPoints);
    }

}

/**
 * starts the movement of the crab
 * @param {Integer} init_time Initial time for the new animation
 * @param {Integer[]} path Path the crab has to walk
 * @param {Integer} currHeight Current height of the crab
 * @param {Integer} height Current height of the tile
 * @param {Integer} posY Initial position of the crab
 * @param {Integer} newPosY Final position of the crab, after animation
 */
MyCrabMedium.prototype.makeMove = function (init_time, path, currHeight, height, posY, newPosY){

    this.moving = true;
    this.init_time = init_time;
    this.path = path;
    this.tileHeight = height;
    this.currHeight = currHeight;
     this.moveAnimation(posY, newPosY);

}

/**
 * returns if this crab is moving
 */
MyCrabMedium.prototype.isMoving = function (){

    return this.moving;

}

/**
 * returns if this crab has finished moving
 */
MyCrabMedium.prototype.isFinishedMoving = function (){

    return this.finishedMoving;

}

/**
 * setFinishedMoving
 * @param {Boolean} finish Animation finished movement
 */
MyCrabMedium.prototype.setFinishedMoving = function (finish){

    this.finishedMoving = finish;

}


/**
 * Display function of the scene to render this object.
 */
MyCrabMedium.prototype.display = function() {

    this.scene.translate(-0.5,0,0.4);
    this.scene.translate(0,-0.5,0);
    this.scene.rotate(this.angle,0,0,1);
    this.scene.translate(0,0,1);
    this.crab.display();
}

/**
 * Updates animation of the crab
 * @param {Float} currTime current time
 */
MyCrabMedium.prototype.update = function(currTime) {

    var time = currTime;
    time = time - this.init_time;

    //to change from climbing down animation to walking one
    if (this.moving){
        if(time > this.animation.timeSpan){
            this.init_time = currTime;
            mat4.identity(this.lastTransformation);
            mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
            this.finishedMoving = true;
            this.moving = false;
            return this.lastTransformation;
        }
    }


    //if (this.finishedMoving)
    //mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
    this.animationTransformation = this.animation.update(time);

    anim = mat4.create();
    mat4.identity(anim);
    mat4.multiply(anim, this.lastTransformation, this.animationTransformation);
    this.local = anim;
    return anim;
}




/**
 * texCoords scaling (no effect)
 */
MyCrabMedium.prototype.scaleTexCoords = function(){}
