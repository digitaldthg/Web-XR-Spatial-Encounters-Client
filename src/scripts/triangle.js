import * as THREE from 'three';
import { Color, DoubleSide, Vector2, Vector3 } from 'three';

class Triangle {

    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.data = props.data;
        this.mesh = null;
        this.delta = 0;
        this.clock = null;
        this.Init();
    }

    Init() {
        var positions = this.data.Positions;
        if (positions == null || Object.keys(positions).length < 2) {
            return;
        }
        var height = 0.1;
        var geometry = new THREE.BufferGeometry();
        var vertices = null;
        var uvs = null;
        var r = null;

        if (Object.keys(positions).length >= 3) {
            r = this.GetTriangle(positions, height);
        } else if (Object.keys(positions).length == 2) {
            r = this.GetLine(positions, height)
        }

        vertices = r.vertex;
        uvs = r.uv;

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        var colors = this.data.Color;
        console.log("COLORS ", colors)

        if (colors.length == 2) {
            colors[2] = colors[1];
        }

        let uniforms = {
            colorA: { type: 'vec3', value: new THREE.Color(colors[0].r, colors[0].g, colors[0].b) },
            colorB: { type: 'vec3', value: new THREE.Color(colors[1].r, colors[1].g, colors[1].b) },
            colorC: { type: 'vec3', value: new THREE.Color(colors[2].r, colors[2].g, colors[2].b) }
        }
        //MeshBasicMaterial

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
            side: DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);

        var pos = this.mesh.position;
        this.mesh.position.set(pos.x, pos.y + this.data.idx * height, pos.z);

        this.xr.Scene.add(this.mesh);
        this.xr.Events.addEventListener("OnAnimationLoop", this.AnimateTriangle);
        this.clock = new THREE.Clock();
    }
    vertexShader() {
        return `
          varying vec2 vUv; 
      
            void main() {
                vUv = uv; 
                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition; 
            }                  
        `
    }

    fragmentShader() {
        return `
           uniform vec3 colorA;
            uniform vec3 colorB;
            uniform vec3 colorC;
            varying vec2 vUv;
      
      
        void main() {
            if(vUv.x <0.5){
                gl_FragColor = vec4(mix(colorA, colorB, vUv.x * 2.0), 1.0);
            }else{
                gl_FragColor = vec4(mix(colorB, colorC, (vUv.x - 0.5) * 2.0), 1.0);
            }
          
        }
      
        `
    }

    AnimateTriangle = () => {
        if (this.mesh != null) {
            var pos = this.mesh.position;
            this.mesh.position.set(pos.x, pos.y + this.store.state.speed, pos.z);
        }
    }

    GetTriangle(positions, height) {
        var vertices = new Float32Array([
            //First Side
            positions[0].x, 0, positions[0].z,
            positions[0].x, height, positions[0].z,
            positions[1].x, height, positions[1].z,

            positions[0].x, 0, positions[0].z,
            positions[1].x, height, positions[1].z,
            positions[1].x, 0, positions[1].z,

            //SecondSide
            positions[1].x, 0, positions[1].z,
            positions[1].x, height, positions[1].z,
            positions[2].x, height, positions[2].z,

            positions[1].x, 0, positions[1].z,
            positions[2].x, height, positions[2].z,
            positions[2].x, 0, positions[2].z,

            //thirdSide
            positions[2].x, 0, positions[2].z,
            positions[2].x, height, positions[2].z,
            positions[0].x, height, positions[0].z,

            positions[2].x, 0, positions[2].z,
            positions[0].x, height, positions[0].z,
            positions[0].x, 0, positions[0].z
        ]);

        var uvs = new Float32Array([
            //First Side
            0, 0,
            0, 0,
            0.5, 0,

            0, 0,
            0.5, 0,
            0.5, 0,

            //SecondSide
            0.5, 0,
            0.5, 0,
            1.0, 0,

            0.5, 0,
            1.0, 0,
            1.0, 0,

            //thirdSide
            1.0, 0,
            1.0, 0,
            0, 0,

            1.0, 0,
            0, 0,
            0, 0,
        ]);

        return { vertex: vertices, uv: uvs };
    }

    GetLine(positions, height) {
        var vertices = new Float32Array([
            //First Side
            positions[0].x, 0, positions[0].z,
            positions[0].x, height, positions[0].z,
            positions[1].x, height, positions[1].z,

            positions[0].x, 0, positions[0].z,
            positions[1].x, height, positions[1].z,
            positions[1].x, 0, positions[1].z,
        ]);

        var uvs = new Float32Array([
            //First Side
            0, 0,
            0, 0,
            0.5, 0,

            0, 0,
            0.5, 0,
            0.5, 0,
        ]);

        return { vertex: vertices, uv: uvs };

    }


}
export default Triangle;