<template>
  
</template>
<script>

import {Mesh, BoxGeometry,MeshNormalMaterial, MeshBasicMaterial, Color} from 'three';
import UserData from '../class/UserData';


export default {
  name : "Player",
  data(){
    return {
      delta : 0,
      fps : .5,
      player : null,
      ready : false,
      keyArray : ["w","a","s","d"],
      speed : .1,
      data : Object.assign({}, UserData),
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
    }
  },

  mounted(){
    console.log("player" );

    console.log(this.$store.state.xr);
  },
  methods:{
    InitPlayer(){

      this.player = new Mesh(new BoxGeometry(0.5,0.5,0.5), new MeshBasicMaterial({
        color : new Color(this.data.color.r,this.data.color.g,this.data.color.b,this.data.color.a)
      }));

      this.$store.state.xr.Scene.add(this.player);

      this.InitEvents();

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
      this.KeyBoardMovement();


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