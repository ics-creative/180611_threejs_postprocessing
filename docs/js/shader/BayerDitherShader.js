import * as THREE from "three";
import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision mediump float;

#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

in vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 vScreenSize;
out vec4 fragColor;

void main() {
  vec4 color = texture(tDiffuse, vUv);
  float x = floor(vUv.x * vScreenSize.x);
  float y = floor(vUv.y * vScreenSize.y);
  mat4 m = mat4(
    vec4( 0.0,  8.0,  2.0,  10.0),
    vec4( 12.0, 4.0,  14.0, 6.0),
    vec4( 3.0,  11.0, 1.0,  9.0),
    vec4( 15.0, 7.0,  13.0, 5.0)
  );
  int xi = int(mod(x, 4.0));
  int yi = int(mod(y, 4.0));
  float threshold = m[xi][yi];

  color = color * 16.0;
  
  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
  if (v < threshold) {
    color.x = 0.0;
    color.y = 0.0;
    color.z = 0.0;
  } else {
    color.x = 1.0;
    color.y = 1.0;
    color.z = 1.0;
  }
  
  fragColor = color;
}
`;

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Bayer dither
 */
export class BayerDitherShader {
  constructor(width, height) {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
      vScreenSize: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
    this.setSize(width, height);
  }

  setSize(width, height) {
    this.uniforms["vScreenSize"].value.x = width;
    this.uniforms["vScreenSize"].value.y = height;
  }
}
