import { BayerDitherShader } from "./shader/BayerDitherShader.js";
import { DiffusionShader } from "./shader/DiffusionShader.js";
import { MosaicShader } from "./shader/MosaicShader.js";
import { NegativePositiveShader } from "./shader/NegativePositiveShader.js";
import { RandomDitherShader } from "./shader/RandomDitherShader.js";
import { SepiaToneShader } from "./shader/SepiaToneShader.js";
import { ThresholdShader } from "./shader/ThresholdShader.js";
import { UzumakiShader } from "./shader/UzumakiShader.js";
import { TestObjects } from "./TestObjects.js";

export class Main {
  constructor() {
    this.effects = {};
    this.effectList = [];
  }

  static canWebGL() {
    try {
      return (
        !!window.WebGLRenderingContext &&
        !!document.createElement("canvas").getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
    return true;
  }

  initialize() {
    this.initVue();
    this.checkSpMode();
    this.startScene();
    this.initMouse();
  }

  initVue() {
    // v-repeat
    this.vm = new Vue({
      el: "#myapp",
      data: {
        shader_change_buttons: [
          { name: "ネガポジ反転", id: "nega", value: false },
          { name: "セピア調", id: "sepia_tone", value: false },
          { name: "モザイク", id: "mosaic", value: false },
          { name: "すりガラス", id: "diffusion", value: false },
          { name: "うずまき", id: "uzumaki", value: false },
          { name: "2値化(threshold)", id: "threshold", value: false },
          { name: "2値化(ランダムディザ)", id: "random_dither", value: false },
          { name: "2値化(ベイヤーディザ)", id: "bayer_dither", value: false }
        ],
        image_change_buttons: [
          { name: "画像", id: 0, value: "image" },
          { name: "ビデオ", id: 1, value: "video" }
        ],
        picked: "image",
        white: "whiteStyle",
        vueApp: "vueApplication"
      },
      methods: {
        _onClick: e => {
          if (e.targetVM.id == "reset") {
            this.resetShader();
            for (
              var i = 0;
              i < this.vm.data["shader_change_buttons"].length;
              i++
            ) {
              this.vm.data["shader_change_buttons"][i].value = false;
            }
          } else {
            e.targetVM.value = !e.targetVM.value;
            this.changeShader(e.targetVM.id, e.targetVM.value);
          }
        },
        _onRadioClick: e => {
          this.changeScene(e.targetVM.id);
        }
      }
    });
  }

  changeScene(type) {
    this.objects.change(type);
  }

  initMouse() {
    if ("ontouchstart" in window) {
      this.renderer.domElement.addEventListener("touchmove", event => {
        event.preventDefault();
        this.mouseX = event.changedTouches[0].pageX;
        this.mouseY = event.changedTouches[0].pageY;
      });
    }
    document.addEventListener("mousemove", event => {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    });
  }

  isIphone() {
    return (
      (navigator.userAgent.indexOf("iPhone") > 0 &&
        navigator.userAgent.indexOf("iPad") == -1) ||
      navigator.userAgent.indexOf("iPod") > 0
    );
  }

  checkSpMode() {
    if (this.isIphone() || navigator.userAgent.indexOf("Android") > 0) {
      this.spMode = true;
    } else {
      this.spMode = false;
    }
  }

  initObjects() {
    this.objects = new TestObjects(this.scene, this.renderer, this.spMode);
    if (this.spMode) {
      var changeButton = document.getElementById("object_change");
      changeButton.style.display = "none";
    }
  }

  resetShader() {
    this.normalRenderMode = true;
    for (var i = 0; i < this.effectList.length; i++) {
      this.effectList[i].pass.enabled = false;
      this.effectList[i].pass.renderToScreen = false;
    }
  }

  changeShader(id, value) {
    this.normalRenderMode = false;
    this.effects[id].pass.enabled = value;
    var renderToScreen = false;
    for (var i = this.effectList.length - 1; i >= 0; i--) {
      if (this.effectList[i].pass.enabled && !renderToScreen) {
        this.effectList[i].pass.renderToScreen = true;
        renderToScreen = true;
      } else {
        this.effectList[i].pass.renderToScreen = false;
      }
    }
    if (!renderToScreen) {
      this.normalRenderMode = true;
    }
  }

  startScene() {
    //  ThreeeJSの初期化処理
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      77,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document
      .getElementById("canvas-wrapper")
      .appendChild(this.renderer.domElement);
    this.initObjects();
    // postprocessing
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.addShaders();
    this.normalRenderMode = true;
    this.camera.position.z = 3;
    var render = () => {
      requestAnimationFrame(render);
      if (this.normalRenderMode) {
        this.renderer.render(this.scene, this.camera);
      } else {
        this.composer.render();
      }
      //  マウス位置を更新
      this.uzumaki.setMousePos(this.mouseX, this.mouseY);
      this.objects.onUpdate();
    };
    render();
  }

  addShaders() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.addEffect("nega", new NegativePositiveShader());
    this.addEffect("sepia_tone", new SepiaToneShader());
    this.addEffect("mosaic", new MosaicShader(width, height));
    this.addEffect("diffusion", new DiffusionShader(width, height));
    this.addEffect(
      "uzumaki",
      (this.uzumaki = new UzumakiShader(width, height))
    );
    this.uzumaki.uniforms = this.effects["uzumaki"].pass.uniforms;
    this.addEffect("threshold", new ThresholdShader());
    this.addEffect("random_dither", new RandomDitherShader());
    this.addEffect("bayer_dither", new BayerDitherShader(width, height));
    if (this.spMode) {
      this.uzumaki.setUzumakiScale(75);
    }
  }

  addEffect(name, shader) {
    var pass = new THREE.ShaderPass(shader);
    this.composer.addPass(pass);
    pass.renderToScreen = false;
    pass.enabled = false;
    this.effects[name] = { material: shader, pass: pass };
    //  順番用
    this.effectList.push(this.effects[name]);
  }
}

console.log(Main.canWebGL());

if (Main.canWebGL()) {
  var main = new Main();
  main.initialize();
} else {
  var myapp = (document.getElementById("myapp").style.display = "none");
  document.getElementById("canvas-wrapper").style.display = "none";
  var nosuported = document.getElementById("webgl_no_supported");
  nosuported.style.display = "block";
}
