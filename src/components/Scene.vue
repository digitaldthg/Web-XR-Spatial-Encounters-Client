<template>
  <div id="scene">
    <Player />
    <Friends />
    <Environment />

    <div id="vr-button" ref="vrButton"></div>
  </div>
</template>
<script>
import webXRScene from "../webXRScene/src";
import Environment from "./Environment.vue";
import Friends from "./Friends.vue";
import Player from "./Player.vue";
import Umgebung from '../Model/playarea.glb';
import {AmbientLight, Color, Fog, Clock, Vector3} from "three";

import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  UnrealBloomPass
} from "postprocessing";

export default {
  components: { Player, Friends, Environment },
  name: "Scene",
  data() {
    return {
      xr: null,
      reset : false,
      timer : null
    };
  },
  sockets: {
    //  "server-friends-update": function (d) {
    //     //console.log(d);
    //   },
  },
  mounted() {
    this.InitScene();
  },
  methods: {
    InitScene() {
      this.xr = new webXRScene("scene");
      var fogColor = new Color(0, 0, 0);
      this.xr.Scene.fog = new Fog(fogColor, 15, 20);

      this.xr.Renderer.instance.setClearColor(fogColor);


      var ambient = new AmbientLight(0xeeeeee, 1);
      this.xr.Scene.add(ambient);
      

      this.xr.Loader.load({
        name : "Playarea",
        url : Umgebung,
        onprogress : ()=>{
          console.log("progress")
        }
      }).then(model => this.xr.Scene.add(model.scene));


   
      /*this.composer = new EffectComposer(this.xr.Renderer.instance);
      this.composer.addPass(new RenderPass(this.xr.Scene, this.xr.Camera.instance));
      this.composer.addPass(
        new EffectPass(this.xr.Camera.instance, new BloomEffect())
      );*/

      // const geometry = new THREE.PlaneGeometry(50, 50);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0x111111,
      //   side: THREE.DoubleSide,
      // });
      // const plane = new THREE.Mesh(geometry, material);
      // plane.rotateX(Math.PI / 2);
      // this.xr.Scene.add(plane);

      this.xr.Controls.SetPosition(0, 5, 10);

      this.$store.commit("xr", this.xr);
      this.clock = new Clock();
      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.RenderLoop
      );


      var btn = this.$store.state.xr.Controls.GetVRButton();

      this.$refs.vrButton.appendChild(btn);


      this.$store.state.xr.Events.addEventListener("HandPoseChanged", this.HandleHandPoses);
      this.$store.state.xr.Events.addEventListener("OnChangeXRView", this.HandleXRView);


      if(!this.$store.state.keysInit){
        console.log("apply Listener");
        window.addEventListener("keyup", e => {if(e.code == "KeyF"){this.ResetCamera()}})

        this.$store.commit("initKeyEvents", true);
      }
    },
    RenderLoop() {
      //this.composer.render(this.clock.getDelta());
    },
    HandleXRView (xrMode){
      console.log("session" ,xrMode);
    },

    HandleHandPoses(event){
      // console.log(event.hand.handedness);
      // console.log(event.resultIs.pose.names);
      // console.log("handEvent" , event);

      if(event.resultIs.pose.names.includes( 'thumb' ) ){//&& !this.reset
        console.log("thumb up");

        this.ResetCamera();

        this.reset = true;
       
      }
    },

    ResetCamera(){

      var yPos = 1.5;//this.$store.state.xr.Controls.GetCurrentXRMode() == "Desktop" ? 1.5 : 0;  


        console.log("ResetCamera");
        this.$store.state.xr.Controls.SetPositionAndRotation( new Vector3(0,0,7), new Vector3(0,0,10));
    
      
    }
  },
};
</script>

<style>
#scene {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#vr-button{
  position: absolute;
  bottom:0;
  left:0;
  right:0;
  top:0;
  margin:auto;
  width:200px;
  height:50px;
  
}

#VRButton{
  width:100%;
  height:100%;
  color:#fff;
  border-radius: 5px;
  font-weight: 700;
  background:tomato;
  position: relative;
  display: block;
}

</style>