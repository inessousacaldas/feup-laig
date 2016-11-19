//Constant to convert degrees in radians
deg2rad = Math.PI / 180
/*
 * DSXSceneGraph
 * @constructor 
 * @param filename filename of the scene
 * @param CGFscene object
*/
function DSXSceneGraph(filename, scene) {
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
    this.animations = [];
    this.components = [];


	this.scene = scene;
	scene.graph=this;
		
	//File reader
	this.reader = new DSXReader();


	//Reads content of filename. Returns message erros in case of fail
	this.reader.open(this.filename, this);  
}

/*
 * Function called if the XML was sucessful read
 */
DSXSceneGraph.prototype.onXMLReady=function() 
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
 *@param rootElement SCENE tag from DSX
 * Parser of the DSX file
 */
DSXSceneGraph.prototype.parseSceneGraph = function(rootElement) {


    if (rootElement.nodeName != "dsx") {
        return "Not a DSX file";
    }
	console.log(rootElement.children[0].nodeName);

	//Get scene root and axis length
	var sceneInfo = rootElement.getElementsByTagName('scene');
	
	if(sceneInfo == null){
		return "scene element is missing."
	}
	
	if(sceneInfo.length != 1){
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
	
	var validated = validateOrder(rootElement);
	if (validated != 1)
		return validated;
	

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

    console.log("*******ANIMATIONS*******");
    error = this.parseAnimations(rootElement);
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
 *@param rootElement SCENE tag from DSX
 * Parse tag VIEWS from DSX
 */
DSXSceneGraph.prototype.parseViews = function(rootElement) {
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
	
	if (def == null)
		return "default element is missing";
	
	//testa se existe pelo menos uma perspetiva
	if (perspectives.children == null || perspectives.children.length < 1)
		return "There should be at least one perspective"

	//adicionar todas as perspetivas
	for (var i = 0; i < perspectives.children.length; i++){
		var perspective = perspectives.children[i];
		var id = this.reader.getString(perspective, "id");
		if (id == null)
			return "perspective without id.";
		
		for (var j = 0;j<this.views.views.length;j++){
			if (id == this.views.views[j].id)
				return "View with id " + id + " repeated";
		}
		
		var near = this.reader.getFloat(perspective, "near");
		
		if (near == null)
			return "near element missing in view " + id;
		
		var far = this.reader.getFloat(perspective, "far");
		
		if (far == null)
			return "far element missing in view " + id;
		
		var angle = this.reader.getFloat(perspective, "angle");
		
		if (angle == null)
			return "angle element missing in view " + id;
		
		
		if (perspective.children.length != 2)
			return "Wrong perspective type found in view " + id;
		
		var from_child = perspective.children[0];
		var to_child = perspective.children[1];
		
		var x_from = this.reader.getFloat(from_child, "x");
		var y_from = this.reader.getFloat(from_child, "y");
		var z_from = this.reader.getFloat(from_child, "z");
		
		if (x_from == null || y_from == null || z_from == null)
			return "From elements missing in view " + id;
		
		var x_to = this.reader.getFloat(to_child, "x");
		var y_to = this.reader.getFloat(to_child, "y");
		var z_to = this.reader.getFloat(to_child, "z");
		
		if (x_to == null || y_to == null || z_to == null)
			return "To elements missing in view " + id;
		
		this.views.addView(id,near,far,angle*deg2rad,x_from,y_from,z_from,x_to,y_to,z_to);
		
		if (id == def)
			this.views.setDefault(i);
		console.log("Added view " + id);
		
	}
	var foundDefault = false;
	
	for (var j = 0;j<this.views.views.length;j++){
		if (def == this.views.views[j].id)
			foundDefault = true;
	}
	
	if (!foundDefault)
		return "No default view detected";
	
};

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag ILLUMINATION from DSX
 */
DSXSceneGraph.prototype.parseIllumination = function(rootElement) {
	
	//Get ILLUMINATION
	var tempIllum =  rootElement.getElementsByTagName("illumination");
	if (tempIllum == null) {
		return "illumination is missing.";
	}

	if (tempIllum.length != 1) {
		return "only one illumination is allowed.";
	}

	var illumination = tempIllum[0];
	
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
 *@param rootElement SCENE tag from DSX
 * Parse tag LIGHTS from DSX
 */
DSXSceneGraph.prototype.parseLights = function(rootElement) {
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
		return "There should be at least one light";

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
		
		for (var j = 0;j<this.lights.length;j++){
			if (id == this.lights[j].name)
				return "Light with id " + id + " repeated";
		}
		
		
		this.lights.push(new Light(this.scene, i, id));
		
		var enable = this.reader.getBoolean(omniLight, "enabled");
		if (enable)
			this.lights[i].enable();
		else
			this.lights[i].disable();
		
		var data = [];
		
		//position of omniLight
		var position = omniLight.getElementsByTagName('position');
		
		if (position == null || position.length == 0)
			return "Position missing in omnilight id: " + id;
		
		if (position.length != 1)
			return "Duplicate position in omnilight id: " + id;
		
		
		data.push(this.reader.getFloat(position[0], "x"));
		data.push(this.reader.getFloat(position[0], "y"));
		data.push(this.reader.getFloat(position[0], "z"));
		data.push(this.reader.getFloat(position[0], "w"));
		
		if (data[0] == null || data[1] == null || data[2] == null || data[3] == null)
			return "Light position elements missing in id " + id;
		
		this.lights[i].setPosition(data[0], data[1], data[2], data[3]);

		//components of omniLight
		
		//Ambient
		var ambient = omniLight.getElementsByTagName('ambient');
		
		if (ambient == null || ambient.length == 0)
			return "Ambient missing in omnilight id: " + id;
		
		if (ambient.length != 1)
			return "Duplicate ambient in omniling id: " + id;
		
		
		var data = this.reader.getRGBA(ambient[0]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);
	
		//Diffuse
		var diffuse = omniLight.getElementsByTagName('diffuse');
		
		if (diffuse == null || diffuse.length == 0)
			return "Diffuse missing in omnilight id: " + id;
		
		if (diffuse.length != 1)
			return "Duplicate diffuse in omniling id: " + id;
		
		
		var data = this.reader.getRGBA(diffuse[0]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);
		
		//Specular
		var specular = omniLight.getElementsByTagName('specular');
		
		if (specular == null || specular.length == 0)
			return "Specular missing in omnilight id: " + id;
		
		if (specular.length != 1)
			return "Duplicate specular in omniling id: " + id;
		
		
		var data = this.reader.getRGBA(specular[0]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
	
	//adicionar todas as spot lights
	for (; i < spotLights.length + omniLights.length; i++){
		var spotlight = spotLights[i - omniLights.length];
		var id = this.reader.getString(spotlight, "id");
		if (id == null)
			return "LIGHT without id.";
		
		for (var j = 0;j<this.lights.length;j++){
			if (id == this.lights[j].name)
				return "Light with id " + id + " repeated";
		}
		
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
		
		
		//target of spotlight
		var target = spotlight.getElementsByTagName('target');
		
		if (target == null || target.length == 0)
			return "Target missing in spotlight id: " + id;
		
		if (target.length != 1)
			return "Duplicate target in spotlight id: " + id;
		
		data = [];
		data.push(this.reader.getFloat(target[0], "x"));
		data.push(this.reader.getFloat(target[0], "y"));
		data.push(this.reader.getFloat(target[0], "z"));
		

		
		
		this.lights[i].setSpotDirection(data[0], data[1], data[2]);
		
	
		
		//location of spotlight
		var location = spotlight.getElementsByTagName('location');
		
		if (location == null || location.length == 0)
			return "Location missing in spotlight id: " + id;
		
		if (location.length != 1)
			return "Duplicate location in spotlight id: " + id;
		
		data = [];
		data.push(this.reader.getFloat(location[0], "x"));
		data.push(this.reader.getFloat(location[0], "y"));
		data.push(this.reader.getFloat(location[0], "z"));
	
		if (data[0] == null || data[1] == null || data[2] == null)
			return "SpotLight location elements missing in id " + id;
		
		this.lights[i].setPosition(data[0], data[1], data[2], 1); //value of w = 1

		
		//Ambient
		var ambient = spotlight.getElementsByTagName('ambient');
		
		if (ambient == null || ambient.length == 0)
			return "Ambient missing in omnilight id: " + id;
		
		if (ambient.length != 1)
			return "Duplicate ambient in spotlight id: " + id;
		
		
		var data = this.reader.getRGBA(ambient[0]);
		this.lights[i].setAmbient(data[0], data[1], data[2], data[3]);
	
		//Diffuse
		var diffuse = spotlight.getElementsByTagName('diffuse');
		
		if (diffuse == null || diffuse.length == 0)
			return "Diffuse missing in spotlight id: " + id;
		
		if (diffuse.length != 1)
			return "Duplicate diffuse in spotlight id: " + id;
		
		
		var data = this.reader.getRGBA(diffuse[0]);
		this.lights[i].setDiffuse(data[0], data[1], data[2], data[3]);
		
		//Specular
		var specular = spotlight.getElementsByTagName('specular');
		
		if (specular == null || specular.length == 0)
			return "Specular missing in spotlight id: " + id;
		
		if (specular.length != 1)
			return "Duplicate specular in spotlight id: " + id;
		
		
		var data = this.reader.getRGBA(specular[0]);
		this.lights[i].setSpecular(data[0], data[1], data[2], data[3]);
		
	}
		
}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag TEXTURES from DSX
 */
DSXSceneGraph.prototype.parseTextures = function(rootElement) {
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

		if (id == null)
			return "Id missing in textures";
		
		if (id in this.textures)
			return "Duplicate texture id: " + id;
		
		var path = pathRel + '/' + this.reader.getString(NewTexture, "file");
		var s = this.reader.getFloat(NewTexture, "length_s");
		var t = this.reader.getFloat(NewTexture, "length_t");
		
		if (pathRel == null || path == null || s == null || t == null)
			return "Missing elements in texture id ";
		this.textures[id] = new Texture(this.scene, path, id);
		this.textures[id].setAmplifyFactor(s,t);
	}
}


/*
 *@param rootElement SCENE tag from DSX
 * Parse tag materials from DSX
 */
DSXSceneGraph.prototype.parseMaterials = function(rootElement) {
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
		
		if (id == null)
			return "Id missing in materials";

		this.materials[id] = new Material(this.scene,id);
		material.getElementsByTagName('emission')
		
		//Emission
		var emission = material.getElementsByTagName('emission');
		
		if (emission == null || emission.length == 0)
			return "Emission missing in material id: " + id;
		
		if (emission.length != 1)
			return "Duplicate emission in material id: " + id;
		
		
		var data = this.reader.getRGBA(emission[0]);
		
		this.materials[id].setEmission(data[0],data[1],data[2],data[3]);
		
		//Ambient
		var ambient = material.getElementsByTagName('ambient');
		
		if (ambient == null || ambient.length == 0)
			return "Ambient missing in material id: " + id;
		
		if (ambient.length != 1)
			return "Duplicate ambient in material id: " + id;
			
		data = this.reader.getRGBA(ambient[0]);
		
		this.materials[id].setAmbient(data[0],data[1],data[2],data[3]);
		
		//Diffuse
		var diffuse = material.getElementsByTagName('diffuse');
		
		if (diffuse == null || diffuse.length == 0)
			return "Diffuse missing in material id: " + id;
		
		if (diffuse.length != 1)
			return "Duplicate diffuse in material id: " + id;
		
		data = this.reader.getRGBA(diffuse[0]);
		
		this.materials[id].setDiffuse(data[0],data[1],data[2],data[3]);
		
		//Specular
		var specular = material.getElementsByTagName('specular');
		
		if (specular == null || specular.length == 0)
			return "Specular missing in material id: " + id;
		
		if (specular.length != 1)
			return "Duplicate sepular in material id: " + id;
		
		
		data = this.reader.getRGBA(specular[0]);
		
		this.materials[id].setSpecular(data[0],data[1],data[2],data[3]);
		
		//Shininess
		var shininess = material.getElementsByTagName('shininess');
		
		if (shininess.length != 1)
			return "Duplicate diffuse in material id: " + id;
		
		if (shininess == null)
			return "Specular missing in material id: " + id;
		
		
		var shininessVal = this.reader.getFloat(shininess[0],"value");

		this.materials[id].setShininess(shininessVal);
	}
	
}


DSXSceneGraph.prototype.parseTransformations = function(rootElement) {
	
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
					
					if (tx == null || ty == null || tz == null)
						return "Missing elements in translate transformation " + id;
					
					mat4.translate(trans, trans, vec3.fromValues(tx, ty, tz));
					
					console.log(id + " - Added translate transformation");
					break;
				case "rotate":
					var axis = this.reader.getString(transformation, "axis");
					var angle = this.reader.getFloat(transformation, "angle");
					
					if (axis == null || angle == null)
						return "Missing elements in rotate transformation " + id;
					
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
					
					if (sx == null || sy == null || sz == null)
						return "Missing elements in scale transformation " + id;
					
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
 *@param rootElement SCENE tag from DSX
 * Parse tag primitives from DSX - sets all primitives for the scene
 */
DSXSceneGraph.prototype.parsePrimitives = function(rootElement) {
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

				if (data == null)
					return "torus with error" + id;
				//ativar quando houver torus
				this.leaves[id] = new LeafTorus(id, data[0], data[1], data[2], data[3]);
				break;

            case "plane":

                var data = [];

                data.push(this.reader.getFloat(leaf.children[0], "dimX"));
                data.push(this.reader.getFloat(leaf.children[0], "dimY"));
                data.push(this.reader.getInteger(leaf.children[0], "partsX"));
                data.push(this.reader.getInteger(leaf.children[0], "partsY"));
				console.log(data);
                if (data == null)
                    return "plane with error" + id;
                //ativar quando houver plane
                this.leaves[id] = new LeafPlane(id, data[0], data[1], data[2], data[3]);
                break;

            case "terrain":

                var pathRel = this.filename.substring(0, this.filename.lastIndexOf("/"));
                var texture= pathRel + '/textures/' + this.reader.getString(leaf.children[0], "texture");
                var heightMap = pathRel + '/textures/' + this.reader.getString(leaf.children[0], "heightmap");

                if(texture == null)
                    return "missing texture in terrain " + id;

                if(heightMap == null)
                    return "missing heightmap in terrain " + id;

                //optional
                var height = this.reader.getFloat(leaf.children[0], 'height');
                var dheight = this.reader.getFloat(leaf.children[0], 'dheight');

                if(isNaN(height))
                    return "error height in terrain " + id;

                if(isNaN(dheight))
                    return "error height in terrain " + id;

                this.leaves[id] = new LeafTerrain(id, texture, heightMap, height, dheight);


                break;

            case "vehicle":

                var typeVehicle = this.reader.getString(leaf.children[0], "type");

                if(typeVehicle == null)
                    return "missing type in vehicle " + id;
				switch (typeVehicle){
                    case "balloon":
                        this.leaves[id] = new LeafVehicle(id);
                        break;
                    default:
                        return "Vehicle type unknown: " + typeVehicle;
                        break;

				}
				break;

            case "chessboard":

                var du = this.reader.getInteger(leaf.children[0], "du");

				if(isNaN(du))
					return "Error du in chessboard id: " + id;

                var dv = this.reader.getInteger(leaf.children[0], "dv");

                if(isNaN(dv))
                    return "Error dv in chessboard id: " + id;

                var textureRef = this.reader.getString(leaf.children[0], "textureref");

                if(textureRef == null)
                    return "Error textureref in chessboard id: " + id;

                if(!(textureRef in this.textures))
                    return "Unknown textureref=" + textureRef + " in chessboard id: " + id;

                var su = this.reader.getInteger(leaf.children[0], "su");

                if(isNaN(su))
                    return "Error su in chessboard id: " + id;

                var sv = this.reader.getInteger(leaf.children[0], "sv");

                if(isNaN(sv))
                    return "Error sv in chessboard id: " + id;

				var tempChess = leaf.children[0];

				if(tempChess.children.length != 3)
                    return "The number of colors must be 3 in chessboard id: " + id;

				//Color c1
				var colorTemp = tempChess.getElementsByTagName("c1");

				if(colorTemp == null)
					return "No color c1 in chessboard id: " + id;

                if(colorTemp.length != 1)
                    return "Only one color c1 allowed in chessboard id: " + id;

				var c1 = this.reader.getRGBA(colorTemp[0]);

				//Color c2
                colorTemp = tempChess.getElementsByTagName("c2");

                if(colorTemp == null)
                    return "No color c1 in chessboard id: " + id;

                if(colorTemp.length != 1)
                    return "Only one color c2 allowed in chessboard id: " + id;

                var c2 = this.reader.getRGBA(colorTemp[0]);

                //Color c3
                colorTemp = tempChess.getElementsByTagName("cs");

                if(colorTemp == null)
                    return "No color cs in chessboard id: " + id;

                if(colorTemp.length != 1)
                    return "Only one color cs allowed in chessboard id: " + id;

                var cs = this.reader.getRGBA(colorTemp[0]);

                this.leaves[id] = new LeafChessboard(id, du, dv, this.textures[textureRef], su, sv, c1, c2, cs);
                break;

			default:
				return "Leaf type unknown: " + type;
		}
	}
}

/*
 *@param rootElement SCENE tag from DSX
 * Parse tag animation from DSX
 */
DSXSceneGraph.prototype.parseAnimations = function(rootElement) {

    //Get Animations - primitives to be drawn
    var tempAnim =  rootElement.getElementsByTagName("animations");
    if (tempAnim == null) {
        return "ANIMATIONS is missing.";
    }

    if (tempAnim.length != 1) {
        return "Only one ANIMATIONS is allowed.";
    }

    var animations = tempAnim[0];


    var allAnim = animations.getElementsByTagName("animation");

    //Get each animation
    for (var i = 0; i < allAnim.length; i++) {
        var anim = allAnim[i];
        var id = this.reader.getString(anim, "id");
        if (id in this.animations)
            return "Duplicate animation id: " + id;

        var type = this.reader.getString(anim, "type");
        var timeSpan = this.reader.getFloat(anim, "span");


        //Different types of animations
        switch (type) {
            case "circular":
                var centerX = this.reader.getFloat(anim, "centerx");

                if (isNaN(centerX))
                    return "linear animation with error in centerX " + id;

                var centerY = this.reader.getFloat(anim, "centery");

                if (isNaN(centerY))
                    return "linear animation with error in centerY " + id;

                var centerZ = this.reader.getFloat(anim, "centerz");

                if (isNaN(centerZ))
                    return "linear animation with error in centerZ " + id;

                var radius = this.reader.getFloat(anim, "radius");

                if (isNaN(radius))
                    return "linear animation with error in radius " + id;

                var startAng = this.reader.getFloat(anim,"startang") * deg2rad;

                if (isNaN(startAng))
                    return "linear animation with error in startAn " + id;

                var rotAng = this.reader.getFloat(anim,"rotang")* deg2rad ;

                if (isNaN(rotAng))
                    return "linear animation with error in rotAng " + id;

                this.animations[id] = new CircularAnimation(id, timeSpan, vec3.fromValues(centerX, centerY, centerZ), radius, startAng, rotAng);
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
 *@param rootElement SCENE tag from DSX
 * Parse tag components from DSX
 */
DSXSceneGraph.prototype.parseComponents = function(rootElement) {
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

	//Checks if all components exist
	for (key in this.components) {
		for (var i = 0; i < this.components[key].children.length; ++i) {
			var child = this.components[key].children[i];
			if (child.type == "componentref" && !(child.id in this.components))
				return "Child " + child.id + " is missing from components";
		
		}
	}
}

/*
 *@param component
 * Parse each component
 * Called by parseComponents
 */
DSXSceneGraph.prototype.parseComponent = function(component) {
	//Id of component
	var id = this.reader.getString(component, "id");

	console.log("Found component " + id);
	
	if (id in this.components)
		return "Duplicate component id " + id;
	
	this.components[id] = new Node(id);
	
	//Get NODE Transformation
	
	var childNode = component.getElementsByTagName('transformation');

	if(childNode == null ){
        return "transformation is missing in component id " + id;
	}

	if(childNode.length != 1){
		return "Expected one transformation in component id " + id;
	}

	childNode = childNode[0];


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
    childNode = component.getElementsByTagName('materials');

    if(childNode == null ){
        return "materials is missing in component id " + id;
    }

    if(childNode.length != 1){
        return "Expected one materials in component id " + id;
    }

    childNode = childNode[0];

	
	for (var i=0;i<childNode.children.length;i++){
		var material = childNode.children[i];
		var materialId = this.reader.getString(material, "id");
	
		if(!(materialId in this.materials) && materialId != "inherit")
			return "No material " + materialId +  " for component " + id;
		this.components[id].addMaterial(materialId);
	}
	
	//to set first material from list
	var material = childNode.children[0];
	var materialId = this.reader.getString(material, "id");
	this.components[id].setMaterial(materialId)
	

	//Get NODE TEXTURE
    childNode = component.getElementsByTagName('texture');

    if(childNode == null ){
        return "texture is missing in component id " + id;
    }

    if(childNode.length != 1){
        return "Expected one texture in component id " + id;
    }

    childNode = childNode[0];


	var texture = this.reader.getString(childNode, "id");
	
	if(!(texture in this.textures) && texture != "inherit" && texture != "none")
		return "No texture " + texture +  " for component " + id;
	
	this.components[id].setTexture(texture);


	//Get Node Animations
    childNode = component.getElementsByTagName('animation');


    if(childNode.length != 0) { //animations are not mandatory
		childNode = childNode[0];


		for (var i = 0; i < childNode.children.length; i++) {
			var animation = childNode.children[i];
			var animationID = this.reader.getString(animation, "id");

			if (!(animationID in this.animations))
				return "Unknown animation " + animationID + " for component " + id;
			this.components[id].addMaterial(materialId);

            this.components[id].addAnimation(this.animations[animationID]);
            console.log("Added animation id " + animationID + " to compoenet " + id);
		}

    }

	//Get children of NODE
    var new_children = component.getElementsByTagName('children');

    if(new_children == null ){
        return "children is missing in component id " + id;
    }

    if(new_children.length != 1){
        return "Expected one children in component id " + id;
    }

    new_children = new_children[0];

	if (new_children.children.length == 0)
		return "component " + id + " has no descendants";

	for (var i = 0; i < new_children.children.length; ++i) {
		var new_child = new_children.children[i];
		
		var typeChild = new_child.nodeName;
		if (typeChild != "componentref" && typeChild != "primitiveref" )
			return "Wrong children type found for component " + id;
		
		var new_childId = this.reader.getString(new_child, "id");
		
		//Primitives already all declared
		if(typeChild == "primitiveref"){
			
			if (!(new_childId in this.leaves))
				return "Child " + new_childId + " is not a primitve";
			
		}
		var child = { type:typeChild, id:new_childId };

		this.components[id].addChild(child);
	}
	
}
	
/*
 * Callback to be executed on any read error
 */
 
DSXSceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


/*
 * Validates if DSX file has all elements in correct order
 * @param rootElement root element of DSX file
 */
function validateOrder(rootElement) {
	
	if (rootElement.children.length != 10)
		return "The order of elements is: scene - views - illumination - lights - textures - materials - transformations - primitives - animations - components";
	
	if (rootElement.children[0].nodeName != "scene")
		return "The first element should be 'scene'";
	
	if (rootElement.children[1].nodeName != "views")
		return "The second element should be 'views'";
	
	if (rootElement.children[2].nodeName != "illumination")
		return "The third element should be 'illumination'";
	
	if (rootElement.children[3].nodeName != "lights")
		return "The fourth element should be 'lights'";
	
	if (rootElement.children[4].nodeName != "textures")
		return "The fifth element should be 'textures'";
	
	if (rootElement.children[5].nodeName != "materials")
		return "The sixth element should be 'materials'";
	
	if (rootElement.children[6].nodeName != "transformations")
		return "The seventh element should be 'transformations'";
	
	if (rootElement.children[7].nodeName != "primitives")
		return "The eighth element should be 'primitives'";

    if (rootElement.children[8].nodeName != "animations")
        return "The ninth element should be 'primitives'";

    if (rootElement.children[9].nodeName != "components")
		return "The tenth element should be 'components'";
	
	return 1;
}
