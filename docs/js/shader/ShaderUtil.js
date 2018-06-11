/**
 * シェーダーでよく使う機能をまとめたファイルです。
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
// language=GLSL
export const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const LUMINANCE = {
  R_LUMINANCE: 0.298912,
  G_LUMINANCE: 0.586611,
  B_LUMINANCE: 0.114478
};
