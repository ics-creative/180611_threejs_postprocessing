/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Bokashi
 */
module shader {
    export class ThresholdShader implements IShader {

        uniforms:{ [key:string]:IShaderUniforms} = {
            "tDiffuse": {type: "t", value: null}
        };

        defines:{[key:string]:any} = shader.ShaderUtil.mergeDefines(
            {}, shader.ShaderUtil.LUMINANCE
        );

        vertexShader:string = [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n");

        fragmentShader:string = [
            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",

            "void main() {",

                "vec4 color = texture2D(tDiffuse, vUv);",
                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",

                "if (v >= 0.53333) {",
                    "v = 1.0;",
                "} else {",
                    "v = 0.0;",
                "}",

                "gl_FragColor = vec4(vec3(v, v, v), 1.0);",
            "}"
        ].join("\n");

    }
    ;
}
