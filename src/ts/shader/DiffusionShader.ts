/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * diffusion 
 */

 module shader{

 	export class DiffusionShader implements shader.IShader{

 		uniforms: { [key:string]:IShaderUniforms} = {
 			"tDiffuse": { type: "t", value: null },
			"vScreenSize":	{ type:"v2",value:new THREE.Vector2(0.0,0.0)}
 		};


	    constructor(width:number,height:number) {
	        this.setSize(width,height);
	    }

	    setSize(width:number,height:number) {
	        this.uniforms["vScreenSize"].value.x = width;
	        this.uniforms["vScreenSize"].value.y = height;
	    }


 		vertexShader: string = [
 		"varying vec2 vUv;",
 		"uniform vec2 vScreenSize;",

 		"void main() {",
	 		"vUv = uv;",
	 		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
 		"}"
 		].join("\n");

 		fragmentShader: string = [
        shader.ShaderUtil.RANDOM_DEFINE,
		"varying vec2 vUv;",
		"uniform sampler2D tDiffuse;",
 		"uniform vec2 vScreenSize;",
		"void main() {",

			"float radius = 5.0;",

			"float x = (vUv.x * vScreenSize.x) + rand(vUv) * radius * 2.0 - radius;",
			"float y = (vUv.y * vScreenSize.y) + rand(vUv) * radius * 2.0 - radius;",

			"vec4 textureColor = texture2D(tDiffuse, vec2( x, y ) / vScreenSize );",
			"gl_FragColor = textureColor;",
		"}"
 		].join("\n");

 	};
 }
