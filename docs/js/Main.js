import * as THREE from "three";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

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

import { createApp } from "vue";

const effectList = [];
let mouseX = 0;
let mouseY = 0;

{
  const app = createApp({
    data() {
      return {
        shaderTypes: [
          { name: "モノクロ", id: "monochrome", selected: false },
          { name: "ネガポジ反転", id: "nega", selected: false },
          { name: "セピア調", id: "sepiaTone", selected: false },
          { name: "モザイク", id: "mosaic", selected: false },
          { name: "すりガラス", id: "diffusion", selected: false },
          { name: "うずまき", id: "uzumaki", selected: false },
          { name: "2値化(threshold)", id: "threshold", selected: false },
          {
            name: "2値化(ランダムディザ)",
            id: "randomDither",
            selected: false,
          },
          { name: "2値化(ベイヤーディザ)", id: "bayerDither", selected: false },
        ],
        targetTypes: [
          { name: "画像", value: "image" },
          { name: "ビデオ", value: "video" },
        ],
        picked: "image",
      };
    },
    methods: {
      onChangeShaderCheckbox(item) {
        item.selected = !item.selected;
        changeShader(item.id, item.selected);
      },
      onChangeDisplayedTarget(item) {
        this.picked = item.value;
        changeDisplayedMesh(item.value);
      },
    },
  });

  app.mount("#app");
}

//  Three.jsの初期化処理
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  77,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;
// WebGL2.0を使用するためのレンダラー設定
const canvas = document.createElement("canvas");
const context = canvas.getContext("webgl2");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  context: context,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.getElementById("canvas-wrapper").appendChild(renderer.domElement);

const objects = new TestObjects(renderer);
scene.add(objects.meshImage);
scene.add(objects.meshVideo);

// postprocessing
const composer = new EffectComposer(renderer);
composer.outputColorSpace = THREE.LinearSRGBColorSpace;
const renderPass = new RenderPass(scene, camera);
renderPass.inputColorSpace = THREE.LinearSRGBColorSpace;
renderPass.outputColorSpace = THREE.LinearSRGBColorSpace;
composer.addPass(renderPass);

// EffectComposerを使わない、通常のレンダリングかどうか？
let normalRenderMode = true;

document.addEventListener("pointermove", (event) => {
  mouseX = event.pageX;
  mouseY = event.pageY;
});

const width = window.innerWidth;
const height = window.innerHeight;

const uzumaki = new UzumakiShader(innerWidth, innerHeight);
const uzumakiEffect = addEffect("uzumaki", uzumaki);
uzumaki.uniforms = uzumakiEffect.pass.uniforms;

effectList.push(
  addEffect("monochrome", new MonochromeShader()),
  addEffect("nega", new NegativePositiveShader()),
  addEffect("sepiaTone", new SepiaToneShader()),
  addEffect("mosaic", new MosaicShader(width, height)),
  addEffect("diffusion", new DiffusionShader(width, height)),
  uzumakiEffect,
  addEffect("threshold", new ThresholdShader()),
  addEffect("randomDither", new RandomDitherShader()),
  addEffect("bayerDither", new BayerDitherShader(width, height))
);

tick();

function changeShader(id, enabled) {
  normalRenderMode = false;

  // 該当する項目を変更
  const effect = effectList.find((item) => item.id === id);
  if (effect) {
    effect.pass.enabled = enabled;
  }

  // エフェクトリスの状態にあわせて更新
  let renderToScreen = false;
  for (let i = 0; i < effectList.length; i++) {
    const effect = effectList[i];

    if (effect.pass.enabled && !renderToScreen) {
      effect.pass.renderToScreen = true;
      renderToScreen = true;
    } else {
      effect.pass.renderToScreen = false;
    }
  }
  if (!renderToScreen) {
    normalRenderMode = true;
  }
}

function changeDisplayedMesh(type) {
  objects.change(type);
}

function tick() {
  requestAnimationFrame(tick);
  if (normalRenderMode) {
    // 通常モードの場合
    renderer.render(scene, camera);
  } else {
    // エフェクトの適用が必要な場合
    composer.render();
  }
  //  マウス位置を更新
  uzumaki.setMousePos(mouseX, mouseY);
  objects.onUpdate();
}

function addEffect(name, shader) {
  
  const material = new THREE.RawShaderMaterial({
    defines: Object.assign({}, shader.defines || {}),
    uniforms: shader.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    glslVersion: THREE.GLSL3, 
  });

  const pass = new ShaderPass(material);
  pass.inputColorSpace = THREE.LinearSRGBColorSpace;
  pass.outputColorSpace = THREE.LinearSRGBColorSpace;

  composer.addPass(pass);
  pass.renderToScreen = false;
  pass.enabled = false;
  const effect = { id: name, material: shader, pass: pass };

  return effect;
}
