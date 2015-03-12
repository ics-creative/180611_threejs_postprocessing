/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Mosaic
 */
module shader{
	export class MosaicShader implements shader.IShader{

	    constructor(width:number,height:number) {
	    	this.setMosaicScale(10.0);
	        this.setScreenSize(width,height);
	    }

	    setScreenSize(width:number,height:number) {
	        this.uniforms["vScreenSize"].value.x = width;
	        this.uniforms["vScreenSize"].value.y = height;
	    }

	    setMosaicScale(scale:number){
	        this.uniforms["fMosaicScale"].value = scale;
	    }

		uniforms: { [key:string]:IShaderUniforms} = {
			"tDiffuse": { type: "t", value: null },
			"vScreenSize":	{ type:"v2",value:new THREE.Vector2(0.0,0.0)},
			"fMosaicScale":{type:"f",value:null}
 		};

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
			"uniform vec2 vScreenSize;",
			"uniform float fMosaicScale;",

			"void main() {",

			 "vec2 vUv2 = vUv;",

			    "vUv2.x = floor(vUv2.x  * vScreenSize.x / fMosaicScale) / (vScreenSize.x / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.x;",
			    "vUv2.y = floor(vUv2.y  * vScreenSize.y / fMosaicScale) / (vScreenSize.y / fMosaicScale) + (fMosaicScale/2.0) / vScreenSize.y;",

			    "vec4 color = texture2D(tDiffuse, vUv2);",
			    "gl_FragColor = color;",
			"}"
		].join("\n");

	};
}
