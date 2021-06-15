<template>
  <div id="scene">
    <Player />
    <Friends />
    <Environment />
  </div>
</template>
<script>
import webXRScene from "../webXRScene/src";
import Environment from "./Environment.vue";
import Friends from "./Friends.vue";
import Player from "./Player.vue";

import * as THREE from "three";
export default {
  components: { Player, Friends, Environment },
  name: "Scene",
  data() {
    return {
      xr: null,
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
      var fogColor = new THREE.Color(0.5, 0.5, 0.5);
      this.xr.Scene.fog = new THREE.Fog(fogColor, 6, 20);
      
      this.xr.Renderer.instance.setClearColor(fogColor);

      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(Math.PI / 2);
      this.xr.Scene.add(plane);

      this.xr.Controls.SetPosition(0, 5, 10);
      
      this.$store.commit("xr", this.xr);
    },
  },
};
</script>

<style scoped>
#scene {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>