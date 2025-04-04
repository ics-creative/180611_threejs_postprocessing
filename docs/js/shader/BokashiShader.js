import * as THREE from "three";
import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision highp float;
precision highp int;

in vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 vScreenSize;
uniform vec2 vCenter;
uniform float fBokashiScale;
out vec4 fragColor;

void main() {
  if(length(vCenter - vUv * vScreenSize) >= fBokashiScale) {
    fragColor = texture(tDiffuse, vUv);
    return;
  }
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  
  const float count = 9.0;
  float s = floor(count / 2.0 ) * -1.0;
  
  for(int i = 0; i < int(count); i++) {
    float x = (floor(vUv.x * vScreenSize.x) + s + float(i)) / vScreenSize.x;
    for(int j = 0; j < int(count); j++) {
      float y = (floor(vUv.y * vScreenSize.y) + s + float(j)) / vScreenSize.y;
      color += texture(tDiffuse, vec2(x, y));
    }
  }
  fragColor = color / float(count * count);
}
`;

/**
 * Bokashi
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class BokashiShader {
  constructor(width, height) {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
      vScreenSize: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
      vCenter: { type: "v2", value: new THREE.Vector2(1000, 100) },
      fBokashiScale: { type: "f", value: null },
    };
    this.vertexShader = VERTEX_SHADER;
    //	windows / chormeだとcolor値が壊れるみたいでバグる
    this.fragmentShader = FRAGMENT_SHADER;
    this.setBokashiScale(150.0);
    this.setScreenSize(width, height);
  }

  setMousePos(mouseX, mouseY) {
    this.uniforms["vCenter"].value.x = mouseX;
    this.uniforms["vCenter"].value.y =
      this.uniforms["vScreenSize"].value.y - mouseY;
  }

  setScreenSize(width, height) {
    this.uniforms["vScreenSize"].value.x = width;
    this.uniforms["vScreenSize"].value.y = height;
  }

  setBokashiScale(scale) {
    this.uniforms["fBokashiScale"].value = scale;
  }
}
