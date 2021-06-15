<template>
  <div id="controls" >
    <div class="controls-inner" v-if="open">
      <div>
        <div class="dev-info">Eigene SocketID: {{$socket.id}}</div>
        <div class="dev-info">Raum: {{$store.state.room}}</div>
      </div>
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
  </div>
</template>
<script>
import TriangleMesh from "../scripts/triangle.js";

export default {
  name: "Controls",
  data(){
    return{
      open : false
    }
  },
  mounted(){
    this.InitEvents();
  },
  methods: {
    InitEvents(){
      window.addEventListener("keydown", (e) => { 
        if(e.key == "p"){
          this.open = !this.open;
        }
      })
    },
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
  text-align: left;
  background:rgba(255,255,255,.6);
  z-index: 999;
}

.controls-inner{ 
  padding:1rem;
}
</style>