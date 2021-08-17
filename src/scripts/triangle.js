import * as THREE from 'three';
import triangleUtils from './triangleUtils';

class Triangle {

    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.data = props.data;
        this.mesh = null;
        this.height = 0.06;
        this.time = 0;
        this.maxTime = 6; //in Sekunden
        this.maxHeight = 50;
        this.Init();
    }

    Init() {
        var positions = this.data.Positions;
        if (positions == null || Object.keys(positions).length < 2) {
            if (this.mesh != null) {

                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
                this.xr.Scene.remove(this.mesh);
            }
            return;
        }
        var geometry = triangleUtils.GetGeometry(positions, this.height)
        var uniforms = triangleUtils.GetColor(this.data.Color)

        //MeshBasicMaterial
        this.material = triangleUtils.getMaterial(uniforms)

        this.mesh = new THREE.Mesh(geometry, this.material);

        var pos = this.mesh.position;
        this.mesh.position.set(pos.x, pos.y + this.data.idx * this.height, pos.z);

        this.xr.Scene.add(this.mesh);
        this.xr.Events.addEventListener("OnAnimationLoop", this.AnimateTriangle);

        this.store.watch(state => state.themeLerp, (newValue) => {
            triangleUtils.UpdateMaterial(this.material,this.store,this.xr)
        })
    }


    AnimateTriangle = (time) => {
        if (this.mesh != null) {
            var pos = this.mesh.position;
            this.mesh.position.set(pos.x, pos.y + this.store.state.speed / 10, pos.z);

            if (this.mesh.position.y > this.maxHeight) {
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
                this.xr.Scene.remove(this.mesh);
                this.xr.Events.removeEventListener("OnAnimationLoop", this.AnimateTriangle);
            }

            this.time += time.elapsedTime;
            if(this.time >= this.maxTime*10000){
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
                this.xr.Scene.remove(this.mesh);
                this.xr.Events.removeEventListener("OnAnimationLoop", this.AnimateTriangle);
            }

        }
    }

  



}
export default Triangle;