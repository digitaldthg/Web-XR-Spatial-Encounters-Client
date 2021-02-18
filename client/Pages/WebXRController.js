
class WebXRController{

  constructor(name,side, scene,camera,renderer,userCamera) {
    
    this.side = side;
    this.name = name;
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.userCamera = userCamera;

    this.onSelectStart = this.onSelectStart.bind(this);
    this.onSelectEnd = this.onSelectEnd.bind(this);
    this.Update = this.Update.bind(this);
    this.buildController = this.buildController.bind(this);

    this.ControllerSetup();
  }

  onSelectStart() {
    console.log(this.name , "was clicked");

    let position = this.renderer.xr.getCamera(this.camera).position;

    console.log(position);

    let diff = {
      x : this.userCamera.position.x - position.x,
      y : 0,
      z : this.userCamera.position.z - position.z
    }
    this.userCamera.position.set(diff.x,diff.y,diff.z);
    //this.renderer.xr.getCamera(this.camera).position.set(0,0,0);
  }

  onSelectEnd() {
    console.log(this.name , "was clicked end");
  }

  buildController(data) {
    switch (data.targetRayMode) {
      case "tracked-pointer":
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
        );
        geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
        );
  
        var material = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending
        });
  
        return new THREE.Line(geometry, material);
  
      case "gaze":
        var geometry = new THREE.RingBufferGeometry(0.02, 0.04, 32).translate(
          0,
          0,
          -1
        );
        var material = new THREE.MeshBasicMaterial({
          opacity: 0.5,
          transparent: true
        });
        return new THREE.Mesh(geometry, material);
    }
  }

  
  controllerConnected(event){
    this.controllerObject = this.buildController(event)
    this.scene.add(this.controllerObject);
  }
  
  controllerDisconnected(event){
    this.scene.remove(this.controllerObject);
  }

  ControllerSetup(){


    this.controller = this.renderer.xr.getController(this.side);
    this.controller.addEventListener("selectstart", this.onSelectStart);
    this.controller.addEventListener("selectend", this.onSelectEnd);
    this.controller.addEventListener("connected", this.controllerConnected);
    this.controller.addEventListener("disconnected",this.controllerDisconnected);
    this.controller.userData.id = 0;


    this.meshGeo = new THREE.BoxGeometry(.1,.1,.1);
    this.meshMat = new THREE.MeshBasicMaterial();
    this.controllerObject = new THREE.Mesh(this.meshGeo, this.meshMat);
    this.controller.add(this.controllerObject);

    this.scene.add(this.controller);
  }
  
  Update(){
     
  }

}

export default WebXRController;