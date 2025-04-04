import * as THREE from "three";
import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision mediump float;

in vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 vScreenSize;
out vec4 fragColor;

float rand(vec2 co) {
  float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
  float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
  float t = fract(s * 43758.5453);
  return t;
}

void main() {
  float radius = 5.0;
  float x = (vUv.x * vScreenSize.x) + rand(vUv) * radius * 2.0 - radius;
  float y = (vUv.y * vScreenSize.y) + rand(vec2(vUv.y, vUv.x)) * radius * 2.0 - radius;
  vec4 textureColor = texture(tDiffuse, vec2(x, y) / vScreenSize);
  fragColor = textureColor;
}
`;

export class DiffusionShader {
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
