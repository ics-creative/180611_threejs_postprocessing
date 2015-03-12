/**
 * Bokashi
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
module shader{
	export class BokashiShader implements shader.IShader{

		constructor(width:number,height:number) {
			this.setBokashiScale(150.0);
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

		setBokashiScale(scale:number){
			this.uniforms["fBokashiScale"].value = scale;
		}

		uniforms: { [key:string]:IShaderUniforms} = {
			"tDiffuse": 	{ type: "t", value: null },
			"vScreenSize":	{ type:"v2",value:new THREE.Vector2(0.0,0.0)},
			"vCenter":		{ type:"v2",value:new THREE.Vector2(1000,100)},
			"fBokashiScale":{ type:"f",value: null}
		};

		vertexShader: string = [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n");

		//	windows / chormeだとcolor値が壊れるみたいでバグる
		fragmentShader: string = [
			"varying vec2 vUv;",
			"uniform sampler2D tDiffuse;",
			"uniform vec2 vScreenSize;",
			"uniform vec2 vCenter;",
			"uniform float fBokashiScale;",

			"void main() {",
				"if( length(vCenter-vUv*vScreenSize) >= fBokashiScale ) ",
				"{",
					"gl_FragColor = texture2D(tDiffuse,vUv);",
					"return;",
				"}",
				"vec4 color =  vec4(0.0,0.0,0.0,0.0);",

				"const float count = 9.0;",
				"float s = floor(count / 2.0 ) *  - 1.0;",
				
				"for(int i = 0; i < int( count ) ;i++)",
				"{",
					"float x = (floor(vUv.x  * vScreenSize.x) +s + float(i)) / vScreenSize.x ;",
					"for(int j=0;j<int( count ) ;j++)",
					"{",
						"float y = (floor(vUv.y  * vScreenSize.y) + s + float(j) ) / vScreenSize.y ;",
						"color += texture2D(tDiffuse, vec2( x, y ) );",
					"}",
					
				"}",
				"gl_FragColor = color / float(count * count);",
			"}"
		].join("\n");

	};
}
