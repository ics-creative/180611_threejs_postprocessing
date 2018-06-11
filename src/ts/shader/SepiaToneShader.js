import {ShaderUtil} from "./ShaderUtil.js"

/**
 * Sepia tone
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class SepiaToneShader {
  constructor() {
    this.uniforms = {
      'tDiffuse': {type: 't', value: null}
    };
    this.defines = ShaderUtil.mergeDefines({}, ShaderUtil.LUMINANCE);
    this.vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n');
    this.fragmentShader = [
      'varying vec2 vUv;',
      'uniform sampler2D tDiffuse;',
      'void main() {',
      'vec4 color = texture2D(tDiffuse, vUv);',
      'float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;',
      'color.x = v * 0.9;',
      'color.y = v * 0.7;',
      'color.z = v * 0.4;',
      'gl_FragColor = vec4(color);',
      '}'
    ].join('\n');
  }
}