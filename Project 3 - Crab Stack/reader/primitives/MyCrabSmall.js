/**
 * MyCrabSmall constructor.
 * @constructor
 * @param {CGFscene} scene The scene to which this tile belongs.
 */
function MyCrabSmall(scene){
    CGFobject.call(this,scene);
    this.scene = scene;

    this.height = 0.8;

    this.cylinder = new MyFullCylinder(this.scene,0.8,0.15,0.15,16,16);

    this.move = false;
    this.animation;
    this.init_time = 0;

    //Para testar - alterar
    this.moveAnimation();
}

MyCrabSmall.prototype = Object.create(CGFobject.prototype);
MyCrabSmall.prototype.constructor = MyCrabSmall;


MyCrabSmall.prototype.moveAnimation = function (){

    var controlPoints = [];

    var x = 0;
    var y = 0;
    var z = 0;
    controlPoints.push(vec3.fromValues(x,y,z));

    z = 1;

    controlPoints.push(vec3.fromValues(x,y,z));
    var timeSpan = 100;
    var id = "BigCrab";

    this.animation = new LinearAnimation(id, timeSpan, controlPoints);

}

 MyCrabSmall.prototype.makeMove = function (init_time){

     this.move = true;
     this.init_time = init_time;

 }

 MyCrabSmall.prototype.isMoving = function (){

     return this.move;

 }


/**
 * Display function of the scene to render this object.
 */
MyCrabSmall.prototype.display = function() {

    this.scene.pushMatrix();
    this.cylinder.display();
    this.scene.popMatrix();
}



MyCrabSmall.prototype.update = function(currTime) {

    var time = currTime;
    time = this.init_time - this.animation.timeSpan;

    this.animationTransformation = this.animation.update(time);
    return this.animationTransformation;
}




/**
 * texCoords scaling (no effect)
 */
MyCrabSmall.prototype.scaleTexCoords = function(){}
