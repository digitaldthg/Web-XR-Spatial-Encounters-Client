import {Color, Vector3, PerspectiveCamera} from "three";
class MultiCameraController{
  initialized = false;
  enabled = false;
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  views = [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      up: [ 0, 1, 0 ],
      fov: 30,
      camera : null,
      lookAt: new Vector3(0,0,0),
      pos: new Vector3(25,15,25),
      updateCamera: this.UpdateCamera
    },{
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      up: [ 0, 0, 1 ],
      fov: 45,
      camera : null,
      lookAt: new Vector3(0,0,0),
      pos: new Vector3(0,20,0),
      updateCamera: this.UpdateCamera
    },
    {
      left: 0.5,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      up: [ 0, 1, 0 ],
      fov: 60,
      camera : null,
      lookAt: new Vector3(0,0,0),
      pos: new Vector3(0,10,25),
      updateCamera: this.UpdateCamera
    }
  ]
  constructor(opts){
    var {store} = opts;

    this.scene = store.state.xr.Scene;
    this.store = store;


    this.store.state.xr.Events.addEventListener(
      "OnAfterRenderLoop",
      this.OnAfterRenderLoop
    );

    window.addEventListener("resize", this.Resize);
  }

  Resize = ()=>{
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
  }

  Init = () => { 
    //console.log(this.store.state.xr.Controls, this.store.state.xr.Controls.Desktop.orbit.enabled);
    // this.store.state.xr.Controls.Desktop.orbit.enabled = false;

    for(var i=0;i<this.views.length;i++){
      var cam = new PerspectiveCamera( this.views[i].fov, window.innerWidth / window.innerHeight, 1, 10000 );
      cam.position.copy(this.views[i].pos);

      this.views[i].camera = cam;
      this.store.state.xr.Scene.add(cam);
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    
  }
  UpdateCamera(camera, scene, lookAt){
		camera.lookAt( scene.position );
  }

  OnAfterRenderLoop = (clock) => {

    if(!this.enabled){return;}
    console.log("OnAfterRenderLoop", clock);


    for ( let ii = 0; ii < this.views.length; ++ ii ) {

      const view = this.views[ ii ];
      const camera = view.camera;

            view.updateCamera( camera, this.store.state.xr.Scene , view.lookAt);

      const left = Math.floor( this.windowWidth * view.left );
      const bottom = Math.floor(this.windowHeight * view.bottom );
      const width = Math.floor( this.windowWidth * view.width );
      const height = Math.floor( this.windowHeight * view.height );

      this.store.state.xr.Renderer.instance.setViewport( left, bottom, width, height );
      this.store.state.xr.Renderer.instance.setScissor( left, bottom, width, height );
      this.store.state.xr.Renderer.instance.setScissorTest( true );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      this.store.state.xr.Renderer.instance.render(this.store.state.xr.Scene, camera);

      
    }


  }
}

export default MultiCameraController;