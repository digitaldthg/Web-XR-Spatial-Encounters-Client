import * as THREE from 'three';

class LerpMaterial {
  constructor(){
    this.outline_shader = {
      uniforms: {
          "linewidth":  { 
            type: "f", 
            value: 0.004
          },
          "color" : {
            type : "vec3",
            value : new THREE.Color(0xF9C697)
          },
          "time" : {
            type : "f",
            value : 1
          }
      },
      vertex_shader: [
          "uniform float linewidth;",
          "uniform float time;",
          "void main() {",
          "vec4 pos = modelViewMatrix * vec4( position + normal * linewidth, 1.0 );",
          "gl_Position = projectionMatrix * pos;",  
        "}"
        ].join("\n"),
        fragment_shader: [
          "uniform vec3 color;",
          "void main() {",
              "gl_FragColor = vec4( color , 1.0 );",
          "}"
      ].join("\n")
    };

    var outline_material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(this.outline_shader.uniforms),
        vertexShader: this.outline_shader.vertex_shader,
        fragmentShader: this.outline_shader.fragment_shader
    });

    outline_material.side = THREE.BackSide;

    return outline_material;


  }
}



export default LerpMaterial;