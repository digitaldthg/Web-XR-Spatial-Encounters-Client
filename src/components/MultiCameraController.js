import {Color, Vector3, PerspectiveCamera, Group} from "three";
class MultiCameraController{
  initialized = false;
  enabled = false;
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  views = [
    
    {
      left: 0.5,
      bottom: 0.33,
      width: 0.5,
      height: 0.336,
      up: [ 0, 1, 0 ],
      fov: 30,
      camera : null,
      lookAt: new Vector3(-7,0,-7),
      pos: new Vector3(5.5,1.8,5.5),
      animate : true,
      animationDirection : 1,
      animationSpeed : .003,
      updateCamera: (v)=>this.FollowPlayer(v)
    },{
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.336,
      up: [ 0, 0, 1 ],
      fov: 45,
      camera : null,
      lookAt: new Vector3(-7,0,-7),
      pos: new Vector3(0,15,0),
      animate : true,
      animationDirection : 1,
      animationSpeed : .001,
      updateCamera: this.UpdateCamera
    },
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      up: [ 0, 1, 0 ],
      fov: 60,
      camera : null,
      lookAt: new Vector3(-7,0,-7),
      pos: new Vector3(0,10,25),
      animate : false,
      animationDirection : 1,
      animationSpeed : .001,
      updateCamera: this.UpdateCamera
    },
    {
      left: 0.5,
      bottom: 0.66,
      width: 0.5,
      height: 0.336,
      up: [ 0, 1, 0 ],
      fov: 30,
      camera : null,
      lookAt: new Vector3(-7,0,-7),
      pos: new Vector3(25,15,25),
      animate : true,
      animationDirection : 1,
      animationSpeed : .001,
      updateCamera: this.UpdateCamera
    },
  ]
  constructor(opts){
    var {store} = opts;

    this.scene = store.state.xr.Scene;
    this.store = store;

    this.FollowPlayer = this.FollowPlayer.bind(this);

    this.store.state.xr.Events.addEventListener(
      "OnAfterRenderLoop",
      this.OnAfterRenderLoop
    );

    window.addEventListener("resize", this.Resize);

    this.store.watch(state => state.presentation, (value)=>{
      if(!value){
        this.store.state.xr.Renderer.Resize();
        this.store.state.xr.Renderer.instance.setScissorTest( false );
      }
    })
  }

  Resize = ()=>{
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  Init = () => { 
    for(var i=0;i<this.views.length;i++){
      var camGroup = new Group();
      var cam = new PerspectiveCamera( this.views[i].fov, window.innerWidth / window.innerHeight, 1, 10000 );
      cam.position.copy(this.views[i].pos);

      this.views[i].camera = cam;
          camGroup.add(cam);
      this.store.state.xr.Scene.add(camGroup);
      
      camGroup.position.set(-7,0,-7);
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    
  }
  UpdateCamera(view){
		view.camera.lookAt( view.lookAt );

    if(view.animate){
      view.camera.parent.rotation.y += (view.animationSpeed * view.animationDirection);
    }
  }
  FollowPlayer = (view)=>{
    view.camera.parent.position.set(this.store.state.playerPosition.x,0,this.store.state.playerPosition.z);
    view.camera.parent.rotation.y += (view.animationSpeed * view.animationDirection);
    view.camera.lookAt(this.store.state.playerPosition.x,this.store.state.playerPosition.y / 1.25,this.store.state.playerPosition.z);
  }


  OnAfterRenderLoop = (clock) => {

    if(!this.enabled){return;}
    for ( let ii = 0; ii < this.views.length; ++ ii ) {

      const view = this.views[ ii ];
      const camera = view.camera;

            view.updateCamera( view);

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