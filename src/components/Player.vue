<template></template>
<script>

import {Mesh, BoxGeometry,MeshNormalMaterial, MeshBasicMaterial, Color, Vector3, Quaternion} from 'three';
import UserData from '../class/UserData';
import Timer from '../Timer';
import { Handy } from '../webXRScene/src/HandTracking/Handy';


export default {
  name : "Player",
  data(){
    return {
      delta : 0,
      fps : .25,
      player : null,
      ready : false,
      timer : null,
      timeout: 0,
      thumb : false,
      keyArray : ["w","a","s","d"],
      speed : .1,
      data : Object.assign({}, UserData),
      transform: {
        position : new Vector3(),
        rotation : new Quaternion(),
        scale : new Vector3()
      },
      inVR : false,
      key: {
        w : 0,
        a : 0,
        d : 0,
        s : 0
      }
    }
  },
  watch: {
   "$store.state.xr" : function(state){

     console.log("state player" , state);
      this.ready = true;


      this.InitPlayer();

      this.$store.state.xr.Events.addEventListener("HandPoseChanged", this.HandleHandPoses);

      this.InitTimer();

      this.ToggleHands(false, "left");
      this.ToggleHands(false, "right");

    }
  },

  mounted(){
    
  },
  methods:{
    InitPlayer(){

      this.$store.state.xr.Events.addEventListener("OnChangeXRView", this.ConvertPlayerToVR);

      this.player = new Mesh(new BoxGeometry(0.5,0.5,0.5), new MeshBasicMaterial({
        color : new Color(this.data.color.r,this.data.color.g,this.data.color.b,this.data.color.a)
      }));

      this.$store.state.xr.Scene.add(this.player);

      this.data.room = this.$route.params.roomID;

      console.log(this.$route.params.roomID);

      this.InitEvents();

    },
    InitTimer(){
      this.timer = new Timer({
        store : this.$store,
        xr : this.$store.state.xr
      });

      this.player.add(this.timer.instance);

    },
     HandleHandPoses(event){
      console.log(event.hand.handedness);
      console.log(event.resultIs.pose.names);
      console.log("handEvent" , event);

      if(event.resultIs.pose.names.includes( 'thumb' ) ){//event.resultIs.pose.names.includes( 'flare' ) ||
        console.log("thumb up", this.timeout);
        this.ToggleHands(true, event.hand.handedness);
        this.thumb = true;
      }

      if(event.resultWas.pose.names.includes( 'thumb' )){//event.resultWas.pose.names.includes( 'flare' ) || 
        this.timeout = 0;
        this.thumb = false;
        this.ToggleHands(false, event.hand.handedness);
      }
    },

    ToggleHands(boolean, side){
      
      if(side == "left"){
        var leftHand = Handy.hands.getLeft();

        if(typeof(leftHand) === "undefined"){ return; }

        leftHand.traverse((child)=>{
          if(child.hasOwnProperty("visible")){
            child.visible = boolean;
          }
        });
      }

      if(side == "right"){
        var rightHand = Handy.hands.getRight();

        if(typeof(rightHand) === "undefined"){ return; }

        rightHand.traverse((child)=>{
          if(child.hasOwnProperty("visible")){
            child.visible = boolean;
          }
        });
      }

    },
    ResetCamera(){

      var yPos = 1.5;//this.$store.state.xr.Controls.GetCurrentXRMode() == "Desktop" ? 1.5 : 0;  


        console.log("ResetCamera");
        this.$store.state.xr.Controls.SetPositionAndRotation( new Vector3(0,0,7), new Vector3(0,0,10));
    
      
    },
    ConvertPlayerToVR(){
      this.inVR = true;
    },
    InitEvents(){

      window.addEventListener("keydown", this.keyDown);
      window.addEventListener("keyup", this.keyUp);

      this.$store.state.xr.Events.addEventListener("OnAnimationLoop", this.Animate);

    },

    keyDown(e){
      const keyName = e.key;
     
      if(!this.keyArray.includes(keyName)){ return; }
      
      var keyCopy = Object.assign({}, this.key);

      console.log(keyName);

      switch(keyName){
        case "w":
          keyCopy.w = 1; 
          break;
        case "a":
          keyCopy.a = 1; 
          break;
        case "s":
          keyCopy.s = 1; 
          break;
        case "d":
          keyCopy.d = 1; 
          break;
      }


      this.key = keyCopy;
      
    },
    keyUp(e){ 
      const keyName = e.key;
      if(!this.keyArray.includes(keyName)){ return; }

      var keyCopy = Object.assign({}, this.key);

      switch(keyName){
        case "w":
          keyCopy.w = 0; 
          break;
        case "a":
          keyCopy.a = 0; 
          break;
        case "s":
          keyCopy.s = 0; 
          break;
        case "d":
          keyCopy.d = 0; 
          break;
      }

      this.key = keyCopy;

    },
    KeyBoardMovement(){
      var dir = {
        x : 0,
        z : 0
      }

      if(this.key.a > 0){
        dir.x = -1;
      }
      if(this.key.d > 0){
        dir.x = 1;
      }
      
      if(this.key.w > 0){
        dir.z = -1;
      }
      if(this.key.s > 0){
        dir.z = 1;
      }

      this.player.position.x += dir.x * this.speed;
      this.player.position.z += dir.z * this.speed;

    },
    Animate(t){

      if(!this.ready){ return; }

      if(this.thumb){
        this.timer.SetVisible(true);
        if(this.timeout < 100){
          this.timeout++;
        }else{
          this.timeout = 0;
          this.ResetCamera();
          this.thumb = false;
          this.timer.SetVisible(false);
        }

        this.timer.Progress(this.timeout);

        this.reset = true;
      }else{
        this.timer.SetVisible(false);
      }


      if(!this.inVR){
        this.KeyBoardMovement();
      }else{
        var vrCamera = this.$store.state.xr.Renderer.instance.xr.getCamera(this.$store.state.xr.Camera.instance);

        vrCamera.matrixWorld.decompose(this.transform.position,this.transform.rotation,this.transform.scale);
        this.player.position.set(this.transform.position.x,this.transform.position.y,this.transform.position.z);
        this.player.quaternion = this.transform.rotation.clone();

      }

      this.delta += t.getDelta();

      if (this.delta  > this.fps) {
          // The draw or time dependent code are here
        this.ReducedFPSCall();
        this.delta = this.delta % this.fps;
      }
      

      this.ApplyData();
    },
    ApplyData(){
      var dataCopy = Object.assign({}, this.data);
      dataCopy.transform.position.x = this.player.position.x;
      dataCopy.transform.position.y = this.player.position.y;
      dataCopy.transform.position.z = this.player.position.z;

      this.data = dataCopy;
    },
    ReducedFPSCall(){
      this.$socket.emit("client-player", this.data);
    }
  }
}
</script>