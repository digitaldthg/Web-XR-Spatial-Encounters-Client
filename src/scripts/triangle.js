import * as THREE from 'three';
import { Color, Vector3 } from 'three';

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

        if (Object.keys(positions).length >= 3) {
            vertices = this.GetTriangle(positions, height)
        } else if (Object.keys(positions).length == 2) {
            vertices = this.GetLine(positions,height)
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        var color = this.data.Color;
        const material = new THREE.MeshBasicMaterial({ color: new Color(color.r, color.g, color.b), side: 2 });
        this.mesh = new THREE.Mesh(geometry, material);

        var pos = this.mesh.position;
        this.mesh.position.set(pos.x, pos.y + this.data.idx*height, pos.z);

        this.xr.Scene.add(this.mesh);
        this.xr.Events.addEventListener("OnAnimationLoop", this.AnimateTriangle);
        this.clock = new THREE.Clock();
    }

    AnimateTriangle = () => {
        if (this.mesh != null) {
            var pos = this.mesh.position;
            this.mesh.position.set(pos.x, pos.y + this.store.state.speed, pos.z);
        }
    }

    GetTriangle(positions,height) {
        return new Float32Array([
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
    }

    GetLine(positions,height) {
        return new Float32Array([
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
        ]);
    }

}
export default Triangle;