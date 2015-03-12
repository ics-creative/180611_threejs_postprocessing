/// <reference path="../../typings/threejs/three.d.ts" />
//  
declare module THREE {
	export class EffectComposer{
		constructor(renderer:THREE.WebGLRenderer);
		clearPass() : void;
		render() : void;
		addPass(pass:THREE.RenderPass) : void;
	}
	export class RenderPass{
		constructor(scene:THREE.Scene,camera:THREE.Camera);
	}
	export class ShaderPass{
		renderToScreen:boolean;
		constructor(myclass:any);
		enabled:boolean;
		uniforms:any;
	}
}
