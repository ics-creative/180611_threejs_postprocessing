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
