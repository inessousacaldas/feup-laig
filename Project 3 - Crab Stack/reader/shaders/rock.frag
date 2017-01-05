#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord; // receive from VS

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform vec4 color;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * color;
    gl_FragColor.rgb = (0.5*gl_FragColor.rgb + 0.5*color.rgb);
    gl_FragColor.a = color.a;
}
