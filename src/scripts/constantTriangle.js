import * as THREE from 'three';
import triangleUtils from './triangleUtils';
import { Color, DoubleSide, Vector2, Vector3 } from 'three';

class ConstantTriangle {
    constructor(props) {
        this.xr = props.xr;
        this.store = props.store;
        this.mesh = null;
        this.height = 0.06
        this.Init();
        this.xr.Scene.add(this.mesh);
        
        this.triData = null;
        this.positions = [];
        this.lastPositions = null;
        this.nextPositions = null;
        this.positionAlphas = null;
    }
    Init() {
        this.mesh = new THREE.Mesh();
        this.mesh.renderOrder = 12;
    }

    UpdateTriangle() {
        this.positions = this.nextPositions.map((pos, index)=>{
          //if(this.positionAlphas[index] == null){return pos;}
          if(typeof(this.lastPositions[index]) == "undefined"){return pos;}
          if(typeof(pos) == "undefined"){return this.lastPositions[index];}

          return this.lastPositions[index].lerp( pos , .05);
        });

        var geometry = triangleUtils.GetGeometry(this.positions,this.height)
        var uniforms = triangleUtils.GetUniforms(this.triData.Color,this.xr.Scene.fog.color,0,20,this.store.state.fogDistance)

        //MeshBasicMaterial

        this.triMaterial = triangleUtils.getMaterial(uniforms);

        this.mesh.material = this.triMaterial;
        this.mesh.geometry = geometry;

        triangleUtils.UpdateMaterial(this.triMaterial,this.store,this.xr)
    }

    UpdateTriangleData(triData){

        this.triData = triData;
        var positions = triData.Positions;


        if (positions == null) {
          // this.xr.Scene.remove(this.mesh);
          // this.mesh = null;
          return;
        }

        if(this.mesh == null){
          this.Init();
        }
        

        
        var newPos = triData.Positions.map((v)=>new Vector3(v.x,v.y,v.z));
        
        this.nextPositions = newPos;
        //console.log("triData.Positions" , newPos);

        this.lastPositions = this.lastPositions == null ? newPos : [...this.positions];
       
        
    }

    Delete = ()=>{

      this.xr.Scene.remove(this.mesh);

    }
}
export default ConstantTriangle;