/**
 * Negative-Positive Convert
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class NegativePositiveShader {
  constructor() {
    this.uniforms = {
      tDiffuse: { type: "t", value: null }
    };
    this.vertexShader = [
      "varying vec2 vUv;",
      "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join("\n");
    this.fragmentShader = [
      "varying vec2 vUv;",
      "uniform sampler2D tDiffuse;",
      "void main() {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "gl_FragColor = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);",
      "}"
    ].join("\n");
  }
}
