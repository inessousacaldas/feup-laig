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
'DSXSceneGraph.js',
'DSXReader.js', 
'DSXScene.js', 
'MyInterface.js', 
'Illumination.js',
'Light.js', 
'Texture.js', 
'leafs/Leaf.js',
'leafs/LeafCylinder.js', 
'leafs/LeafRectangle.js',
'leafs/LeafSphere.js',
'leafs/LeafTriangle.js', 
'leafs/LeafTorus.js',
'Material.js',
'Node.js',
'Views.js',
'animations/Animation.js',
'animations/CircularAnimation.js',
'animations/LinearAnimation.js',
'animations/RotationAnimation.js',


main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new DSXScene();
    var myInterface = new MyInterface();

    app.init();

    app.setInterface(myInterface);
    app.setScene(myScene);
	myScene.setInterface(myInterface);
	myInterface.setScene(myScene);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
	var filename=getUrlVars()['file'] || "worldScene.dsx";

	//Loads the graph from DSX filename
	var myGraph = new DSXSceneGraph(filename, myScene);
	
	// start
    app.run();
}

]);