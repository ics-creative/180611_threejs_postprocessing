import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL
const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform sampler2D tDiffuse;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}
`;

/**
 * Negative-Positive Convert
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class NegativePositiveShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null }
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
