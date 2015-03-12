/**
 * Sepia tone
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
 module shader{

	export class SepiaToneShader implements shader.IShader{

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
		"varying vec2 vUv;",

		"uniform sampler2D tDiffuse;",
		"void main() {",

			"vec4 color = texture2D(tDiffuse, vUv);",

			"float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;",

			"color.x = v * 0.9;",
			"color.y = v * 0.7;",
			"color.z = v * 0.4;",

			"gl_FragColor = vec4(color);",
		"}"
		].join("\n");

	};
 }
