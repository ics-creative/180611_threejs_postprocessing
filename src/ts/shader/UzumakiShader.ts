/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Uzumaki
 */

 module shader{
 	export class UzumakiShader implements shader.IShader{

 		constructor(width:number,height:number) {
 			this.setScreenSize(width,height);
 		}

 		setMousePos(mouseX:number,mouseY:number){
 			this.uniforms["vCenter"].value.x = mouseX;
 			this.uniforms["vCenter"].value.y = this.uniforms["vScreenSize"].value.y - mouseY;
 		}

 		setScreenSize(width:number,height:number) {
 			this.uniforms["vScreenSize"].value.x = width;
 			this.uniforms["vScreenSize"].value.y = height;
 		}

 		setUzumakiScale(scale:number){
 			this.uniforms["fRadius"].value = scale;
 		}

 		uniforms: { [key:string]:IShaderUniforms} = {
 			"tDiffuse": 	{ type: "t",value: null },
 			"vScreenSize":	{ type:"v2",value:new THREE.Vector2(300,200)},
 			"vCenter":		{ type:"v2",value:new THREE.Vector2(1000,0)},
 			"fRadius":		{ type:"f",	value:150.0},
 			"fUzuStrength": { type:"f",	value:2.5}
 		};

 		vertexShader: string = [
 		"varying vec2 vUv;",
 		"void main() {",

	 		"vUv = uv;",
	 		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

 		"}"

 		].join("\n");

 		fragmentShader: string = [
 		"uniform sampler2D tDiffuse;",
 		"varying vec2 vUv;",
 		"uniform vec2 vScreenSize;",
 		"uniform vec2 vCenter;",
 		"uniform float fRadius;",
 		"uniform float fUzuStrength;",

 		"void main() {",
 			"vec2 pos =  ( vUv * vScreenSize ) - vCenter;",
 			"float len = length(pos);",
			"if( len >= fRadius ) ",
			"{",
				"gl_FragColor = texture2D(tDiffuse,vUv);",
				"return;",
			"}",
	 		"float uzu = min( max( 1.0 - ( len / fRadius),0.0),1.0)  * fUzuStrength; ",

	 		"float x = pos.x * cos(uzu) - pos.y * sin(uzu); ",
	 		"float y = pos.x * sin(uzu) + pos.y * cos(uzu);",

	 		"vec2 retPos = (vec2( x, y ) + vCenter )  / vScreenSize ;",
	 		"vec4 color = texture2D(tDiffuse, retPos );",

 			"gl_FragColor = color;",
 		"}"
 		].join("\n");

 	};
 }
