<template></template>
<script>
import TriangleMesh from "../scripts/triangle.js";
import ConstantTriangle from "../scripts/constantTriangle.js";
import explodingRing from "../scripts/explodingRing";
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
      constantTris: [],
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
    "server-player-explode": function (data) {
      new explodingRing({
        xr: this.$store.state.xr,
        position: data.position,
        color: data.color,
      });
    },
    "server-environment-update": function (data) {
      this.data = data;

      this.updateData();
    },
    "server-single-triangle-update": function (data) {
      this.data = data;
      this.spawnTriangles();
      this.updateData();
    },
    "server-speed-update": function (data) {
      this.$store.commit("setSpeed", data);
    },
    "server-frequency-update": function (data) {
      this.$store.commit("setFrequency", data);
    },
    "server-teppich-update": function (data) {
      this.$store.commit("setTeppichOpacity", data);
    },
    "server-opacity-update": function (data) {
      console.log("Op from Server ",data)
      this.$store.commit("setTriangleOpacity", data);
    },
    "server-theme-lerp": function (data) {
      //console.log("From Server lerp value ",data)
      console.log("SERVER START LERP ", data);
      var next = this.$store.state.allThemes.find((t) => {
        return t.name == data.next;
      });
      var last = this.$store.state.allThemes.find((t) => {
        return t.name == data.last;
      });

      this.$store.commit("setLastTheme", last);
      this.$store.commit("setNextTheme", next);
      this.$store.commit("setLerpDuration", data.duration);
    },
  },
  methods: {
    updateData() {
      if (this.data == null) return;

      //this.spawnTriangles();

      if (this.data.Triangles.length > this.constantTris.length) {
        const tri = new ConstantTriangle({
          xr: this.$store.state.xr,
          store: this.$store,
        });
        this.constantTris.push(tri);
      } else if (this.data.Triangles.length == 0) {
        this.constantTris.map((tri) => {
          tri.Delete();
        });
        this.constantTris = [];
      } else if (this.data.Triangles.length < this.constantTris) {
        this.constantTris.shift();
      }

      this.data.Triangles.forEach((triData, idx) => {
        if (typeof this.constantTris[idx] == "undefined") {
          return;
        }

        this.constantTris[idx].UpdateTriangleData(triData);
      });
    },
    updateFunction() {
      this.delta += this.clock.getDelta();
      if (this.data == null) return;

      //Frequent Triangles
      if (
        this.delta > this.$store.state.frequency &&
        this.$store.state.frequency != 3
      ) {
        this.spawnTriangles();
        this.delta = 0;
      }

      this.data.Triangles.forEach((triData, idx) => {
        if (typeof this.constantTris[idx] == "undefined") {
          return;
        }

        this.constantTris[idx].UpdateTriangle();
      });
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