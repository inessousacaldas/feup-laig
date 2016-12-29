function Edge(){

    this.dest;
    this.orig;

};

Edge.prototype = Object.create(Object.prototype);
Edge.prototype.constructor = Edge;

Edge.prototype.setDest = function(dest) {
    this.dest = dest;
}

Edge.prototype.setOrig = function(orig) {
    this.orig = orig;
}
