<template>
  <div id="controls">
    <h1>CONTROLS</h1>
    <div>
      <label for="frequence">Frequenz</label>
      <input
        type="range"
        id="frequence"
        name="frequence"
        min="0.2"
        max="3"
        step="0.1"
        value="1"
        @change="updateSlider"
      />
    </div>
    <div>
      <label for="scale">Scale</label>
      <input
        type="range"
        id="frequence"
        name="frequnence"
        min="0.1"
        max="0.9"
        step="0.05"
        value="0.5"
        @change="updateScale"
      />
    </div>
  </div>
</template>
<script>
import TriangleMesh from "../scripts/triangle.js";

export default {
  name: "Controls",
  methods: {
    updateSlider(event) {
      console.log("SLIDER VALUE ", event.target.value);
      this.$socket.emit("client-change-frequency", {
        frequency: parseFloat(event.target.value),
      });
    },
    updateScale(event) {
      console.log("SCALE VALUE ", event.target.value);
      this.$socket.emit("client-change-scale", {
        scale: 1 - parseFloat(event.target.value),
      });
    },
  },
};
</script>

<style scoped>
#controls {
  position: relative;
  z-index: 999;
}
</style>