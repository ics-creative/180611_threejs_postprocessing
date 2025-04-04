/**
 * シェーダーでよく使う機能をまとめたファイルです。
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
// language=GLSL ES 3.0
export const VERTEX_SHADER = `
in vec3 position;
in vec2 uv;
out vec2 vUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
