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
        
        this.triData = null;
        this.positions = [];
        this.lastPositions = null;
        this.nextPositions = null;
        this.positionAlphas = null;
    }
    Init() {
        this.mesh = new THREE.Mesh();
    }

    UpdateTriangle() {



        console.log(this.nextPositions.length , this.lastPositions.length);

        //falls mehr Positionen zurückkommen als vorher
        // if(this.nextPositions.length > this.lastPositions.length){
        //   let nextPos = [...this.nextPositions];
        //   let lastPos = [...this.lastPositions];

        //   this.lastPositions.push(...lastPos.slice(-(nextPos.length - lastPos.length)));
        // }
        
        // //falls weniger Positionen zurückkommen als vorher
        // if(this.nextPositions.length < this.lastPositions.length){

        //   let nextPos = [...this.nextPositions];
        //   let lastPos = [...this.lastPositions];

        //   this.lastPositions = [...lastPos.slice(0, (lastPos.length - nextPos.length))];
        // }

        //console.log(this.lastPositions, this.nextPositions);


        this.positions = this.nextPositions.map((pos, index)=>{
          //if(this.positionAlphas[index] == null){return pos;}
          if(typeof(this.lastPositions[index]) == "undefined"){return pos;}
          if(typeof(pos) == "undefined"){return this.lastPositions[index];}


          return this.lastPositions[index].lerp( pos , .05);

          return triangleUtils.LerpVector(this.lastPositions[index] , pos, this.positionAlphas[index] / 100);
        });

        //console.log(this.positions);
        
        // this.positionAlphas = this.positionAlphas.map((p, index)=>{
        //   return p > 100 ? null : p + 10;
        // });

        var geometry = triangleUtils.GetGeometry(this.positions,this.height)
        var uniforms = triangleUtils.GetColor(this.triData.Color)

        //MeshBasicMaterial

        const triMaterial = triangleUtils.getMaterial(uniforms);

        this.mesh.material = triMaterial;
        this.mesh.geometry = geometry;
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
        console.log("triData.Positions" , newPos);

        this.lastPositions = this.lastPositions == null ? newPos : [...this.positions];
        
        //setzt die Alphawerte wieder auf 0
        //this.positionAlphas = this.nextPositions.map(()=> 0);
       
        
    }

    Delete = ()=>{

      this.xr.Scene.remove(this.mesh);

    }
}
export default ConstantTriangle;