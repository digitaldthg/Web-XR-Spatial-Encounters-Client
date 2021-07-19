import {
    Mesh,
    CylinderGeometry,
    DoubleSide,
    BoxGeometry,
    Group,
    MeshNormalMaterial,
    MeshBasicMaterial,
    Color,
    Vector3,
    Quaternion,
    Raycaster,
    CircleGeometry,
  } from "three";

class explodingRing {
    constructor(props) {
        this.xr = props.xr;
        this.mesh = null;
        this.scale = 25 * 0.03;
        this.position = props.position;
        this.currentColor = props.currentColor;
        this.time = 0;
        this.Init();
    }
    Init=() =>{
        console.log("Color ",this.currentColor)
        const geometry = new CylinderGeometry(this.scale, this.scale, 0.06, 64, 2, true);
        const material = new MeshBasicMaterial({
            side: DoubleSide,
            color: this.currentColor,
        });
        this.mesh = new Mesh(geometry, material);
        this.mesh.position.set(this.position.x,this.position.y,this.position.z)
        this.xr.Scene.add(this.mesh);

        this.xr.Events.addEventListener("OnAnimationLoop", this.Update);
    }

    Update = (clock) => {
        this.time += clock.getDelta()

        var scale = this.mesh.scale.x += clock.getDelta()*200000
        this.mesh.scale = new Vector3(scale, this.mesh.scale.y, scale);

        if(this.time > 0.02){
            console.log("DESTROY")
            this.xr.Scene.remove(this.mesh);
            this.xr.Events.removeEventListener("OnAnimationLoop", this.Update);
        }
    }

}
export default explodingRing;