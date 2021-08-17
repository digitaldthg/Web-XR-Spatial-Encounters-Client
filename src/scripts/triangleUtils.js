import * as THREE from 'three';
import { Color, DoubleSide, Vector2, Vector3 } from 'three';
const triangleUtils = {
    LerpFloat(start, end, alpha) {
        return start * (1 - alpha) + end * alpha;
    },
    LerpVector(start, end, alpha) {

        return new Vector3(
            this.LerpFloat(start.x, end.x, alpha),
            this.LerpFloat(start.y, end.y, alpha),
            this.LerpFloat(start.z, end.z, alpha),
        )
    },
    GetUniforms(colorData, fogColor={r:1,g:1,b:1}, fogNear= 0, fogFar=20, fogDensity=0.1, alpha=1.0) {
        var colors = colorData;

        if (colors.length == 2) {
            colors[2] = colors[1];
        }

        let uniforms = {
            colorA: { type: 'vec3', value: new Color(colors[0].r, colors[0].g, colors[0].b) },
            colorB: { type: 'vec3', value: new Color(colors[1].r, colors[1].g, colors[1].b) },
            colorC: { type: 'vec3', value: new Color(colors[2].r, colors[2].g, colors[2].b) },
            fogColor: { type: "c", value: new Color(fogColor.r,fogColor.g,fogColor.b) },
            fogNear: { type: "f", value: fogNear},
            fogFar: { type: "f", value: fogFar },
            fogDensity: { type: "f", value: fogDensity },
            alpha: { type: "f", value: alpha },
        }
        return uniforms
    },
    GetGeometry(positions, height) {
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
        return geometry
    },

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
            0.33, 0,

            0, 0,
            0.33, 0,
            0.33, 0,

            //SecondSide
            0.33, 0,
            0.33, 0,
            0.66, 0,

            0.33, 0,
            0.66, 0,
            0.66, 0,

            //thirdSide
            0.66, 0,
            0.66, 0,
            1.0, 0,

            0.66, 0,
            1.0, 0,
            1.0, 0,
        ]);

        return { vertex: vertices, uv: uvs };
    },

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

    },
    getMaterial(uniforms) {
        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
            side: DoubleSide,
            fog: true,
            transparent: true,
            depthWrite: false
        });
    },

    vertexShader() {
        return `
          varying vec2 vUv; 
      
            void main() {
                vUv = uv; 
                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition; 
            }                  
        `
    },

    fragmentShader() {
        return `
           uniform vec3 colorA;
            uniform vec3 colorB;
            uniform vec3 colorC;
            varying vec2 vUv;
            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;
            uniform float fogDensity;
            uniform float alpha;
      
      
        void main() {
            if(vUv.x <0.33){
                gl_FragColor = vec4(mix(colorA, colorB, vUv.x * 3.0), alpha);
            }else if(vUv.x <0.66){
                gl_FragColor = vec4(mix(colorB, colorC, (vUv.x - 0.33) * 3.0), alpha);
            }else{
                gl_FragColor = vec4(mix(colorC, colorA, (vUv.x - 0.66) * 3.0), alpha);
            }

            #ifdef USE_FOG
              #ifdef USE_LOGDEPTHBUF_EXT
                  float depth = gl_FragDepthEXT / gl_FragCoord.w;
             #else
                  float depth = gl_FragCoord.z / gl_FragCoord.w;
              #endif
             float fogFactor = smoothstep( fogNear, fogFar, depth );
              gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogDensity*fogFactor*10.0);
            #endif
          
        }
      
        `
    },
    UpdateMaterial(material,store,xr){
        material.uniforms.fogColor.value = xr.Scene.fog.color;
        material.uniforms.fogNear.value = 0; //this.xr.Camera.near;
        material.uniforms.fogFar.value = 20; //this.xr.Camera.far;
        material.uniforms.fogDensity.value = store.state.fogDistance;
        material.uniforms.alpha.value = store.state.triangleOpacity;
        material.uniformsNeedsUpdate = true;
    }


}
export default triangleUtils;