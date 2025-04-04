import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision highp float;
precision highp int;

in vec2 vUv;
uniform sampler2D tDiffuse;
out vec4 fragColor;

void main() {
  vec4 color = texture(tDiffuse, vUv);
  fragColor = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
}
`;

/**
 * Negative-Positive Convert
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class NegativePositiveShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
