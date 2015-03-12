/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Random dither
 */
/// <reference path="ShaderUtil.ts"/>
module shader{
	export class RandomDitherShader implements shader.IShader{

		uniforms: { [key:string]:IShaderUniforms} = {
			"tDiffuse": { type: "t", value: null }
		};

        defines:{[key:string]:any} = shader.ShaderUtil.mergeDefines(
            {},shader.ShaderUtil.LUMINANCE
        );

		vertexShader: string = [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n");


		fragmentShader: string = [
            shader.ShaderUtil.RANDOM_DEFINE,

            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "void main() {",

                "vec4 color = texture2D(tDiffuse, vUv);",

                "float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",

                "if (v > rand(vUv)) {",
                    "color.x = 1.0;",
                    "color.y = 1.0;",
                    "color.z = 1.0;",

                "} else {",
                    "color.x = 0.0;",
                    "color.y = 0.0;",
                    "color.z = 0.0;",
                "}",


                // 描画
                "gl_FragColor = color;",
            "}"
		].join("\n");

	};
}
