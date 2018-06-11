import { BayerDitherShader } from "./shader/BayerDitherShader.js";
import { DiffusionShader } from "./shader/DiffusionShader.js";
import { MonochromeShader } from "./shader/MonochromeShader.js";
import { MosaicShader } from "./shader/MosaicShader.js";
import { NegativePositiveShader } from "./shader/NegativePositiveShader.js";
import { RandomDitherShader } from "./shader/RandomDitherShader.js";
import { SepiaToneShader } from "./shader/SepiaToneShader.js";
import { ThresholdShader } from "./shader/ThresholdShader.js";
import { UzumakiShader } from "./shader/UzumakiShader.js";
import { TestObjects } from "./TestObjects.js";

window.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
  main.initialize();
});

export class Main {
  constructor() {
    this.effects = {};
    this.effectList = [];
  }

  initialize() {
    this.initVue();
    this.init3d();
    this.initMouse();
  }

  initVue() {
    // v-repeat
    new Vue({
      el: "#myapp",
      data: {
        shaderTypes: [
          { name: "モノクロ", id: "monochrome", value: false },
          { name: "ネガポジ反転", id: "nega", value: false },
          { name: "セピア調", id: "sepia_tone", value: false },
          { name: "モザイク", id: "mosaic", value: false },
          { name: "すりガラス", id: "diffusion", value: false },
          { name: "うずまき", id: "uzumaki", value: false },
          { name: "2値化(threshold)", id: "threshold", value: false },
          { name: "2値化(ランダムディザ)", id: "random_dither", value: false },
          { name: "2値化(ベイヤーディザ)", id: "bayer_dither", value: false }
        ],
        targetTypes: [
          { name: "画像", value: "image" },
          { name: "ビデオ", value: "video" }
        ],
        picked: "image"
      },
      methods: {
        onChangeShaderCheckbox: item => {
          item.value = !item.value;
          this.changeShader(item.id, item.value);
        },
        onChangeTargetRadio: item => {
          console.log(item.value);
          this.picked = item.value;
          this.changeScene(item.value);
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

  initObjects() {
    this.objects = new TestObjects(this.scene, this.renderer, this.spMode);
    if (this.spMode) {
      const changeButton = document.getElementById("object_change");
      changeButton.style.display = "none";
    }
  }

  resetShader() {
    this.normalRenderMode = true;
    for (let i = 0; i < this.effectList.length; i++) {
      this.effectList[i].pass.enabled = false;
      this.effectList[i].pass.renderToScreen = false;
    }
  }

  changeShader(id, value) {
    this.normalRenderMode = false;
    this.effects[id].pass.enabled = value;
    let renderToScreen = false;
    for (let i = this.effectList.length - 1; i >= 0; i--) {
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

  init3d() {
    //  Three.jsの初期化処理
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

    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    if (this.normalRenderMode) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.composer.render();
    }
    //  マウス位置を更新
    this.uzumaki.setMousePos(this.mouseX, this.mouseY);
    this.objects.onUpdate();
  }

  addShaders() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.addEffect("monochrome", new MonochromeShader());
    this.addEffect("nega", new NegativePositiveShader());
    this.addEffect("sepia_tone", new SepiaToneShader());
    this.addEffect("mosaic", new MosaicShader(width, height));
    this.addEffect("diffusion", new DiffusionShader(width, height));

    this.uzumaki = new UzumakiShader(width, height);

    this.addEffect("uzumaki", this.uzumaki);
    this.uzumaki.uniforms = this.effects["uzumaki"].pass.uniforms;

    this.addEffect("threshold", new ThresholdShader());
    this.addEffect("random_dither", new RandomDitherShader());
    this.addEffect("bayer_dither", new BayerDitherShader(width, height));
  }

  addEffect(name, shader) {
    const pass = new THREE.ShaderPass(shader);
    this.composer.addPass(pass);
    pass.renderToScreen = false;
    pass.enabled = false;
    this.effects[name] = { material: shader, pass: pass };
    //  順番用
    this.effectList.push(this.effects[name]);
  }
}
