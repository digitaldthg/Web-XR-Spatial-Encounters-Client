<template></template>
<script>
import TriangleMesh from "../scripts/triangle.js";
import * as THREE from "three";

export default {
  name: "Environment",
  data() {
    return {
      ready: false,
      triangles: [],
      data: null,
      clock: null,
      delta: 0,
    };
  },
  watch: {
    "$store.state.xr": function (xr) {
      if (typeof xr === "undefined") {
        return;
      }
      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.updateFunction
      );
      this.ready = true;
    },
  },
  sockets: {
    "server-environment-update": function (data) {
      console.log(data);
      this.data = data;
    },
  },
  methods: {
    updateFunction() {
      this.delta += this.clock.getDelta();
      if (this.data != null) {
        if (this.delta > this.data.Triangles[0].Frequence) {
          this.spawnTriangles();
          this.delta = 0;
        }
      }
    },
    spawnTriangles() {
      if (this.data != null) {
        this.data.Triangles.forEach((triData, idx) => {
          triData.idx = idx;
          var tri = new TriangleMesh({
            xr: this.$store.state.xr,
            data: triData,
            store: this.$store,
          });
          this.triangles.push(tri);
        });
      }
    },
  },
  mounted() {
    this.clock = new THREE.Clock();
  },
};
</script>