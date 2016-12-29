function Vertex(id){

    this.adj = [];

    this.parent;
    this.state;

    this.id = id;

};

Vertex.prototype = Object.create(Object.prototype);
Vertex.prototype.constructor = Vertex;

Vertex.prototype.addEdge = function(dest) {
    var edge = new Edge();
    edge.orig = this.id;
    edge.dest = dest;
    this.adj.push(edge);
}

Vertex.prototype.setState = function(state) {
    this.state = state;
}

Vertex.prototype.setParent = function(parent) {
    this.parent = parent;
}