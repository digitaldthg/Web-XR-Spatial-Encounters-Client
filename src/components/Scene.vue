<template>
  <div id="scene">
    <Player />
    <Friends />
    <Environment />
  </div>
</template>
<script>
import webXRScene from '../webXRScene/src';
import Environment from './Environment.vue';
import Friends from './Friends.vue';
import Player from './Player.vue';

export default {
  components: { Player, Friends, Environment },
  name : "Scene",
  data(){
    return {
      xr : null,
    } 
  },
  sockets: {
  //  "server-friends-update": function (d) {
  //     //console.log(d);
  //   },
  },
  mounted(){
    this.InitScene();
  },
  methods:{
    InitScene(){
      this.xr = new webXRScene("scene");

      this.xr.Controls.SetPosition(0,5,10);
      this.$store.commit("xr", this.xr);
    }
  }
}
</script>

<style scoped>
#scene{
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
}
</style>