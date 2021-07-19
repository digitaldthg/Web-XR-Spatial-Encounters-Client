import * as THREE from 'three';

class LerpMaterial {
  constructor(opts){

    console.log("LerpMaterial" , opts),

    this.lerp_shader = {
      uniforms: {
          "alpha":  { 
            type: "f", 
            value: 0
          },
          "texture_1" : {
            type : "sampler2D",
            value : null
          },
          "texture_2" : {
            type : "sampler2D",
            value : null
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
          "uniform float alpha;",
          
          "void main() {",
              "vec4 tex_1 = texture2D(texture_1, vUv);",
              "vec4 tex_2 = texture2D(texture_2, vUv);",

              "vec4 finalCol = mix( tex_1 , tex_2 , alpha);",

              "gl_FragColor = vec4( finalCol.rgb , 1.0 );",
          "}"
      ].join("\n")
    };

    var outline_material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(this.lerp_shader.uniforms),
        vertexShader: this.lerp_shader.vertex_shader,
        fragmentShader: this.lerp_shader.fragment_shader
    });

    outline_material.side = THREE.BackSide;

    return outline_material;


  }
}



export default LerpMaterial;