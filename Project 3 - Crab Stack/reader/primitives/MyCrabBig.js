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

    this.move = false;
    this.animation;
    this.init_time = 0;

    //Para testar - alterar
    this.moveAnimation();
}

MyCrabBig.prototype = Object.create(CGFobject.prototype);
MyCrabBig.prototype.constructor = MyCrabBig;


MyCrabBig.prototype.moveAnimation = function (){

     var controlPoints = [];

     var x = 0;
     var y = 0;
     var z = 0;
     controlPoints.push(vec3.fromValues(x,y,z));

     z = 1;

     controlPoints.push(vec3.fromValues(x,y,z));
     var timeSpan = 4;
     var id = "BigCrab";

     this.animation = new LinearAnimation(id, timeSpan, controlPoints);
     //this.move = true;

 }


 MyCrabBig.prototype.makeMove = function (init_time){

     this.move = true;
     this.init_time = init_time;

 }

 MyCrabBig.prototype.isMoving = function (){

     return this.move;

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

    if(time > this.animation.timeSpan)
        this.move = false;

    this.animationTransformation = this.animation.update(time);
    return this.animationTransformation;
}




/**
 * texCoords scaling (no effect)
 */
MyCrabBig.prototype.scaleTexCoords = function(){}
