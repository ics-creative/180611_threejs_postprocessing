/**
 * シェーダーでよく使う機能をまとめたクラスです
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
module shader {
    export class ShaderUtil {
        public static get RANDOM_DEFINE():string {
            return ["float rand(vec2 co) {",
                "float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;",
                "float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));",
                "float t = fract(s * 43758.5453);",
                "return t;",
                "}"].join("\n");
        }

        public static get LUMINANCE():{[key:string]:any} {

            return {
                R_LUMINANCE: 0.298912,
                G_LUMINANCE: 0.586611,
                B_LUMINANCE: 0.114478
            }
        }

        public static mergeDefines(dest:{[key:string]:any}, src:{[key:string]:any}):{[key:string]:any} {
            for (var keyName in src) {
                dest[keyName] = src[keyName];
            }
            return dest;
        }
    }
}