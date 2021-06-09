import {Vector3} from 'three';


class EnvironmentController {
    constructor(props){
      this.xr = props.xr;
      this.socket = props.socket;
      this.pool = []


      this.Init();
    }

    Init(){
      this.socket.on("server-environment-update", this.UpdateData);
    
      for(var i=0;i<10;i++){
        this.pool.push( this.GetSingleTriangle() );
      }

    }

    UpdateSingleTriangle(triangleIndex, triangleVector, height = .2){

      if(this.pool.length < triangleIndex){return;}

      this.pool[triangleIndex].geometry.vertices[0].set(triangleVector[0].x,triangleVector[0].y,triangleVector[0].z);
      this.pool[triangleIndex].geometry.vertices[3].set(triangleVector[0].x,triangleVector[0].y,triangleVector[0].z);
      this.pool[triangleIndex].geometry.vertices[16].set(triangleVector[0].x,triangleVector[0].y,triangleVector[0].z);

      this.pool[triangleIndex].geometry.vertices[2].set(triangleVector[0].x,triangleVector[0].y + height,triangleVector[0].z);
      this.pool[triangleIndex].geometry.vertices[13].set(triangleVector[0].x,triangleVector[0].y + height,triangleVector[0].z);
      this.pool[triangleIndex].geometry.vertices[17].set(triangleVector[0].x,triangleVector[0].y + height,triangleVector[0].z);

      this.pool[triangleIndex].geometry.vertices[4].set(triangleVector[1].x,triangleVector[1].y,triangleVector[1].z);
      this.pool[triangleIndex].geometry.vertices[6].set(triangleVector[1].x,triangleVector[1].y,triangleVector[1].z);
      this.pool[triangleIndex].geometry.vertices[9].set(triangleVector[1].x,triangleVector[1].y,triangleVector[1].z);

      this.pool[triangleIndex].geometry.vertices[1].set(triangleVector[1].x,triangleVector[1].y + height,triangleVector[1].z);
      this.pool[triangleIndex].geometry.vertices[5].set(triangleVector[1].x,triangleVector[1].y + height,triangleVector[1].z);
      this.pool[triangleIndex].geometry.vertices[8].set(triangleVector[1].x,triangleVector[1].y + height,triangleVector[1].z);
//
      this.pool[triangleIndex].geometry.vertices[10].set(triangleVector[2].x,triangleVector[2].y,triangleVector[2].z);
      this.pool[triangleIndex].geometry.vertices[12].set(triangleVector[2].x,triangleVector[2].y,triangleVector[2].z);
      this.pool[triangleIndex].geometry.vertices[15].set(triangleVector[2].x,triangleVector[2].y,triangleVector[2].z);

      this.pool[triangleIndex].geometry.vertices[7].set(triangleVector[2].x,triangleVector[2].y  + height,triangleVector[2].z);
      this.pool[triangleIndex].geometry.vertices[11].set(triangleVector[2].x,triangleVector[2].y + height,triangleVector[2].z);
      this.pool[triangleIndex].geometry.vertices[14].set(triangleVector[2].x,triangleVector[2].y + height,triangleVector[2].z);


      this.pool[triangleIndex].geometry.verticesNeedUpdate = true;
      this.pool[triangleIndex].geometry.normalsNeedUpdate = true;

    }


    GetSingleTriangle = () => {
      var geom = new THREE.Geometry();
      var verts = [

        new THREE.Vector3(0,0,0),  // 0
        new THREE.Vector3(1,0,1), // 1
        new THREE.Vector3(0,0,1), // 2

        new THREE.Vector3(0,0,0),  // 3
        new THREE.Vector3(1,0,0), // 4
        new THREE.Vector3(1,0,1), // 5

        new THREE.Vector3(1,0,0),  // 6
        new THREE.Vector3(2,0,1), // 7
        new THREE.Vector3(1,0,1), // 8

        new THREE.Vector3(1,0,0),  // 9
        new THREE.Vector3(2,0,0), // 10
        new THREE.Vector3(2,0,1), // 11
        
        new THREE.Vector3(2,0,0),  // 12
        new THREE.Vector3(3,0,1), // 13
        new THREE.Vector3(2,0,1), // 14

        new THREE.Vector3(2,0,0),  // 15
        new THREE.Vector3(3,0,0), // 16
        new THREE.Vector3(3,0,1), // 17

      ]

      verts.map((v)=>{
        geom.vertices.push(v);
       
      })

      geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
      geom.faces.push( new THREE.Face3( 3, 4, 5 ) );
      geom.faces.push( new THREE.Face3( 6, 7, 8 ) );
      geom.faces.push( new THREE.Face3( 9, 10, 11 ) );
      geom.faces.push( new THREE.Face3( 12, 13, 14 ) );
      geom.faces.push( new THREE.Face3( 15, 16, 17 ) );
      

      geom.normalsNeedUpdate = true;
      geom.computeVertexNormals();
      var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial({
        side : THREE.DoubleSide,
      }) );
      this.xr.Scene.add(object);

      return object;
    }

    UpdateData = (data) => {
      //console.log("data" , data.Triangles, this.pool[0]);

      this.pool.map((tri, index)=>{
        tri.visible = index < data.Triangles.length;
      });

      data.Triangles.map((triangle, index)=>{
        this.UpdateSingleTriangle( index, triangle.Positions, .1);
      });
      
    }
}

export default EnvironmentController;