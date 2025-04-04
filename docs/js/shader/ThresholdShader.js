import { VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL ES 3.0
const FRAGMENT_SHADER = `
precision mediump float;

// 輝度を計算するときの重ねづけ。緑の重みが高いのは、人間の目が緑に敏感だからです。
#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478

in vec2 vUv;
uniform sampler2D tDiffuse;
out vec4 fragColor;

void main() {
  vec4 color = texture(tDiffuse, vUv);
  
  // 明るさを0.0〜1.0の範囲で計算
  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
  // 明るさが半分以上なら
  if (v >= 0.5) {
    v = 1.0; // 白
  } else {
    v = 0.0; // 黒
  }
  fragColor = vec4(vec3(v, v, v), 1.0);
}
`;

/**
 * 2値化シェーダー。
 * 白と黒の2色として表示します。
 *
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class ThresholdShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
    };

    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
