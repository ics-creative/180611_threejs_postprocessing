import * as THREE from "three";
import { Pass } from "three/addons/postprocessing/Pass.js";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";

/**
 * WebGL2.0対応のShaderPass
 * @author ics-nohara
 */
export class ShaderPass2 extends Pass {
  constructor(shader) {
    super();

    this.textureID = "tDiffuse";
    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    this.material = new THREE.RawShaderMaterial({
      defines: Object.assign({}, shader.defines || {}),
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      glslVersion: THREE.GLSL3, // WebGL2.0用のGLSL3を指定
    });

    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer, writeBuffer, readBuffer) {
    if (this.uniforms[this.textureID]) {
      this.uniforms[this.textureID].value = readBuffer.texture;
    }

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}
