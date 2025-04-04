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

// モノクロにするためのスケール値を計算
const vec3 monochromeScale = vec3(R_LUMINANCE, G_LUMINANCE, B_LUMINANCE);
out vec4 fragColor;

void main() {
  // 現在の色RGBAを取得
  vec4 color = texture(tDiffuse, vUv);
  // モノクロの輝度を計算
  float grayColor = dot(color.rgb, monochromeScale);
  // モノクロのRGBAに変換
  color = vec4(vec3(grayColor), 1.0);
  fragColor = vec4(color);
}
`;

/**
 * Monochrome Fragment Shader.
 * @author Yasunobu Ikeda
 */
export class MonochromeShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
    };

    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
  }
}
