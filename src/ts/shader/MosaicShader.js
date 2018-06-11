/**
 * Mosaic
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class MosaicShader {
  constructor(width, height) {
    this.uniforms = {
      'tDiffuse': {type: 't', value: null},
      'vScreenSize': {type: 'v2', value: new THREE.Vector2(0.0, 0.0)},
      'fMosaicScale': {type: 'f', value: null}
    };
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
      'uniform vec2 vScreenSize;',
      'uniform float fMosaicScale;',
      'void main() {',
      'vec2 vUv2 = vUv;',
      'vUv2.x = floor(vUv2.x  * vScreenSize.x / fMosaicScale) / (vScreenSize.x / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.x;',
      'vUv2.y = floor(vUv2.y  * vScreenSize.y / fMosaicScale) / (vScreenSize.y / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.y;',
      'vec4 color = texture2D(tDiffuse, vUv2);',
      'gl_FragColor = color;',
      '}'
    ].join('\n');
    this.setMosaicScale(10.0);
    this.setScreenSize(width, height);
  }

  setScreenSize(width, height) {
    this.uniforms['vScreenSize'].value.x = width;
    this.uniforms['vScreenSize'].value.y = height;
  }

  setMosaicScale(scale) {
    this.uniforms['fMosaicScale'].value = scale;
  }
}
    