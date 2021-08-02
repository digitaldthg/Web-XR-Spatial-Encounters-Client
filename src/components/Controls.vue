<template>
  <div id="controls" :class="{ hidden: !config.showDevTools }">
    <div class="controls-inner" v-if="open">
      <div>
        <div class="dev-info">Eigene SocketID: {{ $socket.id }}</div>
        <div class="dev-info">Raum: {{ $store.state.room }}</div>
      </div>
      <div>
        <label for="frequence">Sek. zwischen Dreiecken: </label>
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
        {{ this.$store.state.frequency }}
      </div>
      <div>
        <label for="scale">Skalierung der Dreiecke: </label>
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
        {{ this.scale }}
      </div>
      <div>
        <label for="speed">Geschwindigkeit der Dreiecke: </label>
        <input
          type="range"
          id="speed"
          name="frequnence"
          min="0.0001"
          max="1"
          step="0.001"
          value="0.1"
          @change="updateSpeed"
        />
        {{ this.$store.state.speed }}
      </div>
      <div>
        <label for="theme">Theme Lerp</label>
        <input
          type="range"
          id="theme"
          name="themee"
          min="0"
          max="1"
          step="0.001"
          value="0"
          @change="updateThemeLerp"
        />
        {{ this.$store.state.themeLerp }}
      </div>
      <div v-if="this.$store.state.lastTheme != null">
        Last Theme: {{ this.$store.state.lastTheme.name }}
      </div>
      <div v-if="this.$store.state.nextTheme != null">
        Next Theme: {{ this.$store.state.nextTheme.name }}
      </div>
      <div>
      <Dropdown />
      </div>
    </div>
  </div>
</template>
<script>
import TriangleMesh from "../scripts/triangle.js";
import { ColorPicker } from "vue-color-gradient-picker";
import Dropdown from "./Dropdown.vue";

import config from "../../main.config";

export default {
  name: "Controls",
  components: {
    ColorPicker,
    Dropdown,
  },
  data() {
    return {
      open: true,
      scale: 0.5,
      config: config,
    };
  },
  mounted() {
    this.InitEvents();
  },
  methods: {
    InitEvents() {
      window.addEventListener("keydown", (e) => {
        if (e.key == "p") {
          this.open = !this.open;
        }
      });
    },
    updateThemeLerp(event) {
      console.log("SLIDER VALUE ", event.target.value);
      //this.frequence = event.target.value;
      this.$socket.emit("client-theme-lerp", {
        alpha: parseFloat(event.target.value),
      });
    },
    updateSlider(event) {
      console.log("SLIDER VALUE ", event.target.value);
      //this.frequence = event.target.value;
      this.$socket.emit("client-change-frequency", {
        frequency: parseFloat(event.target.value),
      });
    },
    updateScale(event) {
      console.log("SCALE VALUE ", event.target.value);
      this.scale = event.target.value;
      this.$socket.emit("client-change-scale", {
        scale: 1 - parseFloat(event.target.value),
      });
    },
    updateSpeed(event) {
      console.log("SPEED VALUE SLIDER", event.target.value);
      this.$socket.emit("client-change-speed", {
        speed: parseFloat(event.target.value),
      });
    },
  },
};
</script>

<style  lang="css" >
#controls {
  position: relative;
  height: 200px;
  text-align: left;
  background: rgba(255, 255, 255, 0.6);
  z-index: 999;
}

.controls-inner {
  padding: 1rem;
}

.hidden {
  display: none;
}
</style>

