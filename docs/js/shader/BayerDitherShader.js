import { LUMINANCE, VERTEX_SHADER } from "./ShaderUtil.js";

// language=GLSL
const FRAGMENT_SHADER = `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 vScreenSize;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float x = floor( vUv.x * vScreenSize.x  );
  float y = floor( vUv.y * vScreenSize.y );
  mat4 m = mat4(
    vec4( 0.0,  8.0,    2.0,    10.0),
    vec4( 12.0, 4.0,    14.0,   6.0),
    vec4( 3.0,  11.0,   1.0,    9.0),
    vec4( 15.0, 7.0,    13.0,   5.0)
  );
  float xi = mod( x,4.0) ;
  float yi = mod( y,4.0) ;
  float threshold = 0.0;
  
  if( xi == 0.0 )
  {  
    if( yi == 0.0 ) {threshold = m[0][0]; }
    if( yi == 1.0 ) {threshold = m[0][1]; }
    if( yi == 2.0 ) {threshold = m[0][2]; }
    if( yi == 3.0 ) {threshold = m[0][3]; }
  }
  if( xi == 1.0) {
    if( yi == 0.0 ) {threshold = m[1][0]; }
    if( yi == 1.0 ) {threshold = m[1][1]; }
    if( yi == 2.0 ) {threshold = m[1][2]; }
    if( yi == 3.0 ) {threshold = m[1][3]; }
  }
  if( xi == 2.0) {
    if( yi == 0.0 ) {threshold = m[2][0]; }
    if( yi == 1.0 ) {threshold = m[2][1]; }
    if( yi == 2.0 ) {threshold = m[2][2]; }
    if( yi == 3.0 ) {threshold = m[2][3]; }
  }
  if( xi == 3.0) {
    if( yi == 0.0 ) {threshold = m[3][0]; }
    if( yi == 1.0 ) {threshold = m[3][1]; }
    if( yi == 2.0 ) {threshold = m[3][2]; }
    if( yi == 3.0 ) {threshold = m[3][3]; }
  }
  color = color * 16.0;
  
  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
  if (v <threshold ) {
    color.x = 0.0;
    color.y = 0.0;
    color.z = 0.0;
  } else {
    color.x = 1.0;
    color.y = 1.0;
    color.z = 1.0;
  }
  gl_FragColor = color;
}
`;

/**
 * @author Nozomi Nohara / http://github.com/ics-nohara
 * Bayer dither
 */
export class BayerDitherShader {
  constructor(width, height) {
    this.defines = LUMINANCE;
    this.uniforms = {
      tDiffuse: { type: "t", value: null },
      vScreenSize: { type: "v2", value: new THREE.Vector2(0.0, 0.0) }
    };
    this.vertexShader = VERTEX_SHADER;
    this.fragmentShader = FRAGMENT_SHADER;
    this.setSize(width, height);
  }

  setSize(width, height) {
    this.uniforms["vScreenSize"].value.x = width;
    this.uniforms["vScreenSize"].value.y = height;
  }
}
