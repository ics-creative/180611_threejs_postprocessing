import { VERTEX_SHADER, LUMINANCE } from "./ShaderUtil.js";

// language=GLSL
const fragmentShader = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
  if (v >= 0.53333) {
  v = 1.0;
  } else {
  v = 0.0;
  }
gl_FragColor = vec4(vec3(v, v, v), 1.0);
}
`;

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Bokashi
 */
export class ThresholdShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null }
    };
    this.defines = LUMINANCE;
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = fragmentShader;
  }
}
