import { Quaternion, Vector3 } from "three";
import UserData from '../Factory/Userdata';

class User{
  

  constructor(scene, data, socket, throughConnection = false){
    this.xr = scene;
    this.id = data.id;
    this.instance = this.CreateUser(throughConnection);
    this.isControlled = false;

    this.socket = socket;
    
    this.xr.Scene.add(this.instance);
    
    this.attachedToGizmo = false;

    this.lastPosition = new Vector3(0,0,0);
    this.lastRotation = new Quaternion(0,0,0,1);
    this.nextPosition = null;
    this.nextRotation = null;

   

    this.lerpAlpha = 0;

    this.xr.Events.addEventListener("OnAnimationLoop" , this.Update);

  }

  CreateUser(throughConnection){

    var cubeGeo =throughConnection ? new THREE.SphereBufferGeometry(.55,32,32) : new THREE.BoxGeometry(1,1,1);
    var cubeMat = new THREE.MeshNormalMaterial();
    let userMesh = new THREE.Mesh(cubeGeo, cubeMat);

    return userMesh;
    
  }

  SetExternalControls = (boolean) => {

    this.isControlled = false;
    this.attachedToGizmo = true;

  }

  Update = (t) => {
    

    if(this.nextPosition != null && this.nextRotation != null && !this.isControlled ){

      var newPos = this.lastPosition.lerp(this.nextPosition , this.lerpAlpha / 100);
      var newQuat = this.lastRotation.slerp(this.nextRotation , this.lerpAlpha / 100);
      this.instance.position.set(newPos.x, newPos.y, newPos.z);
      this.instance.quaternion.set(newQuat.x, newQuat.y, newQuat.z, newQuat.w);
      this.lerpAlpha++;
    }

    if(this.lerpAlpha >= 100){
      this.lerpAlpha = 0;
      this.nextPosition = null;
    }
  
  }

  EmitUser = () =>{

    console.log("EmitUser", this.socket);

     if(this.socket != null && this.isControlled){

      console.log("emit",  this.instance.position);
      this.socket.emit("client-player", UserData({
          id : this.socket.id,
          transform : {
            position : this.instance.position
          }
        })
      );

      this.lastPosition = this.nextPosition =  this.instance.position.clone();
     // this.nextPosition = this.instance.position.clone();
    }
  }

  UpdateUser = (data) => {

    if(!this.isControlled){
      this.nextPosition = new Vector3(data.transform.position.x, data.transform.position.y,data.transform.position.z);
      this.lastPosition = this.instance.position.clone();

      this.nextRotation = new Quaternion(data.transform.rotation.x, data.transform.rotation.y,data.transform.rotation.z,data.transform.rotation.w);
      this.lastRotation = this.instance.quaternion.clone();
    }
    
    this.lerpAlpha = 0;
  }

}


export default User;