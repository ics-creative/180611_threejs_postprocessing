import {ShaderUtil} from "./ShaderUtil.js"

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Random dither
 */
export class RandomDitherShader {
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
      ShaderUtil.RANDOM_DEFINE,
      'varying vec2 vUv;',
      'uniform sampler2D tDiffuse;',
      'void main() {',
      'vec4 color = texture2D(tDiffuse, vUv);',
      'float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;',
      'if (v > rand(vUv)) {',
      'color.x = 1.0;',
      'color.y = 1.0;',
      'color.z = 1.0;',
      '} else {',
      'color.x = 0.0;',
      'color.y = 0.0;',
      'color.z = 0.0;',
      '}',
      // 描画
      'gl_FragColor = color;',
      '}'
    ].join('\n');
  }
}