attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

varying vec4 coords;

uniform float distX;
uniform float distY;
uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

varying float selected;


varying vec4 select;

void main() {
	vec4 vertex = vec4(aVertexPosition, 1.0);
	coords= vertex;

	float nsv = dv - sv - 1.0;
	if(su != -1.0 && sv != -1.0){
		float minX = su * distX - (distX*du/2.0);
		float minY = nsv * distY - (distY*dv/2.0);
		float maxX = minX + distX;
		float maxY = minY + distY;

		float x = vertex[0];
		float y = vertex[1];

		if(x >= minX && x <= maxX && y >= minY && y <= maxY)
		{
			vertex = vertex + vec4(0,0,0.1,0); /* Height of selected piece */
			selected = 1.0;
		}
		else
			selected = 0.0;
	}

	gl_Position = uPMatrix * uMVMatrix * vertex;

	vTextureCoord = aTextureCoord;
}