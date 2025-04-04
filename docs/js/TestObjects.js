import * as THREE from "three";

/**
 * 画面上に表示するオブジェクトをまとめたクラスです。
 */
export class TestObjects {
  constructor(renderer) {
    this.renderer = renderer;
    this.meshImage = this.createImagePlane();
    this.meshVideo = this.createVideoPlane();

    this.currentType = "image";
  }

  change(type) {
    this.currentType = type;

    switch (type) {
      case "video":
        this.video.play();
        this.meshImage.visible = false;
        this.meshVideo.visible = true;
        break;
      case "image":
        this.video.pause();
        this.meshImage.visible = true;
        this.meshVideo.visible = false;
        break;
      default:
        throw new Error();
    }
  }

  createVideoPlane() {
    // video要素とそれをキャプチャするcanvas要素を生成
    this.video = document.createElement("video");
    this.video.src = "texture/BigBuckBunny_320x180.mp4";
    this.video.width = 320;
    this.video.height = 180;
    this.video.load();
    this.video.pause();
    this.video.volume = 0;
    this.video.loop = true;

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 180;

    this.videoCanvasContext = canvas.getContext("2d");
    this.videoCanvasContext.fillStyle = "#000000";
    this.videoCanvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // 生成したcanvasをtextureとしてTHREE.Textureオブジェクトを生成
    this.videoTexture = new THREE.Texture(canvas);
    this.videoTexture.colorSpace = THREE.LinearSRGBColorSpace;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    // 生成したvideo textureをmapに指定し、overdrawをtureにしてマテリアルを生成
    const movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.DoubleSide,
    });

    const movieGeometry = new THREE.PlaneGeometry(32, 18);
    const movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.scale.setLength(0.5);

    const group = new THREE.Group();
    group.add(movieScreen);
    group.visible = false;
    return group;
  }

  createImagePlane() {
    const group = new THREE.Group();
    const texture = new THREE.TextureLoader().load(
      "texture/flower_1024x1024.jpg"
    );
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const geometry = new THREE.PlaneGeometry(10.0, 10.0);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    group.visible = true;
    return group;
  }

  onUpdate() {
    // loop updateの中で実行
    if (this.currentType === "image") {
      return;
    }

    // ビデオの場合は、videoの再生フレームをcanvasに描画する
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoCanvasContext.drawImage(this.video, 0, 0);
      this.videoTexture.needsUpdate = true;
    }
  }
}
