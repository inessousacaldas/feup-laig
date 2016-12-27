/**
 * MyCrabBig constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabBig(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 1.3;

    this.cylinder = new MyFullCylinder(this.scene,1.3,0.5,0.5,16,16);

    this.moving = false;
    this.moveClimbingDown = false;
    this.moveClimbingUp = false;
    this.movingPath = false;
    this.finishedMoving = false;
    this.animation;
    this.init_time = 0;

    this.lastTransformation = mat4.create();
    mat4.identity(this.lastTransformation);

    //Para testar - alterar
    this.moveAnimation();
}

MyCrabBig.prototype = Object.create(CGFobject.prototype);
MyCrabBig.prototype.constructor = MyCrabBig;


MyCrabBig.prototype.moveAnimation = function (){

    if (this.moving && this.moveClimbingDown){
        var controlPoints = [];

        var x = 0;
        var y = 0;
        var z = 0;
        controlPoints.push(vec3.fromValues(x,y,z));

        y = -1;
        z = -1;

        controlPoints.push(vec3.fromValues(x,y,z));
        var timeSpan = 2;
        var id = "BigCrab";

        this.animation = new LinearAnimation(id, timeSpan, controlPoints);
    }

    else if (this.moving && this.moveClimbingUp){
        var controlPoints = [];

        var x = 0;
        var y = 0;
        var z = 0;
        controlPoints.push(vec3.fromValues(x,y,z));

        y = 1;
        z = 1;

        controlPoints.push(vec3.fromValues(x,y,z));
        var timeSpan = 2;
        var id = "BigCrab";

        this.animation = new LinearAnimation(id, timeSpan, controlPoints);
    }

    else if (this.moving && this.movingPath){
        var controlPoints = [];

        var x = 0;
        var y = 0;
        var z = 0;
        controlPoints.push(vec3.fromValues(x,y,z));

        x = 1;
        z = 1;

        controlPoints.push(vec3.fromValues(x,y,z));
        var timeSpan = 2;
        var id = "BigCrab";

        this.animation = new LinearAnimation(id, timeSpan, controlPoints);
    }


}


 MyCrabBig.prototype.makeMove = function (init_time){

     this.moving = true;
     this.moveClimbingDown = true;
     this.init_time = init_time;

     this.moveAnimation();

 }

 MyCrabBig.prototype.isMoving = function (){

     return this.moving;

 }

/**
 * Display function of the scene to render this object.
 */
MyCrabBig.prototype.display = function() {

   // this.scene.pushMatrix();
        this.cylinder.display();
   // this.scene.popMatrix();
}

MyCrabBig.prototype.update = function(currTime) {

    var time = currTime;
    time = time - this.init_time;

    //to change from climbing down animation to walking one
    if (this.moving && this.moveClimbingDown){
        if(time > this.animation.timeSpan){
            this.init_time = currTime;
            this.moveClimbingDown = false;
            this.movingPath = true;
            mat4.identity(this.lastTransformation);
            mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
            this.moveAnimation();
        }
    }

    //to change from walking animation to climbing up one
    else if (this.moving && this.movingPath){
        if(time > this.animation.timeSpan){
            this.init_time = currTime;
            this.moveClimbingUp = true;
            this.movingPath = false;
            //mat4.identity(this.lastTransformation);
            mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
            this.moveAnimation();
        }
    }

    //to change from climbing up animation to stop
    else if (this.moving && this.moveClimbingUp){
        if(time > this.animation.timeSpan){
            this.moveClimbingUp = false;
            this.moving = false;
            //mat4.identity(this.lastTransformation);
            mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
            this.finishedMoving=true;
        }
    }


    //if (this.finishedMoving)
       //mat4.multiply(this.lastTransformation , this.lastTransformation,this.animationTransformation);
    this.animationTransformation = this.animation.update(time);

    var anim = mat4.create();
     mat4.identity(anim);
     mat4.multiply(anim, this.lastTransformation, this.animationTransformation);
    return anim;
}




/**
 * texCoords scaling (no effect)
 */
MyCrabBig.prototype.scaleTexCoords = function(){}
