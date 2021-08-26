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
    TextureLoader,
} from "three";
import TWEEN from "@tweenjs/tween.js";
import alphaMapV from "../Model/environment/textures/exploding-circle-vertical_StripesV.png"
import alphaMapH from "../Model/environment/textures/exploding-circle-vertical_StripesH.png"

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

        //VERTICAL MATERIAL
        const Vmaterial = new MeshBasicMaterial({
            side: DoubleSide,
            color: color,
            opacity: 1,
            transparent: true,
            alphaMap: null
        });

        var Prom1 = new Promise((resolve) => {
            this.xr.CustomTextureLoader.load(alphaMapV).then((map) => {
                Vmaterial.alphaMap = map;
                this.verticalMesh = this.CreateMesh(color, geometry, Vmaterial);
                resolve();
            })
        })

        //HORIZONTAL MATERIAL
        const Hmaterial = new MeshBasicMaterial({
            side: DoubleSide,
            color: color,
            opacity: 1,
            transparent: true,
            alphaMap: null
        });
        for (var i = 0; i < 5; i++) {
            this.horizontalMeshs.push(this.CreateMesh(color, geometry, Hmaterial))
        }


        Promise.all([Prom1]).then((values) => {
            this.Lerp();
        });


    }
    Lerp = () => {
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
                var verticalScale = this.verticalMesh.scale.y + v.lerp * 30;
                var horizontalScale = this.verticalMesh.scale.x + v.lerp**2 * 0.1;

                this.verticalMesh.position.setY(positionY);
                this.verticalMesh.scale.set(horizontalScale,verticalScale,horizontalScale);

                this.verticalMesh.material.opacity = 1 - v.lerp;

                //UPDATE HORIZONTAL
                this.horizontalMeshs.forEach((ring, idx) => {
                    var scale = ring.scale.x + v.lerp * (0.1 + Math.pow(idx, 2) * 0.2)
                    ring.scale = new Vector3(scale, ring.scale.y, scale);
                    ring.material.opacity = 1 - v.lerp * 2;
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
        //mesh.renderOrder = 15
        this.xr.Scene.add(mesh);
        return mesh;
    }


}
export default explodingRing;