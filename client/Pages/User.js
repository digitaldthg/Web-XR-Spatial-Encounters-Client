import { Vector3 } from "three";

class User{
  

  constructor(scene, data, firstUser,gizmo){
    this.xr = scene;
    this.id = data.id;
    this.instance = this.CreateUser();
    this.lastPosition = new Vector3(0,0,0);
    this.isControlled = false;

    this.xr.Scene.add(this.instance);

    this.controlled = firstUser;


    if(firstUser){
      gizmo.attach(this.instance);
    }
  }

  CreateUser(){
    var cubeGeo = new THREE.BoxGeometry(.1,.1,.1);
    var cubeMat = new THREE.MeshNormalMaterial();
    let userMesh = new THREE.Mesh(cubeGeo, cubeMat);

    return userMesh;
    
  }

  Update(t){
    //console.log(this.controlled);
    
    // if(this.controlled){

    //   this.instance.position.set(
    //     Math.sin(t * .001) * 2,
    //     0,
    //     Math.cos(t * .001) * 2,
    //   );
    // }
  }

  UpdateUser(data){

    console.log(data);
    this.instance.position.set(data.transform.position.x, data.transform.position.y,data.transform.position.z);
  }

}


export default User;