import * as THREE from 'three';
import triangleUtils from './triangleUtils';
import TWEEN from "@tweenjs/tween.js";

class Triangle {

    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.data = props.data;
        this.mesh = null;
        this.height = 0.06;
        this.time = 0;
        this.maxTime = 300; //in Sekunden
        this.maxHeight = 100;
        this.tween = null;
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
        var uniforms = triangleUtils.GetUniforms(this.data.Color,{r:1,g:1,b:1}, 0, 20, 0.1, this.store.state.triangleOpacity)

        //MeshBasicMaterial
        this.material = triangleUtils.getMaterial(uniforms)

        this.mesh = new THREE.Mesh(geometry, this.material);
        //this.mesh.renderOrder = 12;
        var pos = this.mesh.position;
        this.mesh.position.set(pos.x, pos.y + this.data.idx * this.height, pos.z);

        this.xr.Scene.add(this.mesh);
        this.xr.Events.addEventListener("OnAnimationLoop", this.AnimateTriangle);

        this.store.watch(state => state.themeLerp, (newValue) => {
            triangleUtils.UpdateMaterial(this.material, this.store, this.xr)
        })
    }


    AnimateTriangle = (time) => {
        if (this.mesh != null) {
            var pos = this.mesh.position;
            this.mesh.position.set(pos.x, pos.y + this.store.state.speed / 10, pos.z);
            this.time += time.elapsedTime;
            if (this.mesh.position.y > this.maxHeight) {
                this.DeleteTriangle();
            } else if (this.time >= this.maxTime * 10000) {
                this.DeleteTriangle();
            } 
             


        }
    }

    DeleteTriangle = () => {
        if (this.tween != null) { return; }
        var lerpObject = { lerp:this.mesh.material.uniforms.alpha.value};
        this.tween = new TWEEN.Tween(lerpObject).to({
            lerp: 0.0
        },
            2000
        ).onUpdate((v) => {
            this.mesh.material.uniforms.alpha.value = v.lerp;
            this.mesh.material.uniformsNeedsUpdate = true;

        }).onComplete(() => {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.xr.Scene.remove(this.mesh);
            this.xr.Events.removeEventListener("OnAnimationLoop", this.AnimateTriangle);
        }).start();

    }
}
export default Triangle;