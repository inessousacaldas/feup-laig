
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

float getPosition(float numDivisions, float coord)
{
	float pos = floor(coord*numDivisions);
	if(pos == numDivisions)
	{
		pos = pos - 1.0;
	}
	return pos;
}

void main() {
	//Pass the texture coordinates to the fragment shader
	vTextureCoord = aTextureCoord;

	//Get the fragment's position on the board
	float posX = getPosition(du,aTextureCoord.s);
	float posY = getPosition(dv,aTextureCoord.t);

	//Determine the Z offset for the vertex
	vec3 offset=vec3(0.0,0.0,0.0);
	if((posX == su) && (posY == sv))
	{
		offset.z += 0.1;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
