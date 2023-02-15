import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL
const FRAGMENT_SHADER = `
#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

varying vec2 vUv;
uniform sampler2D tDiffuse;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
  color.x = v * 0.9;
  color.y = v * 0.7;
  color.z = v * 0.4;
  gl_FragColor = vec4(color);
}
`;

/**
 * Sepia tone
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class SepiaToneShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
