/**
 * シェーダーでよく使う機能をまとめたクラスです
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
export class ShaderUtil {
  static get RANDOM_DEFINE() {
    return ['float rand(vec2 co) {',
      'float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;',
      'float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));',
      'float t = fract(s * 43758.5453);',
      'return t;',
      '}'].join('\n');
  }

  static get LUMINANCE() {
    return {
      R_LUMINANCE: 0.298912,
      G_LUMINANCE: 0.586611,
      B_LUMINANCE: 0.114478
    };
  }

  static mergeDefines(dest, src) {
    for (var keyName in src) {
      dest[keyName] = src[keyName];
    }
    return dest;
  }
}