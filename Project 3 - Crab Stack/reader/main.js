//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 

serialInclude(['../lib/CGF.js', 
'primitives/MyTriangle.js',
'primitives/MyRectangle.js', 
'primitives/MyFullCylinder.js',
'primitives/MyCircle.js',
'primitives/MyCylinder.js',
'primitives/MySphere.js',
'primitives/MyTorus.js',
'primitives/MyPlane.js',
'primitives/MyPlaneText.js',
'primitives/MyQuad.js',
'primitives/MyPatch.js',
'primitives/MyTerrain.js',
'primitives/MyVehicle.js',
'primitives/MyCube.js',
'primitives/MyPyramid.js',
'primitives/MyChessboard.js',
'game/MyGameboard.js',
'game/MyHexagon.js',
'game/MyTile.js',
'game/MyCrabBig.js',
'game/MyCrabMedium.js',
'game/MyCrabSmall.js',
'game/MyCrab.js',
'game/MyCrabClaw.js',
'game/MyCrabLeg.js',
'game/MyTree.js',
'game/MyPiece.js',
'game/MyRock.js',
'game/Marker.js',
'game/Player.js',
'game/state/GameHistory.js',
'game/state/PlayerMove.js',
'DSXSceneGraph.js',
'DSXReader.js', 
'DSXScene.js', 
'MyInterface.js',
'PrologConnection.js',
'Illumination.js',
'Light.js', 
'Texture.js', 
'leafs/Leaf.js',
'leafs/LeafCylinder.js', 
'leafs/LeafRectangle.js',
'leafs/LeafSphere.js',
'leafs/LeafTriangle.js', 
'leafs/LeafTorus.js',
'leafs/LeafPatch.js',
'leafs/LeafPlane.js',
'leafs/LeafTerrain.js',
'leafs/LeafVehicle.js',
'leafs/LeafChessboard.js',
'leafs/LeafGameboard.js',
'Material.js',
'Node.js',
'Views.js',
'animations/Animation.js',
'animations/CircularAnimation.js',
'animations/LinearAnimation.js',
'animations/RotationAnimation.js',
'graph/Graph.js',
'graph/Edge.js',
'graph/Queue.js',
'graph/Vertex.js',


main=function()
{
;
	// Standard application, scene and interface setu
    var app = new CGFapplication(document.body);
    var myScene = new DSXScene(player1_name, player1_type, player1_color, player2_name, player2_type, player2_color);
    var myInterface = new MyInterface();

    app.init();

    app.setInterface(myInterface);
    app.setScene(myScene);
	myScene.setInterface(myInterface);
	myInterface.setScene(myScene);

    myInterface.setActiveCamera(myScene.camera);


    // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
    // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)
    var gameVars = getUrlVars();
    var player1_type = gameVars['player1_type'];
    var player1_color = gameVars['player1_color'];
    var player1_name = gameVars['player1_name'];
    var player1_lvl = 0;

    var player2_type = gameVars['player2_type'];
    var player2_color = gameVars['player2_color'];
    var player2_name = gameVars['player2_name'];
    var player2_lvl = 0;
	
	var ambient = gameVars['ambient_type'];

    var turn_time = parseInt(gameVars['turn_time']);

    if(player1_type != 'human'){

        var array = player1_type.split("_");
        player1_type = array[0];
        player1_lvl = array[1];

    }

    if(player2_type != 'human'){

        var array = player2_type.split("_");
        player2_type = array[0];
        player2_lvl = array[1];

    }

    var player1 = new Player(1, player1_name, player1_type, player1_color, player1_lvl);
    var player2 = new Player(2, player2_name, player2_type, player2_color, player2_lvl);

    myScene.setPlayers(player1, player2);
	myScene.setAmbientType(ambient);
   // myScene.
	if (ambient == "sea")
		var filename="worldScene.dsx";
	else
		var filename="swampscene.dsx";

	//Loads the graph from DSX filename
	var myGraph = new DSXSceneGraph(filename, myScene);
	
	// start
    app.run();
}

]);