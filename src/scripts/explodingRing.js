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
import TWEEN from "@tweenjs/tween.js";

class explodingRing {
    constructor(props) {
        this.xr = props.xr;
        this.verticalMesh = null;
        this.horizontalMeshs = [];
        this.scale = 25 * 0.03;
        this.position = props.position;
        this.color = props.color;
        this.time = 0;
        this.Init();
    }
    Init = () => {
        var color = new Color(this.color.r, this.color.g, this.color.b)
        const geometry = new CylinderGeometry(this.scale, this.scale, 0.06, 64, 2, true);
        const material = new MeshBasicMaterial({
            side: DoubleSide,
            color: color,
            opacity:1,
            transparent: true
        });

        for (var i = 0; i < 5; i++) {
            this.horizontalMeshs.push(this.CreateMesh(color, geometry, material))
        }
        this.verticalMesh = this.CreateMesh(color, geometry, material);

        var lerpObject = { lerp: 0 };
        const tween = new TWEEN.Tween(lerpObject)
            .to(
                {
                    lerp: 1,
                },
                2000
            )
            .onUpdate((v) => {

                //UPDATE VERTICAL
                var positionY = this.verticalMesh.position.y + v.lerp * 1;
                var verticalScale = this.verticalMesh.scale.y + v.lerp * 10;

                this.verticalMesh.position.setY(positionY);
                this.verticalMesh.scale.setY(verticalScale);
                this.verticalMesh.material.opacity = 1 - v.lerp;

                //UPDATE HORIZONTAL
                this.horizontalMeshs.forEach((ring,idx) => {
                    var scale = ring.scale.x + v.lerp * (0.1+Math.pow(idx,2)*0.2)
                    ring.scale = new Vector3(scale, ring.scale.y, scale);
                    ring.material.opacity = 1 - v.lerp;
                });


            }).onComplete(() => {
                this.xr.Scene.remove(this.verticalMesh);
                this.horizontalMeshs.forEach(ring => {
                    this.xr.Scene.remove(ring);
                })
                
                
            })
            .start(); // Start

    }

    CreateMesh = (color, geometry, material) => {

        var mesh = new Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y, this.position.z)
        this.xr.Scene.add(mesh);
        return mesh;
    }


}
export default explodingRing;