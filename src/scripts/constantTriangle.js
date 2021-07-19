import * as THREE from 'three';
import triangleUtils from './triangleUtils';
import { Color, DoubleSide, Vector2, Vector3 } from 'three';

class ConstantTriangle {
    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.mesh = null;
        this.height = 0.1
        this.Init();
        this.xr.Scene.add(this.mesh);
        
    }
    Init() {
        this.mesh = new THREE.Mesh();
    }

    UpdateTriangle(triData) {
        var positions = triData.Positions;
        if (positions == null || Object.keys(positions).length < 2) {
            return;
        }
        var geometry = triangleUtils.GetGeometry(positions,this.height)
        var uniforms = triangleUtils.GetColor(triData.Color)

        //MeshBasicMaterial

        const triMaterial = triangleUtils.getMaterial(uniforms);

        this.mesh.material = triMaterial;
        this.mesh.geometry = geometry;
    }
}
export default ConstantTriangle;