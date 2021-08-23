class RotatingObj {

    constructor(xr, mesh){
      this.mesh = mesh;
      this.xr = xr;

      this.init();
    }
    init= ()=>{
        this.xr.Events.addEventListener(
            "OnAnimationLoop",
            this.updateFunction
          );
    }

    updateFunction = (clock)=>{
        this.mesh.rotation.set(this.mesh.rotation.x, this.mesh.rotation.y+=0.001,this.mesh.rotation.z)
    }

  }
  
  export default RotatingObj;