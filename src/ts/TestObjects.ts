/// <reference path="../../typings/tsd.d.ts" />

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * 画面上に表示するオブジェクトをまとめたクラスです。
 */

class TestObjects{

	groups: THREE.Group[] = [];
	renderer:THREE.WebGLRenderer;
	video:any;
	videoImageContext:any;
	videoTexture:THREE.Texture;
	current:number;

	constructor(scene:THREE.Scene,renderer:THREE.WebGLRenderer,spMode:boolean) {

		this.renderer = renderer;

		this.groups.push(this.getImagePlane());

		if(!spMode){
			this.groups.push(this.getVideoImagePlane());
		}
		
		for(var id in this.groups){
			scene.add(this.groups[id]);
		}
		this.current = 0;
	}

	change(){
		

		if( this.current == 1 ){
			this.video.pause();
		}

		this.groups[this.current].visible = false;
		this.current++;
		if( this.current >= this.groups.length ){
			this.current = 0;
		}


		if( this.current == 1 ){
			this.video.play();
		}

		this.groups[this.current].visible = true;

	}

	getVideoImagePlane() {
		//video要素とそれをキャプチャするcanvas要素を生成
		this.video = document.createElement('video');
		this.video.src = "texture/BigBuckBunny_320x180.mp4";
		this.video.load();
		this.video.pause();
		this.video.volume = 0;

		this.video.loop = true;

		var videoImage:HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
		videoImage.width = 480;
		videoImage.height = 200;

		this.videoImageContext = videoImage.getContext('2d');
		this.videoImageContext.fillStyle = '#000000';
		this.videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

		//生成したcanvasをtextureとしてTHREE.Textureオブジェクトを生成
		this.videoTexture = new THREE.Texture(videoImage);
		this.videoTexture.minFilter = THREE.LinearFilter;
		this.videoTexture.magFilter = THREE.LinearFilter;

		//生成したvideo textureをmapに指定し、overdrawをtureにしてマテリアルを生成
		var movieMaterial = new THREE.MeshBasicMaterial(  { map:this.videoTexture, side: THREE.DoubleSide } );//{map: this.videoTexture, overdraw: true, side:THREE.DoubleSide});
		var movieGeometry = new THREE.PlaneGeometry(2.0, 1.0, 1, 1);
		var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);

		movieScreen.position.x = 1.68;
		movieScreen.position.y = -0.23;

		movieScreen.scale.x = movieScreen.scale.y = 5.0;
		var group:THREE.Group = new THREE.Group();
		group.add(movieScreen);

		//movieScreen.rotation.y = THREE.Math.degToRad(180);

		group.visible = false;
		return group;
	}

	getImagePlane() {

		var group:THREE.Group = new THREE.Group();
		var texture = THREE.ImageUtils.loadTexture( 'texture/flower.jpg' );
		texture.anisotropy = this.renderer.getMaxAnisotropy();

		var geometry = new THREE.PlaneGeometry(1.5,1.0,1,1);
		var material = new THREE.MeshBasicMaterial( { map:texture, side: THREE.DoubleSide } );

		var mesh:THREE.Mesh = new THREE.Mesh( geometry, material );

		mesh.scale.x = mesh.scale.y = 4.7;
		group.add(mesh);

		group.visible = true;
		return group;
	}

	onUpdate() {
		//loop updateの中で実行
		if( this.current != 1 )
			return;
		if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
			this.videoImageContext.drawImage(this.video, 0, 0);
			if (this.videoTexture) {
				this.videoTexture.needsUpdate = true;
			}
		}
	}
}