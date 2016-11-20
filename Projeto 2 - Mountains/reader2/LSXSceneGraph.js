//Constant to convert degrees in radians
deg2rad = Math.PI / 180
/*
 * LSXSceneGraph
 * @constructor 
 * @param {String} filename name of the file LSX with the scene
 * @param {CGFscene} scene
*/
function LSXSceneGraph(filename, scene) {
    if (typeof scene.onGraphLoaded !== 'function') {
		console.error("onGraphLoaded not defined in scene");
		return;
	}
	this.loadedOk = null;
	this.filename = 'scenes/'+filename;
	
    this.initials = new Initials();
    this.illumination = new Illumination();
    this.lights = [];
    this.textures = [];
    this.materials = [];
    this.leaves = [];
    this.animations = [];
    this.nodes = [];


	this.scene = scene;
	scene.graph=this;
		
	//File reader
	this.reader = new LSXReader();


	//Reads content of filename. Returns message erros in case of fail
	this.reader.open(this.filename, this);  
}

/*
 * Function called if the XML was sucessful read
 */
LSXSceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	
	var error = this.parseSceneGraph(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	this.scene.onGraphLoaded();
};

/*
 * Parser of the LSX scene
 * @param rootElement SCENE tag from LSX
 * 
 */
LSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "SCENE") {
        return "Not a SCENE file";
    }
	console.log(rootElement.children[0].nodeName);
	//The order must be correct
	if (rootElement.children[0].nodeName != "INITIALS" ||
		rootElement.children[1].nodeName != "ILLUMINATION" ||
		rootElement.children[2].nodeName != "LIGHTS" ||
		rootElement.children[3].nodeName != "TEXTURES" ||
		rootElement.children[4].nodeName != "MATERIALS" ||
		rootElement.children[5].nodeName != "LEAVES" ||
		rootElement.children[6].nodeName != "ANIMATIONS" ||
		rootElement.children[7].nodeName != "NODES"){
			error = "The order of the TAGS is wrong";
			return error;
	}
		
	

	console.log("*******INITIALS*******");
    var error = this.parseInitials(rootElement);
    if (error) {
        return error;
    }

	console.log("*******ILLUMINATION*******");
    error = this.parseIllumination(rootElement);
    if (error) {
        return error;
    }

 	console.log("*******LIGHTS*******");
    error = this.parseLights(rootElement);
    if (error) {
        return error;
    }

	console.log("*******TEXTURES*******");
    error = this.parseTextures(rootElement);
    if (error) {
        return error;
    }

	console.log("*******MATERIALS*******");
    error = this.parseMaterials(rootElement);
    if (error) {
        return error;
    }

	console.log("*******LEAVES*******");
    error = this.parseLeaves(rootElement);
    if (error) {
        return error;
    }

    console.log("*******ANIMATIONS*******");
    error = this.parseAnimations(rootElement);
    if (error) {
        return error;
    }

	console.log("*******NODES*******");
    error = this.parseNodes(rootElement);
    if (error) {
        return error;
    }

	console.log("**************");

    this.loadedOk = true;
}


/*
 * Parse tag INITIALS from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseInitials = function(rootElement) {

	//Get INITIAlS
	var initialsTemp =  rootElement.getElementsByTagName("INITIALS");
	if (initialsTemp == null) {
		return "INITIALS is missing";
	}

	if (initialsTemp.length != 1) {
		return "Only one INITIALS is allowed";
	}

	var initials = initialsTemp[0];
	
	
	if (initials.children[1].nodeName != "translation" ||
	    initials.children[2].nodeName != "rotation" ||
	    initials.children[3].nodeName != "rotation" ||
	    initials.children[4].nodeName != "rotation" ||
	    initials.children[5].nodeName != "scale")
			return "Write in order: Translation, Rotation, Scale";

		
	
	//Get INITIALS - frustrum
	frustTemp = initials.getElementsByTagName("frustum");
	if (frustTemp == null) {
	    return "frustum in INITIALS is missing.";
	}
	if (frustTemp.length != 1) {
	    return "Only one frustum is allowed in INITIALS.";
	}

	var frustum = frustTemp[0];

	this.initials.frustum.near = this.reader.getFloat(frustum, "near");
	
	if (this.initials.frustum.near == null)
		return "Frustum near is missing.";
	if (isNaN(this.initials.frustum.near))
		return "Frustum near is NaN.";

	this.initials.frustum.far = this.reader.getFloat(frustum, "far");
	if (this.initials.frustum.far == null)
		return "Frustum far is missing.";
	if (isNaN(this.initials.frustum.far))
		return "Frustum far is NaN.";

	//Get INITIALS - translation
    transTemp = initials.getElementsByTagName("translation");
	if (transTemp == null) {
	    return "translation in INITIALS is missing.";
	}
	if (transTemp.length != 1) {
	    return "Only one translation in INITIALS is allowed.";
	}
	
    var translation = transTemp[0];
    var translationData = vec3.create();
    translationData[0] = this.reader.getFloat(translation, "x");
    if (translationData[0] == null)
		return "Translation x attribute missing";
	if (isNaN(translationData[0]))
		return "Translation x is NaN";
    translationData[1] = this.reader.getFloat(translation, "y");
    if (translationData[1] == null)
		return "Translation y attribute missing";
	if (isNaN(translationData[1]))
		return "Translation y is NaN";
    translationData[2] = this.reader.getFloat(translation, "z");
    if (translationData[2] == null)
		return "Translation z attribute missing";
	if (isNaN(translationData[2]))
		return "Translation z is NaN";

    mat4.translate(this.initials.localTransformations, this.initials.localTransformations, translationData);

	//Get INITIALS - rotation
    rotTemp = initials.getElementsByTagName("rotation");
	if (rotTemp == null) {
	    return "rotation in INITIALS is missing.";
	}
    if (rotTemp.length != 3) {
        return "3 'rotation' elements needed in INITIALS";
    }

	var rotations = []
    for (var i = 0; i < rotTemp.length; ++i) {
    	var rotation = rotTemp[i];
    	var axis = this.reader.getString(rotation, "axis");
    	if (["x", "y", "z"].indexOf(axis) == -1)
    		return "Unknow axis: " + axis;
		if (axis in rotations)
			return "Duplicate axis rotation in INITIALS " + axis;

    	var angle = this.reader.getString(rotation, "angle");
    	rotations[axis] = angle;
    }
	mat4.rotateX(this.initials.localTransformations, this.initials.localTransformations, rotations["x"] * Math.PI / 180);
	mat4.rotateY(this.initials.localTransformations, this.initials.localTransformations, rotations["y"] * Math.PI / 180);
	mat4.rotateZ(this.initials.localTransformations, this.initials.localTransformations, rotations["z"] * Math.PI / 180);

	//Get INITIALS - scale
    scaleTemp = initials.getElementsByTagName("scale");
	if (scaleTemp == null) {
	    return "scale in INITIALS is missing.";
	}
	if (scaleTemp.length != 1) {
	    return "Only one scale is allowed in INITIALS.";
	}

	var scale = scaleTemp[0];
    var scaleData = vec3.create();
    scaleData[0] = this.reader.getFloat(scale, "sx");
    scaleData[1] = this.reader.getFloat(scale, "sy");
    scaleData[2] = this.reader.getFloat(scale, "sz");
    mat4.scale(this.initials.localTransformations, this.initials.localTransformations, scaleData);
 
	//Get INITIALS - reference -> reference length of axis
    refTemp = initials.getElementsByTagName("reference");
	if (refTemp == null) {
	    return "reference in INITIALS is missing.";
	}
	if (refTemp.length != 1) {
	    return "Only one reference in INITIALS is allowed";
	}

	var reference = refTemp[0];
	this.initials.referenceLength = this.reader.getFloat(reference, "length");

};

/*
 * Parse tag ILLUMINATION from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	//Get ILLUMINATION
	var tempIllum =  rootElement.getElementsByTagName("ILLUMINATION");
	if (tempIllum == null) {
		return "ILLUMINATION is missing.";
	}

	if (tempIllum.length != 1) {
		return "only one ILLUMINATION is allowed.";
	}

	var illumination = tempIllum[0];

	//Get global ambient light
    tempAmb = illumination.getElementsByTagName("ambient");
    if (tempAmb == null) {
		return "ambient in ILLUMINATION is missing.";
	}

	if (tempAmb.length != 1) {
		return "only one ambient in ILLUMINATION is allowed.";
	}

	var ambient = tempAmb[0];
	this.illumination.ambient = this.reader.getRGBA(ambient);

	//Get background color
    tempBack = illumination.getElementsByTagName("background");
    if (tempBack == null) {
		return "background in ILLUMINATION is missing.";
	}

	if (tempBack.length != 1) {
		return "only one background in ILLUMINATION is allowed.";
	}

	var background = tempBack[0];
	this.illumination.background = this.reader.getRGBA(background);

}

/* 
 * Parse tag LIGHTS from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseLights = function(rootElement) {
	//Get LIGHTS
    var tempLights =  rootElement.getElementsByTagName("LIGHTS");
	if (tempLights == null) {
		return "LIGHTS element is missing.";
	}

	if (tempLights.length != 1) {
		return "only one LIGHTS is allowed.";
	}

	//Get LIGHTS - LIGHT
	var lights = tempLights[0];

	for (var i = 0; i < lights.children.length; ++i) {
		var light = lights.children[i];
		if (light.nodeName != "LIGHT")
			return "expected LIGHT in LIGHTS: " + light.nodeName;
		var id = this.reader.getString(light, "id");
		if (id == null)
			return "LIGHT without id.";

		this.lights.push(new Light(this.scene, i, id));

		var enable = this.reader.getBoolean(light.children[0], "value");
		if (enable)
			this.lights[i].enable();
		else
			this.lights[i].disable();

		var data = [];
		//position of light
		data.push(this.reader.getFloat(light.children[1], "x"));
		data.push(this.reader.getFloat(light.children[1], "y"));
		data.push(this.reader.getFloat(light.children[1], "z"));
		data.push(this.reader.getFloat(light.children[1], "w"));
		this.lights[i].setPosition(data[0], data[1], data[2], data[3]);

		//components of light
		data = this.reader.getRGBA(light.children[2]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(light.children[3]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(light.children[4]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
	}
}

/*
 * Parse tag TEXTURES from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseTextures = function(rootElement) {
	//Get TEXTURES
    var tempText =  rootElement.getElementsByTagName("TEXTURES");
	if (tempText == null) {
		return "TEXTURES is missing.";
	}

	if (tempText.length != 1) {
		return "Only one TEXTURES is allowed.";
	}

	var textures = tempText[0];

	texture = textures.getElementsByTagName("TEXTURE");

	if (texture == null) {
		console.log("TEXTURE in TEXTURES missing");
		return;
	}
	if (texture.length == 0) {
		console.log("No Texture in TEXTURES.");
		return;
	}

	//Relative path to file with textures (images)
	var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));

	for (var i = 0; i < texture.length; ++i) {
		var NewTexture = texture[i];
		var id = this.reader.getString(NewTexture, "id");
		if (id in this.textures)
			return "Duplicate texture id: " + id;

		var path = pathRel + '/' + this.reader.getString(NewTexture.children[0], "path");
		var s = this.reader.getFloat(NewTexture.children[1], "s");
		var t = this.reader.getFloat(NewTexture.children[1], "t");
		this.textures[id] = new Texture(this.scene, path, id);
		this.textures[id].setAmplifyFactor(s,t);
	}
}


/*
 * Parse tag MATERIALS from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseMaterials = function(rootElement) {
	//Get MATERIALS
    var tempMat =  rootElement.getElementsByTagName("MATERIALS");
	if (tempMat == null) {
		return "MATERIALS is missing.";
	}

	if (tempMat.length != 1) {
		return "Only one MATERIALS is allowed.";
	}

	var materials = tempMat[0];
	
	//Get each material
	for(var i = 0; i < materials.children.length; ++i){
		var material = materials.children[i];
		var id = this.reader.getString(material,"id");
		if (id in this.materials)
			return "Duplicate material id: " + id;

		this.materials[id] = new Material(this.scene,id);
		var shininess = this.reader.getFloat(material.children[0],"value");
		this.materials[id].setShininess(shininess);
		var data = this.reader.getRGBA(material.children[1]);
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[2]);
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[3]);
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[4]);
		this.materials[id].setEmission(data[0],data[1],data[2],data[3]);
		
	}
}

/*
 * Parse tag LEAVES from LSX - sets all primitives for the scene
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseLeaves = function(rootElement) {
	//Get LEAVES - primitives to be drawn
    var tempLeaves =  rootElement.getElementsByTagName("LEAVES");
	if (tempLeaves == null) {
		return "LEAVES is missing.";
	}

	if (tempLeaves.length != 1) {
		return "Only one LEAVES is allowed.";
	}

	var leaves = tempLeaves[0];

	allLeaf = leaves.getElementsByTagName("LEAF");

	if (allLeaf == null) {
		return "LEAF in LEAVES missing";
	}
	if (allLeaf.length == 0) {
		return "No LEAF found."
	}

	//Get each leaf
	for (var i = 0; i < allLeaf.length; ++i) {
		var leaf = allLeaf[i]
		var id = this.reader.getString(leaf, "id");
		if (id in this.leaves)
			return "Duplicate leaf id: " + id;

		var type = this.reader.getString(leaf, "type");
		var data;

		//Different types of primitives
		switch (type) {
			case "rectangle":
				data = this.reader.getArrayOfFloats(leaf, "args", 4);
				if (data == null)
					return "rectangle with error " + id; 
				this.leaves[id] = new LeafRectangle(id, data[0], data[1], data[2], data[3]);
				break;
			case "cylinder":
				data = this.reader.getArrayOfFloats(leaf, "args", 5);
				if (data == null)
					return "cylinder with error " + id;
				if(data[3] % 1 != 0  || data[4] % 1 != 0 )
					return "cylinder " + id + " 4th/5th arg must be integer.";
				this.leaves[id] = new LeafCylinder(id, data[0], data[1], data[2], data[3], data[4]);
				break;
			case "sphere":
				data = this.reader.getArrayOfFloats(leaf, "args", 3);
				if (data == null)
					return "sphere with error " + id;
				if(data[1] % 1 != 0  || data[2] % 1 != 0 )
					return "sphere " + id + " 2nd/3rd arg must be integer.";
				this.leaves[id] = new LeafSphere(id, data[0], data[1], data[2]);
				break;
			case "triangle":
				data = this.reader.getArrayOfFloats(leaf, "args", 9);
				if (data == null)
					return "triangle with error" + id;
				this.leaves[id] = new LeafTriangle(id, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
				break;
			case "plane":
				parts = this.reader.getInteger(leaf, "parts");
				this.leaves[id] = new LeafPlane(id, parts);
				break;

			case "patch":
				order = this.reader.getInteger(leaf, "order");
				partsU = this.reader.getInteger(leaf, "partsU");
				partsV = this.reader.getInteger(leaf, "partsV");
				var controlPoints = [];

				if(leaf.children.length != Math.pow((order + 1),2))
					return "number of control points must be (order + 1)^2 in patch " + id;
				index = 0;
				
				for (var j = 0; j < (order + 1); j++) {
					var controlPointTemp = [];
					for(var k = 0; k< (order + 1); k++){
						var controlpoint = leaf.children[k + index];
						var x = this.reader.getFloat(controlpoint, "x");
						var y = this.reader.getFloat(controlpoint, "y");
						var z = this.reader.getFloat(controlpoint, "z");
						controlPointTemp.push(vec4.fromValues(x,y,z,1));
					}
					controlPoints.push(controlPointTemp);
					index += order + 1;
				}
				
				this.leaves[id] = new LeafPatch(id, order, partsU, partsV, controlPoints);
				break;
			case "terrain":
					var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));
					var texture= pathRel + '/textures/' + this.reader.getString(leaf, "texture");
					var heightMap = pathRel + '/textures/' + this.reader.getString(leaf, "heightmap");
					
					if(texture == null)
						return "missing texture in terrain " + id;

					if(heightMap == null)
						return "missing heightmap in terrain " + id;
					
					//optional
					var height = this.reader.getFloat(leaf, 'height');
					var dheight = this.reader.getFloat(leaf, 'dheight');

					this.leaves[id] = new LeafTerrain(id, texture, heightMap, height, dheight);
				break;
			
			case "vehicle":	
					this.leaves[id] = new LeafVehicle(id);
				break;

			case "boat":	
					this.leaves[id] = new LeafBoat(id);
				break;

			default:
				return "Leaf type unknown: " + type;
		}
	}
}


/*
 * Parse tag ANIMATIONS from LSX - sets all animations for the scene
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseAnimations = function(rootElement) {
	//Get LEAVES - primitives to be drawn
    var tempAnim =  rootElement.getElementsByTagName("ANIMATIONS");
	if (tempAnim == null) {
		return "ANIMATIONS is missing.";
	}

	if (tempAnim.length != 1) {
		return "Only one ANIMATIONS is allowed.";
	}

	var animations = tempAnim[0];

	allAnim = animations.getElementsByTagName("ANIMATION");
	
	//Get each animation
	for (var i = 0; i < allAnim.length; i++) {
		var anim = allAnim[i]
		var id = this.reader.getString(anim, "id");
		if (id in this.animations)
			return "Duplicate animation id: " + id;
		
		var type = this.reader.getString(anim, "type");
		var timeSpan = this.reader.getFloat(anim, "span");
		
		
		//Different types of animations
		switch (type) {
			case "circular":
				var center = this.reader.getArrayOfFloats(anim, "center", 3);
				if (center == null)
					return "circular animation with error " + id;

				var radius = this.reader.getFloat(anim, "radius");
				var startAng = this.reader.getFloat(anim,"startang") * deg2rad;
				
				var rotAng = this.reader.getFloat(anim,"rotang")* deg2rad ;
				this.animations[id] = new CircularAnimation(id, timeSpan, vec3.fromValues(center[0], center[1], center[2]), radius, startAng, rotAng);
				
				break;
				
				
				case "linear":
					var controlPoints = [];
					for (var j = 0; j < anim.children.length; j++) {
						var controlpoint = anim.children[j];
						var x = this.reader.getFloat(controlpoint, "xx");
						var y = this.reader.getFloat(controlpoint, "yy");
						var z = this.reader.getFloat(controlpoint, "zz");
						controlPoints.push(vec3.fromValues(x,y,z));
					}
					this.animations[id] = new LinearAnimation(id, timeSpan, controlPoints);

					break;


				case "rotation":
				var dw = this.reader.getFloat(anim, "dw");
				if (dw == null)
					return "rotation animation with error " + id;
					
				this.animations[id] = new RotationAnimation(id, timeSpan, dw);
				break;
				
	
				default:
					return "Animation type unknown: " + type;
					
					break;
			
		}
	}
}

/*
 * Parse tag NODES from LSX
 * @param rootElement SCENE tag from LSX
 */
LSXSceneGraph.prototype.parseNodes = function(rootElement) {
	//Get NODES
    var tempNodes =  rootElement.getElementsByTagName("NODES");
	if (tempNodes == null) {
		return "NODES is missing.";
	}

	if (tempNodes.length != 1) {
		return "Only one NODES is allowed";
	}

	var nodes = tempNodes[0];
	this.root = this.reader.getString(nodes.children[0], "id");

	tempNode = nodes.getElementsByTagName("NODE");

	if (tempNode == null) {
		return "NODE in NODES missing";
	}
	if (tempNode.length == 0) {
		return "No NODE found."
	}

	for (var i = 0; i < tempNode.length; ++i) {
		var node = tempNode[i];

		error = this.parseNode(node);
		if (error)
			return error;
	}

	if (!(this.root in this.nodes))
		return "Node with root id missing";

	for (key in this.nodes) {
		for (var i = 0; i < this.nodes[key].children.length; ++i) {
			var child = this.nodes[key].children[i];
			if (!((child in this.nodes) || (child in this.leaves)))
				return "Child " + child + " is missing";
		}
	}
}

/*
 * Parse each NODE
 * Called by parseNodes
 * @param node
 */
LSXSceneGraph.prototype.parseNode = function(node) {
	//Id of node
	var id = this.reader.getString(node, "id");
	console.log(id);
	if (id in this.leaves)
		return "Copy id leaf " + id;
	if (id in this.nodes)
		return "Copy id node " + id;
	
	this.nodes[id] = new Node(id);

	//Get NODE MATERIAL
	var childNode = node.children[0];
	if (childNode.nodeName != "MATERIAL")
		return "Expected MATERIAL in NODE " + id + "in 1st child.";
	var material = this.reader.getString(childNode, "id");
	
	if(!(material in this.materials) && material != "null")
		return "No MATERIAL " + material +  " for NODE " + id;
	this.nodes[id].setMaterial(material);

	//Get NODE TEXTURE
	childNode = node.children[1];
	if (childNode.nodeName != "TEXTURE")
		return "Expected TEXTURE in NODE " + id + "in 2nd child.";
	var texture = this.reader.getString(childNode, "id");
	
	if(!(texture in this.textures) && texture != "null" && texture != "clear")
		return "No TEXTURE " + texture +  " for NODE " + id;
	
	this.nodes[id].setTexture(texture);

	//Get Local Transformations of Node - OPTIONAL
	for (var i = 2; i < node.children.length - 1; ++i) {
		var transformation = node.children[i];
		var type = transformation.nodeName;
		switch (type) {
			case "ROTATION":
				var axis = this.reader.getString(transformation, "axis");
				var angle = this.reader.getFloat(transformation, "angle");
					switch (axis) {
						 
						case "x":
							this.nodes[id].rotateX(angle * deg2rad);
							break;
						case "y":
							this.nodes[id].rotateY(angle * deg2rad);
							break;
						case "z":
							this.nodes[id].rotateZ(angle *deg2rad);
							break;
						default:
							return "Unknown rotation axis: " + axis;
					}
				break;
			case "SCALE":
				var sx = this.reader.getFloat(transformation, "sx");
				var sy = this.reader.getFloat(transformation, "sy");
				var sz = this.reader.getFloat(transformation, "sz");
				this.nodes[id].scale(sx, sy, sz);
				break;
			case "TRANSLATION":
				var x = this.reader.getFloat(transformation, "x");
				var y = this.reader.getFloat(transformation, "y");
				var z = this.reader.getFloat(transformation, "z");
				this.nodes[id].translate(x, y, z);
				break;
				
			case "ANIMATIONREF":
				var idA = this.reader.getString(transformation, "id");
				this.nodes[id].addAnimation(this.animations[idA]);
				break;
			default:
				return "Unknown transformation/animation: " + type;
		}
	}

	//Get children of NODE
	var new_children = node.children[node.children.length - 1];
	if (new_children.nodeName != "DESCENDANTS")
		return "Expected DESCENDANTS tag in NODE " + id;

	if (new_children.children.length == 0)
		return "NODE " + id + " as no descendants";

	for (var i = 0; i < new_children.children.length; ++i) {
		var new_child = this.reader.getString(new_children.children[i], "id");
		this.nodes[id].addChild(new_child);
	}
}
	
/*
 * Callback to be executed on any read error
 */
LSXSceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};