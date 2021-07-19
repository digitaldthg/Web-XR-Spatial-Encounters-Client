const { Group, Vector3, MeshBasicMaterial, DoubleSide, Mesh, Color, Object3D, BoxGeometry, CylinderGeometry , SphereGeometry, Quaternion} = require("three");
import Ring from "../Model/player_cylinder.glb";

class SingleFriend{
  constructor(store , data){
    this.store = store;
    this.xr = store.state.xr;
    this.rings = [];
    this.bottomColor = new Color(0xffffff);
    this.Init(data);
  }
  
  Init(data){
    this.instance = this.Create(data);
    

    console.log("created" , this.instance);
  }

  Create(data){
    var group = new Object3D();
        group.name = "Friend";
    this.xr.Scene.add(group);

    this.head = new Group();
    group.add(this.head);

    var target = new Vector3(data.transform.position.x,data.transform.position.y,data.transform.position.z);
    var origin = new Vector3(0,0,0);

    for(var i=0;i<=5;i++){
      let scale = .2 * i ;
      const geometry = new CylinderGeometry( scale,scale, .06, 64, 2,true );
      const material = new MeshBasicMaterial({side : DoubleSide, color: 0xffff00} );
      const ring = new Mesh( geometry, material );
      
      // var lerper = (origin.clone()).lerp( target, 1 / 5 * i);//.lerpVectors(origin,target, 1 / 5 * i);
      // ring.position.set(lerper.x,lerper.y,lerper.z);
      group.add(ring);
      this.rings.push(ring);
    }

      group.userData.headHeight = data.transform.headHeight;
      group.userData.targetPosition = new Vector3(
        data.transform.position.x,
        data.transform.position.y,
        data.transform.position.z
      );
      group.userData.lastPosition = new Vector3(
        data.transform.position.x,
        data.transform.position.y,
        data.transform.position.z
      );
      group.userData.lastRotation = new Quaternion(
        data.transform.rotation.x,
        data.transform.rotation.y,
        data.transform.rotation.z,
        data.transform.rotation.w,
      )
      
      group.userData.targetRotation = new Quaternion(
        data.transform.rotation.x,
        data.transform.rotation.y,
        data.transform.rotation.z,
        data.transform.rotation.w,
      )
      group.userData.lerpAlpha = 0;
      group.userData.color = Object.assign({}, data.color);
      group.userData.targetReached = true;
    
    return group;
  }

  updateData = (data) => {
    if(typeof(data) == "undefined"){return;}
    
    this.instance.userData.headHeight = data.transform.headHeight;
    this.instance.userData.targetPosition = new Vector3(
      data.transform.position.x,
      data.transform.position.y,
      data.transform.position.z
    );

    this.instance.userData.lastPosition = this.instance.position.clone();
    this.instance.userData.lastPosition.y = this.head.position.y;

    this.instance.userData.lerpAlpha = 0;
    this.instance.userData.color = Object.assign( {}, data.color );
    this.instance.userData.targetReached = false; 
    
  }
  EaseAlpha(x){
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }
  LerpFloat(start,end, alpha){
    return start * (1 - alpha) + end * alpha;
  }
  LerpVector(start , end, alpha){

    return new Vector3(
      this.LerpFloat(start.x,end.x,this.EaseAlpha(alpha) ),
      this.LerpFloat(start.y,end.y,this.EaseAlpha(alpha) ),
      this.LerpFloat(start.z,end.z,this.EaseAlpha(alpha) ),
    )
  }
  update = () => {
    if(this.instance.userData.targetReached){return;}
    var newPos = this.instance.userData.lastPosition.lerp(
          this.instance.userData.targetPosition,
          this.instance.userData.lerpAlpha / 100
        );
    var lerpPos = this.LerpVector(
      this.instance.userData.lastPosition, 
      this.instance.userData.targetPosition,
      this.instance.userData.lerpAlpha / 100);

    var newQuat = this.instance.userData.lastRotation.slerp(this.instance.userData.targetRotation , this.instance.userData.lerpAlpha / 100);
    this.instance.position.set(newPos.x, 0, newPos.z);
    this.head.position.set(0,newPos.y,0);

    this.head.quaternion.set(newQuat.x, newQuat.y, newQuat.z, newQuat.w);
  
    let color = new Color(this.instance.userData.color.r,this.instance.userData.color.g,this.instance.userData.color.b);
    
    var target = new Vector3(lerpPos.x,lerpPos.y,lerpPos.z);
    var origin = new Vector3(0,0,0);

    this.rings.map((ring,index)=>{
      var lerpAlpha = (1 / (this.rings.length - 1)) * index;
      var lerper = (target.clone()).lerp( origin, lerpAlpha);//.lerpVectors(origin,target, 1 / 5 * i);
      ring.position.set(0,lerper.y,0);
      
      //Ringfarbe lerpen
      ring.material.color = this.bottomColor.clone().lerp(color, Math.min(1, Math.max(0, target.y / this.instance.userData.headHeight )  )  );
    });  
    
    //Headfarbe lerpen
    //this.head.material.color = this.bottomColor.clone().lerp(color, Math.min(1, Math.max(0, target.y / this.instance.userData.headHeight )  )  );

   

    if (this.instance.userData.lerpAlpha >= 100) {
      
      this.instance.userData.lerpAlpha = 0;
      this.instance.userData.targetPosition = null;
      this.instance.userData.lastPosition = newPos.clone();
      this.instance.userData.targetReached = true;
    }


    
    this.instance.userData.lerpAlpha++;

  }

  delete(){
    this.xr.Scene.remove(this.instance);
  }

}


export default SingleFriend;