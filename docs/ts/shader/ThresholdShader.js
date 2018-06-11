import {ShaderUtil} from "./ShaderUtil.js"

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Bokashi
 */
export class ThresholdShader {
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
      'if (v >= 0.53333) {',
      'v = 1.0;',
      '} else {',
      'v = 0.0;',
      '}',
      'gl_FragColor = vec4(vec3(v, v, v), 1.0);',
      '}'
    ].join('\n');
  }
}