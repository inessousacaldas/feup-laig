//Constant to convert degrees in radians
deg2rad = Math.PI / 180
/*
 * LSXSceneGraph
 * @constructor 
 * @param filename filename of the scene
 * @param CGFscene object
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
 *@param rootElement SCENE tag from LSX
 * Parser of the LSX file
 */
LSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "dsx") {
        return "Not a DSX file";
    }
	console.log(rootElement.children[0].nodeName);

	//Get scene root and axis length
	var sceneInfo = rootElement.getElementsByTagName('scene');
	
	if(sceneInfo == null){
		return "scene element is missing."
	}
	
	if(sceneInfo.length =! 1){
		return "only one scene element is required."
	}
	
	this.root = this.reader.getString(sceneInfo[0], 'root');
	
	if(this.root == null){
		return "root id is missing."
	}
	
	
	//Get INITIALS - reference -> reference length of axis
    var refTemp = this.reader.getFloat(sceneInfo[0], "axis_length");
	if (refTemp == null) {
	    return "reference in scene is missing.";
	}

	this.initials.referenceLength = refTemp;
	
	
	/* TODO: Faltam fazer a parte das vistas */
	

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

	/* TODO: Fazer as luzes - omni e spot*/
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

	console.log("*******NODES*******");
    error = this.parseNodes(rootElement);
    if (error) {
        return error;
    }

	console.log("**************");

    this.loadedOk = true;
}


/*
 *@param rootElement SCENE tag from LSX
 * Parse tag INITIALS from LSX
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


};

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag ILLUMINATION from LSX
 */
LSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	
	//Get ILLUMINATION
	var tempIllum =  rootElement.getElementsByTagName("illumination");
	if (tempIllum == null) {
		return "illumination is missing.";
	}

	if (tempIllum.length != 1) {
		return "only one illumination is allowed.";
	}

	var illumination = tempIllum[0];
	
	/* TODO: Ver o que faz doublesided e local */
	var doublesided = this.reader.getInteger(illumination, "doublesided");
	
	if(doublesided == null){
		return "doublesided value in illumination is missing.";
	}
	
	if(doublesided != 0 && doublesided != 1){
		return "doublesided value in illumination is wrong.";
	}
	
	var local = this.reader.getInteger(illumination, "local");
	
	if(local == null){
		return "local value in illumination is missing.";
	}
	
	if(local != 0 && local != 1){
		return "local value in illumination is wrong."
	}

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
 *@param rootElement SCENE tag from LSX
 * Parse tag LIGHTS from LSX
 */
LSXSceneGraph.prototype.parseLights = function(rootElement) {
	//Get LIGHTS
    var tempLights =  rootElement.getElementsByTagName("lights");
	if (tempLights == null) {
		return "lights element is missing.";
	}

	if (tempLights.length != 1) {
		return "only one lights is allowed.";
	}
	//Get LIGHTS - LIGHT

	var lights = tempLights[0];
	
	//testa se existe pelo menos uma luz
	if (lights.children == null || lights.children.length < 1)
		return "There should be at least one light"

	//divide as luzes pelas 2 categorias
	var omniLights = lights.getElementsByTagName("omni");
	var spotLights = lights.getElementsByTagName("spot");
	//console.log("AHHHHHHHHHHHHH omni size:" + omniLights.length);
	//console.log("AHHHHHHHHHHHHH spot size:" + spotLights.length);
	
	//verifica se existe mais alguma luz para além das 2 categorias
	if (omniLights.length + spotLights.length != lights.children.length)
		return "There should be only 'omni' or 'spot' lights";
	
	//adicionar todas as omni lights
	for (var i = 0; i <omniLights.length; i++){
		var omniLight = omniLights[i];
		var id = this.reader.getString(omniLight, "id");
		if (id == null)
			return "LIGHT without id.";
		
		//falta verificar se existem ids repetidos
		
		this.lights.push(new Light(this.scene, i, id));
		
		var enable = this.reader.getBoolean(omniLight, "enabled");
		if (enable)
			this.lights[i].enable();
		else
			this.lights[i].disable();
		
		var data = [];
		
		//position of omniLight
		data.push(this.reader.getFloat(omniLight.children[0], "x"));
		data.push(this.reader.getFloat(omniLight.children[0], "y"));
		data.push(this.reader.getFloat(omniLight.children[0], "z"));
		data.push(this.reader.getFloat(omniLight.children[0], "w"));
		this.lights[i].setPosition(data[0], data[1], data[2], data[3]);

		//components of omniLight
		data = this.reader.getRGBA(omniLight.children[1]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(omniLight.children[2]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(omniLight.children[3]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
	
	//adicionar todas as spot lights
	for (var i = 0; i <spotLights.length; i++){
		var spotlight = spotLights[i];
		var id = this.reader.getString(spotlight, "id");
		if (id == null)
			return "LIGHT without id.";
		
		//falta verificar se existem ids repetidos
		
		this.lights.push(new Light(this.scene, i, id));
		
		var enable = this.reader.getBoolean(spotlight, "enabled");
		if (enable)
			this.lights[i].enable();
		else
			this.lights[i].disable();
		
		var angle = this.reader.getFloat(spotlight, "angle");
		var exponent = this.reader.getFloat(spotlight, "exponent");
		
		this.lights[i].setSpotCutOff(angle); //nao tenho a certeza que seja este
		this.lights[i].setSpotExponent(exponent);
		
		var data = [];
		
		//target of spotlight
		data.push(this.reader.getFloat(spotlight.children[0], "x"));
		data.push(this.reader.getFloat(spotlight.children[0], "y"));
		data.push(this.reader.getFloat(spotlight.children[0], "z"));
		this.lights[i].setSpotDirection(data[0], data[1], data[2]); //target é diferente de direction?
		
		//position of spotlight
		data = [];
		data.push(this.reader.getFloat(spotlight.children[1], "x"));
		data.push(this.reader.getFloat(spotlight.children[1], "y"));
		data.push(this.reader.getFloat(spotlight.children[1], "z"));
		//erro no exemplo de dsx? não existe componente "w", mas a função
		//setPosition() precisa de "w"
		data.push(this.reader.getFloat(spotlight.children[1], "w"));
		this.lights[i].setPosition(data[0], data[1], data[2], data[3]);

		//components of spotlight
		data = this.reader.getRGBA(spotlight.children[2]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(spotlight.children[3]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(spotlight.children[4]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
	
	/*
	<lights>
    
        <!-- Deve existir um ou mais blocos "omni" ou "spot" -->
        <!-- Os identificadores "id" nao podem ser repetidos -->
        <omni id="ss" enabled="tt" >
            <location x="ff" y="ff" z="ff" w="ff" />
            <ambient r="ff" g="ff" b="ff" a="ff" />
            <diffuse r="ff" g="ff" b="ff" a="ff" />
            <specular r="ff" g="ff" b="ff" a="ff" />
        </omni>
        
        <spot id="ss" enabled="tt" angle="ff" exponent="ff">
            <!-- atencao, "target" e' diferente de "direction" -->
            <target x="ff" y="ff" z="ff" />
            <location x="ff" y="ff" z="ff" />
            <ambient r="ff" g="ff" b="ff" a="ff" />
            <diffuse r="ff" g="ff" b="ff" a="ff" />
            <specular r="ff" g="ff" b="ff" a="ff" />
        </spot>
    </lights>
	*/
	
}

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag TEXTURES from LSX
 */
LSXSceneGraph.prototype.parseTextures = function(rootElement) {
	//Get TEXTURES
    var tempText =  rootElement.getElementsByTagName("textures");
	
	if (tempText == null) {
		return "textures is missing.";
	}

	if (tempText.length != 1) {
		return "Only one textures is allowed.";
	}

	var textures = tempText[0];

	
	texture = textures.getElementsByTagName("texture");

	if (texture == null || texture.length < 1){
		return "texture in textures missing.";
	}
	
	//Relative path to file with textures (images)
	var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));

	for (var i = 0; i < texture.length; ++i) {
		var NewTexture = texture[i];
		var id = this.reader.getString(NewTexture, "id");

		if (id in this.textures)
			return "Duplicate texture id: " + id;
		
		var path = pathRel + '/' + this.reader.getString(NewTexture, "file");
		var s = this.reader.getFloat(NewTexture, "length_s");
		var t = this.reader.getFloat(NewTexture, "length_t");
		this.textures[id] = new Texture(this.scene, path, id);
		this.textures[id].setAmplifyFactor(s,t);
	}
}


/*
 *@param rootElement SCENE tag from DSX
 * Parse tag materials from DSX
 */
LSXSceneGraph.prototype.parseMaterials = function(rootElement) {
	//Get materials
    var tempMat =  rootElement.getElementsByTagName("materials");
	if (tempMat == null) {
		return "materials is missing.";
	}

	if (tempMat.length != 1) {
		return "Only one materials is allowed.";
	}

	var materials = tempMat[0];
	
	if (materials.children == null || materials.children.length < 1){
		return "material in materials missing.";
	}
	//Get each material
	for(var i = 0; i < materials.children.length; ++i){
		var material = materials.children[i];
		var id = this.reader.getString(material,"id");
		if (id in this.materials)
			return "Duplicate material id: " + id;

		this.materials[id] = new Material(this.scene,id);
				
		var data = this.reader.getRGBA(material.children[0]);
		this.materials[id].setEmission(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[1]);
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[2]);
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
		data = this.reader.getRGBA(material.children[3]);
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
		var shininess = this.reader.getFloat(material.children[4],"value");
		this.materials[id].setShininess(shininess);
	}
	
	/*<materials>
    
        <!-- Deve existir um ou mais blocos "material" -->
        <!-- Os identificadores "id" nao podem ser repetidos -->
        <material id="ss" >
            <emission r="ff" g="ff" b="ff" a="ff" />
            <ambient r="ff" g="ff" b="ff" a="ff" />
            <diffuse r="ff" g="ff" b="ff" a="ff" />
            <specular r="ff" g="ff" b="ff" a="ff" />
            <shininess value="ff" />
        </material>
        
    </materials>*/
}

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag LEAVES from LSX - sets all primitives for the scene
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
			default:
				return "Leaf type unknown: " + type;
		}
	}
}

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag NODES from LSX
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
 *@param node
 * Parse each NODE
 * Called by parseNodes
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
			default:
				return "Unknown transformation: " + type;
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