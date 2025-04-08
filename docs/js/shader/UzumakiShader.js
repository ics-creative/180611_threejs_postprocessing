import * as THREE from "three";
import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D tDiffuse;
in vec2 vUv;
uniform vec2 vScreenSize;
uniform vec2 vCenter;
uniform float fRadius;
uniform float fUzuStrength;
out vec4 fragColor;

void main() {
  vec2 pos = (vUv * vScreenSize) - vCenter;
  float len = length(pos);
  if(len >= fRadius) {
    fragColor = texture(tDiffuse, vUv);
    return;
  } 
  float uzu = min(max(1.0 - (len / fRadius), 0.0), 1.0) * fUzuStrength; 
  float x = pos.x * cos(uzu) - pos.y * sin(uzu); 
  float y = pos.x * sin(uzu) + pos.y * cos(uzu);
  vec2 retPos = (vec2(x, y) + vCenter) / vScreenSize;
  vec4 color = texture(tDiffuse, retPos);
  fragColor = color;
}
`;

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Uzumaki
 */
export class UzumakiShader {
  constructor(width, height) {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
      vScreenSize: { type: "v2", value: new THREE.Vector2(300, 200) },
      vCenter: { type: "v2", value: new THREE.Vector2(1000, 0) },
      fRadius: { type: "f", value: 150.0 },
      fUzuStrength: { type: "f", value: 2.5 },
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
    this.setScreenSize(width, height);
  }

  /**
   * マウス座標を更新します。
   * @param mouseX {number}
   * @param mouseY {number}
   */
  setMousePos(mouseX, mouseY) {
    this.uniforms["vCenter"].value.x = mouseX;
    this.uniforms["vCenter"].value.y =
      this.uniforms["vScreenSize"].value.y - mouseY;
  }

  setScreenSize(width, height) {
    this.uniforms["vScreenSize"].value.x = width;
    this.uniforms["vScreenSize"].value.y = height;
  }

  setUzumakiScale(scale) {
    this.uniforms["fRadius"].value = scale;
  }
}
