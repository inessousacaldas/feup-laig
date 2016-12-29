function Graph(){

    this.vertexSet = [];

    this.buildGraph();
};

Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;

Graph.prototype.buildGraph = function() {
    for (var i=0;i<=18;i++)
        this.addVertex(new Vertex(i));


    this.vertexSet[0].addEdge(3);
    this.vertexSet[0].addEdge(4);

    this.vertexSet[1].addEdge(4);
    this.vertexSet[1].addEdge(5);

    this.vertexSet[2].addEdge(5);
    this.vertexSet[2].addEdge(6);

    this.vertexSet[3].addEdge(0);
    this.vertexSet[3].addEdge(7);
    this.vertexSet[3].addEdge(8);

    this.vertexSet[4].addEdge(0);
    this.vertexSet[4].addEdge(1);
    this.vertexSet[4].addEdge(8);
    this.vertexSet[4].addEdge(9);

    this.vertexSet[5].addEdge(1);
    this.vertexSet[5].addEdge(2);
    this.vertexSet[5].addEdge(9);
    this.vertexSet[5].addEdge(10);

    this.vertexSet[6].addEdge(2);
    this.vertexSet[6].addEdge(10);
    this.vertexSet[6].addEdge(11);

    this.vertexSet[7].addEdge(3);
    this.vertexSet[7].addEdge(12);

    this.vertexSet[8].addEdge(3);
    this.vertexSet[8].addEdge(4);
    this.vertexSet[8].addEdge(9);
    this.vertexSet[8].addEdge(12);
    this.vertexSet[8].addEdge(13);

    this.vertexSet[9].addEdge(4);
    this.vertexSet[9].addEdge(5);
    this.vertexSet[9].addEdge(8);
    this.vertexSet[9].addEdge(13);
    this.vertexSet[9].addEdge(14);

    this.vertexSet[10].addEdge(5);
    this.vertexSet[10].addEdge(6);
    this.vertexSet[10].addEdge(14);
    this.vertexSet[10].addEdge(15);

    this.vertexSet[11].addEdge(6);
    this.vertexSet[11].addEdge(15);

    this.vertexSet[12].addEdge(7);
    this.vertexSet[12].addEdge(8);
    this.vertexSet[12].addEdge(16);

    this.vertexSet[13].addEdge(8);
    this.vertexSet[13].addEdge(9);
    this.vertexSet[13].addEdge(16);
    this.vertexSet[13].addEdge(17);

    this.vertexSet[14].addEdge(9);
    this.vertexSet[14].addEdge(10);
    this.vertexSet[14].addEdge(17);
    this.vertexSet[14].addEdge(18);

    this.vertexSet[15].addEdge(10);
    this.vertexSet[15].addEdge(11);
    this.vertexSet[15].addEdge(18);

    this.vertexSet[16].addEdge(12);
    this.vertexSet[16].addEdge(13);

    this.vertexSet[17].addEdge(13);
    this.vertexSet[17].addEdge(14);

    this.vertexSet[18].addEdge(14);
    this.vertexSet[18].addEdge(15);
}

Graph.prototype.addVertex = function(vertex) {
    this.vertexSet.push(vertex);
}

Graph.prototype.BFSearch = function(orig) {

    for (var i=0;i<=18;i++) {
        this.vertexSet[i].setParent(-1);
        this.vertexSet[i].setState("Undiscovered");
    }

    var q = new Queue();

    this.vertexSet[orig].setState("Discovered");
    q.enqueue(orig);

    while (!q.isEmpty()){
        var v = q.dequeue();
        for (var w=0;w < this.vertexSet[v].adj.length;w++){
            var dest = this.vertexSet[v].adj[w].dest;
            //console.log("Vou verificar se " + v + " e " + dest + " estão conectados");
            if (this.vertexSet[dest].state == "Undiscovered"){
                q.enqueue(dest);
                this.vertexSet[dest].setParent(v);
                this.vertexSet[dest].setState("Discovered");
                //console.log("Estão");
            }
        }
        this.vertexSet[v].setState("Processed");
    }
}

