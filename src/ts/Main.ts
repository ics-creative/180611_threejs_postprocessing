/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="shader/shader.d.ts" />
/// <reference path="three_examples.d.ts" />
/// <reference path="TestObjects.ts" />
/**
 * 定番の画像処理をthree.js+シェーダーでいくつか作ってみるデモ
 * https://github.com/ics-nohara/threejs_postprocessing_demo
 * @author Nozomi Nohara / https://github.com/ics-nohara
 */
interface Window{
	superagent:any;
}

interface IShaderMap {
	material:shader.IShader;
	pass:THREE.ShaderPass;
}

class Main {

	constructor() {
	}

	private vertexShader:string;
	private currentSelection:string;
	
	private scene:THREE.Scene;
	private camera:THREE.PerspectiveCamera;
	private renderer:THREE.WebGLRenderer
	private composer:THREE.EffectComposer;

	private effects: { [key:string]:IShaderMap} = {};
	private effectList: IShaderMap[] = [];
	private normalRenderMode:boolean;
	private mouseX:number;
	private mouseY:number;

	private uzumaki:shader.UzumakiShader;
	private spMode:boolean;

	private objects:TestObjects;

	initialize() {
		this.checkSpMode();
		this.startScene();
		this.initMouse();
	}
	changeScene(){
		this.objects.change();
	}

	initMouse() {
		if ("ontouchstart" in window) {
			this.renderer.domElement.addEventListener("touchmove",(event:any) => {
				event.preventDefault(); 
				this.mouseX = event.changedTouches[0].pageX ;
				this.mouseY = event.changedTouches[0].pageY ;
				
				});
		}
		document.addEventListener("mousemove",(event) => {
			this.mouseX = event.pageX;
			this.mouseY = event.pageY;
			});

	}

	isIphone() {
		return  (navigator.userAgent.indexOf('iPhone') > 0 &&
			navigator.userAgent.indexOf('iPad') == -1) ||
		navigator.userAgent.indexOf('iPod') > 0 ;
	}
	checkSpMode() {

		if (this.isIphone() || navigator.userAgent.indexOf('Android') > 0) 
		{
			this.spMode = true;
			} else {
				this.spMode = false;
			}

		}

	initObjects() {
		this.objects = new TestObjects(this.scene,this.renderer,this.spMode);
		if(this.spMode){
			var changeButton = document.getElementById('object_change');

			changeButton.style.display = 'none'; //or
			changeButton.style.visibility = 'hidden';
		}
	}
	resetShader() {
		this.normalRenderMode = true;

		for(var i = 0;i < this.effectList.length ; i ++ ){
			this.effectList[i].pass.enabled = false;
			this.effectList[i].pass.renderToScreen = false;
		}
	}

	changeShader(id:string,value:boolean) {

		this.normalRenderMode = false;
		this.effects[id].pass.enabled = value;

		var renderToScreen:boolean = false;
		for(var i = this.effectList.length - 1; i >= 0 ; i--){

			if( this.effectList[i].pass.enabled && !renderToScreen) {
				this.effectList[i].pass.renderToScreen = true;
				renderToScreen = true;
				} else {
					this.effectList[i].pass.renderToScreen = false;
				}

			}
			if( !renderToScreen ) {
				this.normalRenderMode = true;
			}
		}


	startScene() {

		//  ThreeeJSの初期化処理
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(77, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio( window.devicePixelRatio );
		document.getElementById('canvas-wrapper').appendChild(this.renderer.domElement);

		this.initObjects();


		// postprocessing
		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

		this.addShaders();
		this.normalRenderMode = true;

		this.camera.position.z = 3;

		var render = () => {
			requestAnimationFrame(render);

			if( this.normalRenderMode ) {
				this.renderer.render(this.scene, this.camera);
				} else {
					this.composer.render();
				}
				
				
				//  マウス位置を更新
				this.uzumaki.setMousePos(this.mouseX,this.mouseY);

				this.objects.onUpdate();
		};
		render();

	}

	addShaders() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		this.addEffect( "nega",             new shader.NegativePositiveShader );
		this.addEffect( "sepia_tone",       new shader.SepiaToneShader );
		this.addEffect( "mosaic",           new shader.MosaicShader(width,height));
		this.addEffect( "diffusion",        new shader.DiffusionShader(width,height));

		this.addEffect( "uzumaki", this.uzumaki =  new shader.UzumakiShader(width,height));
		this.uzumaki.uniforms = this.effects["uzumaki"].pass.uniforms;

		this.addEffect( "threshold",        new shader.ThresholdShader );
		this.addEffect( "random_dither",    new shader.RandomDitherShader );
		this.addEffect( "bayer_dither",     new shader.BayerDitherShader(width,height));

		if(this.spMode) {
			this.uzumaki.setUzumakiScale(75);
			
		}
	}

	addEffect(name:string,shader:shader.IShader){

		var pass = new THREE.ShaderPass( shader );
		this.composer.addPass( pass );
		pass.renderToScreen = false;
		pass.enabled = false;
		this.effects[name] = {material:shader,pass:pass};

		//  順番用
		this.effectList.push( this.effects[name] );
	}

};