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
	
	this.views = new Views();
    this.illumination = new Illumination();
    this.lights = [];
    this.textures = [];
    this.materials = [];
	this.transformationsMap = {};
    this.leaves = [];
    this.components = [];


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
	
	this.axisLength = this.reader.getFloat(sceneInfo[0], 'axis_length');
	this.localTransformations = mat4.create();
	mat4.identity(this.localTransformations);
	
	if(this.root == null){
		return "root id is missing."
	}
	
	if(this.axisLength == null){
		return "axis length is missing."
	}
	
	
	/* TODO: Faltam fazer a parte das vistas */
	

	console.log("*******VIEWS*******");
    var error = this.parseViews(rootElement);
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
	
	console.log("*******TRANSFORMATIONS*******");
    error = this.parseTransformations(rootElement);
    if (error) {
        return error;
    }

	console.log("*******PRIMITIVES*******");
    error = this.parsePrimitives(rootElement);
    if (error) {
        return error;
    }

	console.log("*******COMPONENTS*******");
    error = this.parseComponents(rootElement);
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
LSXSceneGraph.prototype.parseViews = function(rootElement) {
	var tempViews =  rootElement.getElementsByTagName("views");
	if (tempViews == null) {
		return "views element is missing.";
	}

	if (tempViews.length != 1) {
		return "only one views is allowed.";
	}
	//Get views - perspective

	var perspectives = tempViews[0];
	
	var def = this.reader.getString(perspectives, "default");
	
	//testa se existe pelo menos uma perspetiva
	if (perspectives.children == null || perspectives.children.length < 1)
		return "There should be at least one perspective"

	//adicionar todas as perspetivas
	for (var i = 0; i < perspectives.children.length; i++){
		var perspective = perspectives.children[i];
		var id = this.reader.getString(perspective, "id");
		if (id == null)
			return "perspective without id.";
		
		var near = this.reader.getFloat(perspective, "near");
		var far = this.reader.getFloat(perspective, "far");
		var angle = this.reader.getFloat(perspective, "angle");
		
		if (perspective.children.length != 2)
			return "Wrong perspective type found in view " + id;
		
		var from_child = perspective.children[0];
		var to_child = perspective.children[1];
		
		var x_from = this.reader.getFloat(from_child, "x");
		var y_from = this.reader.getFloat(from_child, "y");
		var z_from = this.reader.getFloat(from_child, "z");
		
		var x_to = this.reader.getFloat(to_child, "x");
		var y_to = this.reader.getFloat(to_child, "y");
		var z_to = this.reader.getFloat(to_child, "z");
		
		//ar newPerspective = new Views(id,angle,near,far,x_from,y_from,z_from,x_to,y_to,z_to);
		
		this.views.addView(this.scene, i,angle,near,far,x_from,y_from,z_from,x_to,y_to,z_to);
		
		if (id == def)
			this.views.setDefault(i);
		console.log("Added view " + id);
		
	}
	
	if (this.views.getDefault == null)
		return "No default view detected";
	
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
	
	//verifica se existe mais alguma luz para além das 2 categorias
	if (omniLights.length + spotLights.length != lights.children.length)
		return "There should be only 'omni' or 'spot' lights";
	
	//adicionar todas as omni lights
	for (var i = 0; i < omniLights.length; i++){
		var omniLight = omniLights[i];
		var id = this.reader.getString(omniLight, "id");
		if (id == null)
			return "LIGHT without id.";
		
		//TODO: falta verificar se existem ids repetidos
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
		//data = [];
		data = this.reader.getRGBA(omniLight.children[1]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(omniLight.children[2]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(omniLight.children[3]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
	
	//adicionar todas as spot lights
	for (; i < spotLights.length + omniLights.length; i++){
		console.log('-------> id AAAAAA' + i);
		var spotlight = spotLights[i - omniLights.length];
		var id = this.reader.getString(spotlight, "id");
		if (id == null)
			return "LIGHT without id.";
		
		//TODO: falta verificar se existem ids repetidos
		
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
		this.lights[i].setPosition(data[0], data[1], data[2], 1); //value of w = 1

		//components of spotlight
		data = [];
		data = this.reader.getRGBA(spotlight.children[2]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(spotlight.children[3]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);

		data = this.reader.getRGBA(spotlight.children[4]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
		
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
    var tempMat =  rootElement.querySelectorAll("dsx > materials");

	if (tempMat == null) {
		return "materials is missing.";
	}

	/*if (tempMat.length != 1) {
		return "Only one materials is allowed.";
	}*/

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
	
}


LSXSceneGraph.prototype.parseTransformations = function(rootElement) {
	
	var tempTransformations =  rootElement.getElementsByTagName("transformations");
	
	if (tempTransformations == null) {
		return "transformations is missing.";
	}

	if (tempTransformations.length != 1) {
		return "Only one transformations is allowed.";
	}
	
	var transformations = tempTransformations[0];

	allTransformations = transformations.getElementsByTagName("transformation");

	if (allTransformations == null) {
		return "transformation in transformations missing";
	}
	if (allTransformations.length == 0) {
		return "No transformation found.";
	}
	
	for (var i = 0; i < allTransformations.length; ++i) {
		var transformationGroup = allTransformations[i];
		if (transformationGroup == null) {
			return "transformationGroup in transformations missing";
		}
		if (transformationGroup.length == 0) {
			return "No transformationGroup found.";
		}
		if (transformationGroup.children.length == 0) {
			return "No transformation found.";
		}
		var id = this.reader.getString(transformationGroup, "id");
		
		if (this.transformationsMap.hasOwnProperty(id))
			return "The transformation " + id + " is repeated.";
		
		console.log("Found Transformation " + id);
		
		var trans =  mat4.create();
		mat4.identity(trans);
		
		for (var j = 0; j < transformationGroup.children.length; ++j) {
			var transformation = transformationGroup.children[j];
			
			if (transformation == null) {
				return "transformation in transformationGroup missing";
			}
			
			var type = transformation.tagName;
			
			switch (type){
				case "translate":
					var tx = this.reader.getFloat(transformation, "x");
					var ty = this.reader.getFloat(transformation, "y");
					var tz = this.reader.getFloat(transformation, "z");
					
					mat4.translate(trans, trans, vec3.fromValues(tx, ty, tz));
					
					console.log(id + " - Added translate transformation");
					break;
				case "rotate":
					var axis = this.reader.getString(transformation, "axis");
					var angle = this.reader.getFloat(transformation, "angle");
					
					switch (axis){
						case "x":
							//fall through
						case "X":
							 mat4.rotateX(trans, trans, angle*deg2rad);
							break;
						case "y":
							//fall through
						case "Y":
							mat4.rotateY(trans, trans, angle*deg2rad);
							break;
						case "z":
							//fall through
						case "Z":
							mat4.rotateZ(trans, trans, angle*deg2rad);
							break;
						default:
							return "Wrong axis detected in transformation id: " + id;
					}
					console.log(id + " - Added rotate transformation");
					break;
				case "scale":
				
					var sx = this.reader.getFloat(transformation, "x");
					var sy = this.reader.getFloat(transformation, "y");
					var sz = this.reader.getFloat(transformation, "z");
					
					mat4.scale(trans, trans, vec3.fromValues(sx,sy,sz));
					console.log(id + " - Added scale transformation");
					break;
				
				default:
					return "Wrong type of transformation in id " + id;
			}
			
		}
		
		this.transformationsMap[id] = trans; // add transformation matrix to map
		
	}
}

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag primitives from LSX - sets all primitives for the scene
 */
LSXSceneGraph.prototype.parsePrimitives = function(rootElement) {
	//Get primitives - primitives to be drawn
    var tempLeaves =  rootElement.getElementsByTagName("primitives");
	if (tempLeaves == null) {
		return "primitives is missing.";
	}

	if (tempLeaves.length != 1) {
		return "Only one primitives is allowed.";
	}

	var leaves = tempLeaves[0];

	allLeaf = leaves.getElementsByTagName("primitive");

	if (allLeaf == null) {
		return "primitive in primitives missing";
	}
	if (allLeaf.length == 0) {
		return "No primitive found."
	}

	//Get each leaf
	for (var i = 0; i < allLeaf.length; ++i) {
		var leaf = allLeaf[i]
		var id = this.reader.getString(leaf, "id");
		if (id in this.leaves)
			return "Duplicate primitive id: " + id;

		if(leaf.children.length != 1)
			return "Only one type of primitive allowed in primitive id: " + id;
		
	
		var type = leaf.children[0].tagName

		console.log('no id ' + id);
		//Different types of primitives
		switch (type) {
			case "rectangle":
			
				var data = [];
		
				data.push(this.reader.getFloat(leaf.children[0], "x1"));
				data.push(this.reader.getFloat(leaf.children[0], "y1"));
				data.push(this.reader.getFloat(leaf.children[0], "x2"));
				data.push(this.reader.getFloat(leaf.children[0], "y2"));
	
				if (data == null)
					return "rectangle with error " + id; 
				
				this.leaves[id] = new LeafRectangle(id, data[0], data[1], data[2], data[3]);
				break;
				
			case "cylinder":
			
				var data = [];
		
				data.push(this.reader.getFloat(leaf.children[0], "base"));
				data.push(this.reader.getFloat(leaf.children[0], "top"));
				data.push(this.reader.getFloat(leaf.children[0], "height"));
				data.push(this.reader.getInteger(leaf.children[0], "slices"));
				data.push(this.reader.getInteger(leaf.children[0], "stacks"));
				
				if (data == null)
					return "cylinder with error " + id;
				if(data[3] % 1 != 0  || data[4] % 1 != 0 )
					return "cylinder " + id + " 4th/5th arg must be integer.";
				this.leaves[id] = new LeafCylinder(id, data[0], data[1], data[2], data[3], data[4]);
				break;
			
			case "sphere":
				
				var data = [];
		
				data.push(this.reader.getFloat(leaf.children[0], "radius"));
				data.push(this.reader.getInteger(leaf.children[0], "slices"));
				data.push(this.reader.getInteger(leaf.children[0], "stacks"));
				
				if (data == null)
					return "sphere with error " + id;
				if(data[1] % 1 != 0  || data[2] % 1 != 0 )
					return "sphere " + id + " 2nd/3rd arg must be integer.";
				this.leaves[id] = new LeafSphere(id, data[0], data[1], data[2]);
				break;
			
			case "triangle":
				
				var data = [];
		
				data.push(this.reader.getFloat(leaf.children[0], "x1"));
				data.push(this.reader.getFloat(leaf.children[0], "y1"));
				data.push(this.reader.getFloat(leaf.children[0], "z1"));
				data.push(this.reader.getFloat(leaf.children[0], "x2"));
				data.push(this.reader.getFloat(leaf.children[0], "y2"));
				data.push(this.reader.getFloat(leaf.children[0], "z2"));
				data.push(this.reader.getFloat(leaf.children[0], "x3"));
				data.push(this.reader.getFloat(leaf.children[0], "y3"));
				data.push(this.reader.getFloat(leaf.children[0], "z3"));
				
				if (data == null)
					return "triangle with error" + id;
				this.leaves[id] = new LeafTriangle(id, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
				break;
			
			case "torus":
			
				var data = [];
		
				data.push(this.reader.getFloat(leaf.children[0], "inner"));
				data.push(this.reader.getFloat(leaf.children[0], "outer"));
				data.push(this.reader.getInteger(leaf.children[0], "slices"));
				data.push(this.reader.getInteger(leaf.children[0], "loops"));
			
				//TODO
				console.log("Falta fazer\n");
				break;
			default:
				return "Leaf type unknown: " + type;
		}
	}
}

/*
 *@param rootElement SCENE tag from LSX
 * Parse tag components from LSX
 */
LSXSceneGraph.prototype.parseComponents = function(rootElement) {
	//Get components
    var tempComponents =  rootElement.getElementsByTagName("components");
	if (tempComponents == null) {
		return "components is missing.";
	}

	if (tempComponents.length != 1) {
		return "Only one components is allowed";
	}

	var components = tempComponents[0];
	

	tempComponent = components.getElementsByTagName("component");

	if (tempComponent == null) {
		return "component in components missing";
	}
	if (tempComponent.length == 0) {
		return "No component found."
	}

	for (var i = 0; i < tempComponent.length; ++i) {
		var component = tempComponent[i];

		error = this.parseComponent(component);
		if (error)
			return error;
	}

	if (!(this.root in this.components))
		return "component with root id missing";

	for (key in this.components) {
		for (var i = 0; i < this.components[key].children.length; ++i) {
			var child = this.components[key].children[i];
			if (!((child in this.components) || (child in this.leaves)))
				return "Child " + child + " is missing";
		}
	}
}

/*
 *@param component
 * Parse each component
 * Called by parseComponents
 */
LSXSceneGraph.prototype.parseComponent = function(component) {
	//Id of component
	var id = this.reader.getString(component, "id");
	console.log("Found component " + id);
	if (id in this.leaves)
		return "Duplicate primitive id " + id;
	if (id in this.components)
		return "Duplicate component id " + id;
	
	this.components[id] = new Node(id);
	
	//Get NODE Transformation
	
	var childNode = component.children[0];
	if (childNode.nodeName != "transformation")
		return "Expected transformation in component " + id + " in 1st child.";
	for (var i=0;i<childNode.children.length;i++){
		var transformation = childNode.children[i];
		
		switch (transformation.nodeName) {
			case "transformationref":
				var transformationId = this.reader.getString(transformation, "id");
				if (transformationId in this.transformationsMap){
					this.components[id].multMatrix(this.transformationsMap[transformationId]);
				}
				break;
			case "rotate":
				var axis = this.reader.getString(transformation, "axis");
				var angle = this.reader.getFloat(transformation, "angle");
					switch (axis) {
						 
						case "x":
							this.components[id].rotateX(angle * deg2rad);
							break;
						case "y":
							this.components[id].rotateY(angle * deg2rad);
							break;
						case "z":
							this.components[id].rotateZ(angle *deg2rad);
							break;
						default:
							return "Unknown rotation axis: " + axis;
					}
				break;
			case "scale":
				var sx = this.reader.getFloat(transformation, "x");
				var sy = this.reader.getFloat(transformation, "y");
				var sz = this.reader.getFloat(transformation, "z");
				this.components[id].scale(sx, sy, sz);
				break;
			case "translate":
				var x = this.reader.getFloat(transformation, "x");
				var y = this.reader.getFloat(transformation, "y");
				var z = this.reader.getFloat(transformation, "z");
				this.components[id].translate(x, y, z);
				break;
			default:
				return "Wrong transformation found in component id " + id;
		}
	}
	//Get NODE MATERIAL
	childNode = component.children[1];
	if (childNode.nodeName != "materials")
		return "Expected materials in component " + id + " in 2nd child.";
	
	for (var i=0;i<childNode.children.length;i++){
		var material = childNode.children[i];
		var materialId = this.reader.getString(material, "id");
	
		if(!(materialId in this.materials) && materialId != "null")
			return "No material " + materialId +  " for component " + id;
		this.components[id].addMaterial(materialId);
	}
	
	//to set first material from list
	var material = childNode.children[0];
	var materialId = this.reader.getString(material, "id");
	this.components[id].setMaterial(materialId)
	

	//Get NODE TEXTURE
	childNode = component.children[2];
	if (childNode.nodeName != "texture")
		return "Expected texture in component " + id + " in 3rd child.";
	var texture = this.reader.getString(childNode, "id");
	
	if(!(texture in this.textures) && texture != "null" && texture != "clear")
		return "No texture " + texture +  " for component " + id;
	
	this.components[id].setTexture(texture);

	
	//Get children of NODE
	var new_children = component.children[component.children.length - 1];
	if (new_children.nodeName != "children")
		return "Expected children tag in component " + id;

	if (new_children.children.length == 0)
		return "component " + id + " has no descendants";

	for (var i = 0; i < new_children.children.length; ++i) {
		var new_child = new_children.children[i];
		
		if (new_child.nodeName != "componentref" && new_child.nodeName != "primitiveref" )
			return "Wrong children type found for component " + id;
		var new_childId = this.reader.getString(new_child, "id");
		this.components[id].addChild(new_childId);
	}
	
}
	
/*
 * Callback to be executed on any read error
 */
 
LSXSceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

function multiplyMatrix(list) {
	var result = list[0];
	if (list.length < 2)
		return result;
	
	for(var k=1;k<list.length;k++){
		var matrix = result;
		result = [];
		var matrixToMultiply = list[k];
		var temp = [];
		for (var i=0;i<matrix.length;i=i+4){
			for (var j=0;j<4;j++){
				var element = matrix[i] * matrixToMultiply[j] +
						matrix[i+1] * matrixToMultiply[j+4] +
						matrix[i+2] * matrixToMultiply[j+8] + 
						matrix[i+3] * matrixToMultiply[j+12];
				temp.push(element);
			}
		}	
		result = result.concat(temp);
	}
	
	/*for (var k=0;k<result.length;k++){
		console.log("k " + k + " = " + result[k]);
	}*/
	return result;
}
