import * as THREE from 'three';
import { Vector2 } from 'three';

class LerpMaterial {
  constructor(opts) {
    this.material = null;

    this.lerp_shader = {
      uniforms: {
        "alpha": {
          type: "f",
          value: 0
        },
        "texture_1": {
          type: "sampler2D",
          value: null
        },
        "texture_2": {
          type: "sampler2D",
          value: null
        }
        ,
        "alpha_texture_1": {
          type: "sampler2D",
          value: null
        },
        "alpha_texture_2": {
          type: "sampler2D",
          value: null
        },
        "hasAlphaMap_1": {
          value: false
        },
        "hasAlphaMap_2": {
          value: false
        },
        "textureRepeat_1": {
          type: "vec2",
          value: new Vector2(1,1)
        },
        "textureRepeat_2": {
          type: "vec2",
          value: new Vector2(1,1)
        } ,
        "textureOffset_1": {
          type: "vec2",
          value: new Vector2(0,0)
        },
        "textureOffset_2": {
          type: "vec2",
          value: new Vector2(0,0)
        }
      },
      vertex_shader: [

        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "vec4 pos = modelViewMatrix * vec4( position , 1.0 );",
        "gl_Position = projectionMatrix * pos;",
        "}"

      ].join("\n"),
      fragment_shader: [

        "varying vec2 vUv;",

        "uniform sampler2D texture_1;",
        "uniform sampler2D texture_2;",
        "uniform sampler2D alpha_texture_1;",
        "uniform sampler2D alpha_texture_2;",
        "uniform bool hasAlphaMap_1;",
        "uniform bool hasAlphaMap_2;",
        "uniform float alpha;",
        "uniform vec2 textureRepeat_1;",
        "uniform vec2 textureRepeat_2;",
        "uniform vec2 textureOffset_1;",
        "uniform vec2 textureOffset_2;",

        "void main() {",
        "vec2 uv_1 = vec2(vUv.x*textureRepeat_1.x + textureOffset_1.x, vUv.y*textureRepeat_1.y+textureOffset_1.y);",
        "vec2 uv_2 = vec2(vUv.x*textureRepeat_2.x+textureOffset_2.x, vUv.y*textureRepeat_2.y+textureOffset_2.y);",

        "vec4 tex_1 = texture2D(texture_1, uv_1);",
        "vec4 tex_2 = texture2D(texture_2, uv_2);",

        "vec4 alpha_tex_1 = texture2D(alpha_texture_1,uv_1);",
        "vec4 alpha_tex_2 = texture2D(alpha_texture_2, uv_2);",

        "vec4 finalCol = mix( tex_1 , tex_2 , alpha);",
        "float a_1 = tex_1.a;",
        "float a_2 = tex_2.a;",

        "if(hasAlphaMap_1){a_1 = alpha_tex_1.g;}",
        "if(hasAlphaMap_2){a_2 = alpha_tex_2.g;}",

        "float a = mix(a_1,a_2,alpha);",
        "gl_FragColor = vec4(finalCol.rgb,a);",
        "}"

      ].join("\n")
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(this.lerp_shader.uniforms),
      vertexShader: this.lerp_shader.vertex_shader,
      fragmentShader: this.lerp_shader.fragment_shader
    });
    this.material.transparent = opts.transparent
    this.material.depthWrite = opts.depthWrite
  }
}



export default LerpMaterial;