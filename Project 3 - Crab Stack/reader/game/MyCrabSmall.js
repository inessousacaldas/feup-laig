/**
 * MyCrabSmall constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabSmall(scene, player){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 0.8;
    this.currHeight = 0;

    this.cylinder = new MyFullCylinder(this.scene,0.8,0.15,0.15,16,16);
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

MyCrabSmall.prototype = Object.create(CGFobject.prototype);
MyCrabSmall.prototype.constructor = MyCrabSmall;


MyCrabSmall.prototype.moveAnimation = function (posY, newPosY){

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
                    y += -y_dist;
                }
                else if (currentPath[1] == currentPath[0] + 1){
                    console.log("3a fila - só direita");
                    y += y_dist;
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

        var id = "SmallCrab";

        this.animation = new LinearAnimation(id, seconds, controlPoints);
    }

}


MyCrabSmall.prototype.makeMove = function (init_time, path, currHeight, height, posY, newPosY){

    this.moving = true;
    this.init_time = init_time;
    this.path = path;
    this.tileHeight = height;
    this.currHeight = currHeight;
     this.moveAnimation(posY, newPosY);

}

MyCrabSmall.prototype.isMoving = function (){

    return this.moving;

}

MyCrabSmall.prototype.isFinishedMoving = function (){

    return this.finishedMoving;

}

MyCrabSmall.prototype.setFinishedMoving = function (finish){

    this.finishedMoving = finish;

}


/**
 * Display function of the scene to render this object.
 */
MyCrabSmall.prototype.display = function() {

    this.scene.translate(-0.5,-0.5,0.5);
    this.scene.rotate(this.angle,0,0,1);
    this.scene.scale(0.8,0.8,0.8);
    this.scene.translate(0,0,1);
    this.crab.display();
}

MyCrabSmall.prototype.update = function(currTime) {

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
MyCrabSmall.prototype.scaleTexCoords = function(){}
