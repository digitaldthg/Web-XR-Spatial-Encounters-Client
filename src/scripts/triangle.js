import * as THREE from 'three';
import triangleUtils from './triangleUtils';

class Triangle {

    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.data = props.data;
        this.mesh = null;
        this.delta = 0;
        this.clock = null;
        this.height = 0.1
        this.Init();
    }

    Init() {
        var positions = this.data.Positions;
        if (positions == null || Object.keys(positions).length < 2) {
            return;
        }
        var geometry = triangleUtils.GetGeometry(positions,this.height)
        var uniforms = triangleUtils.GetColor(this.data.Color)

        //MeshBasicMaterial
        const material = triangleUtils.getMaterial(uniforms)

        this.mesh = new THREE.Mesh(geometry, material);

        var pos = this.mesh.position;
        this.mesh.position.set(pos.x, pos.y + this.data.idx * this.height, pos.z);

        this.xr.Scene.add(this.mesh);
        this.xr.Events.addEventListener("OnAnimationLoop", this.AnimateTriangle);
        this.clock = new THREE.Clock();
    }
  

    AnimateTriangle = () => {
        if (this.mesh != null) {
            var pos = this.mesh.position;
            this.mesh.position.set(pos.x, pos.y + this.store.state.speed/10, pos.z);
        }
    }

    


}
export default Triangle;