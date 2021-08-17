<template>
  <div id="controls" :class="{ hidden: !config.showDevTools }">
    <div class="controls-inner" v-if="open">
      <div class="grid">
        <div class="grid-1 info-panel">
          <div class="dev-info">Eigene SocketID: {{ $socket.id }}</div>
          <div class="dev-info">Raum: {{ $store.state.room }}</div>
        </div>
        <div class="grid-1">
          <div
            class="friend flex-between"
            :class="{ isMe: friend.id == $socket.id }"
            v-for="friend in friends"
            v-bind:key="friend.id"
          >
            <div
              class="friend-color"
              v-bind:style="{
                background: `rgb(${friend.color.r * 255},${
                  friend.color.g * 255
                },${friend.color.b * 255})`,
              }"
            ></div>
            <div class="input-checkbox">
              <input
                class="invisible"
                :checked="friend.visible"
                :id="friend.id"
                type="checkbox"
                @input="(e) => ToggleFriend(friend, e.target.checked)"
              />
              <label class="checkbox-label" :for="friend.id"
                ><span>Visible</span></label
              >
            </div>

            <div class="friend-id">{{ friend.id }}</div>

            <template v-if="friend.id != $socket.id">
              <button class="cta-button" @click="(e) => DeleteFriend(friend)">
                x
              </button>
            </template>
          </div>
        </div>

        <div class="grid-1">
          <div class="slider">
            <label for="frequence"
              >Sek. zwischen Dreiecken: {{ this.$store.state.frequency }}</label
            >
            <input
              class="slider"
              type="range"
              id="frequence"
              name="frequence"
              min="0.2"
              max="3"
              step="0.1"
              :value="this.$store.state.frequency"
              @change="updateSlider"
              @input="updateSlider"
            />
          </div>
          <div class="slider">
            <label for="scale">Skalierung der Dreiecke: {{ this.scale }}</label>
            <input
              class="slider"
              type="range"
              id="frequence"
              name="frequnence"
              min="0"
              max="2"
              step="0.05"
              :value="this.scale"
              @change="updateScale"
              @input="updateScale"
            />
          </div>
          <div class="slider">
            <label for="speed"
              >Geschwindigkeit der Dreiecke:
              {{ this.$store.state.speed }}</label
            >
            <input
              class="slider"
              type="range"
              id="speed"
              name="frequnence"
              min="0.0001"
              max="1"
              step="0.001"
              value="0.1"
              @change="updateSpeed"
              @input="updateSpeed"
            />
          </div>
          <div class="slider">
            <label for="theme"
              >Theme Lerp: {{ this.$store.state.themeLerp }}</label
            >
            <input
              class="slider"
              type="range"
              id="theme"
              name="themee"
              min="0"
              max="1"
              step="0.001"
              :value="this.$store.state.themeLerp"
              @change="updateThemeLerp"
              @input="updateThemeLerp"
            />
          </div>
          <div class="slider">
            <label for="fog"
              >FogDistance: {{ this.$store.state.fogDistance }}</label
            >
            <input
              class="slider"
              type="range"
              id="fog"
              name="fog"
              min="0"
              max="0.3"
              step="0.00001"
              :value="this.$store.state.fogDistance"
              @change="updateFog"
              @input="updateFog"
            />
          </div>
        </div>

        <div class="grid-1">
          <div class="themes">
            <div class="">
              Progress: {{($store.state.themeLerp * 100).toFixed(0)}}% <br />
              InTransition: {{$store.state.themeLerp != 1}}
            </div>
            <div class="margin-bottom">
              <label>Transitionzeit: {{$store.state.lerpDuration}}Sekunden</label>
              <input type="range" :value="$store.state.lerpDuration" min="1" max="25" step=".1" @input="e => ChangeThemeLerpDuration(e.target.value)"/>
            </div>
            <div
              class="theme flex flex-between flex-align-center"
              v-for="theme in this.$store.state.allThemes"
              v-bind:key="theme.name"
            >
              {{ theme.name }}
              <button
                class="cta-button"
                @click="(e) => StartLerpTheme(theme, $store.state.lerpDuration)"
              >
                play
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="colorGradients" v-if="$store.state.lastTheme != null">
        <input
          :value="this.$store.state.lastTheme.gradient_skybox[3].value"
          type="color"
          @input="(e) => ChangeThemeColor(e, 3)"
        />
        <input
          :value="this.$store.state.lastTheme.gradient_skybox[2].value"
          type="color"
          @input="(e) => ChangeThemeColor(e, 2)"
        />
        <input
          :value="this.$store.state.lastTheme.gradient_skybox[1].value"
          type="color"
          @input="(e) => ChangeThemeColor(e, 1)"
        />
        <input
          :value="this.$store.state.lastTheme.gradient_skybox[0].value"
          type="color"
          @input="(e) => ChangeThemeColor(e, 0)"
        />
      </div>

      <div class="">
        <button @click="(e) => SaveTheme($store.state.lastTheme)">Save</button>
      </div> -->
    </div>

    <!-- <button class="toggle-button" @click="Toggle">open / close</button> -->
  </div>
</template>
<script>
import TriangleMesh from "../scripts/triangle.js";
import { ColorPicker } from "vue-color-gradient-picker";
import Dropdown from "./Dropdown.vue";

import config from "../../main.config";

import Debug from "../Mixins/Debug";

import TWEEN from "@tweenjs/tween.js";

export default {
  name: "Controls",
  mixins: [Debug],
  components: {
    ColorPicker,
    Dropdown,
  },
  data() {
    return {
      open: true,
      scale: 1.25,
      config: config,
      friends: {},
    };
  },
  watch: {
    "$store.state.xr": function (nextXR) {
      if (nextXR != null) {
        nextXR.Events.addEventListener("OnAnimationLoop", () => TWEEN.update());
      }
    },
    "$store.state.serverFriends": function (friends) {
      this.friends = friends;
    },
  },
  mounted() {
    this.InitEvents();
  },
  methods: {
    Toggle() {
      this.open = !this.open;
    },
    ChangeThemeLerpDuration(val){
      console.log(val);
      this.$store.commit("setLerpDuration" , parseFloat(val));
    },
    StartLerpTheme(nextTheme, time) {
      console.log("THEME LERP START CLIENT");

      this.$socket.emit("client-theme-lerp", {
        duration: time,
        last: this.$store.state.nextTheme.name,
        next: nextTheme.name,
      });
    },
    InitEvents() {
      window.addEventListener("keydown", (e) => {
        if (e.key == "p") {
          this.open = !this.open;
        }
      });
    },
    updateThemeLerp(event) {
      this.$socket.emit("client-theme-lerp", {
        alpha: parseFloat(event.target.value),
      });
    },
    updateSlider(event) {
      this.$socket.emit("client-change-frequency", {
        frequency: parseFloat(event.target.value),
      });
    },
    updateFog(event) {
      this.$socket.emit("client-change-fog", {
        fog: parseFloat(event.target.value),
      });
    },
    updateScale(event) {
      this.scale = event.target.value;
      this.$socket.emit("client-change-scale", {
        scale: parseFloat(event.target.value),
      });
    },
    updateSpeed(event) {
      this.$socket.emit("client-change-speed", {
        speed: parseFloat(event.target.value),
      });
    },
    DeleteFriend(friend) {
      this.$socket.emit("client-delete-friend", {
        friend: friend,
        room: this.$store.state.room,
      });
    },
    ToggleFriend(friend, boolean) {
      console.log(friend, boolean);

      this.$socket.emit("client-hide-friend", {
        friend: friend,
        room: this.$store.state.room,
        visible: boolean,
      });
    },
  },
};
</script>

<style  lang="css" >
#controls {
  position: relative;
  text-align: left;
  background: rgba(255, 255, 255, 0.6);
  z-index: 999;
}

.controls-inner {
  padding: 1rem;
}

.controls-inner label {
  display: block;
  font-size: 80%;
}

.hidden {
  display: none;
}

.colorGradients input {
  display: block;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 32px;
  height: 32px;
  background: #000;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: 0;
}

.invisible {
  display: none;
}

.flex {
  display: flex;
}
.flex-align-center {
  align-items: center;
}
.flex-between {
  justify-content: space-between;
}

.info-panel {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-1 {
  width: 100%;
  margin-bottom: 2rem;
}

.grid input[type="range"] {
  width: 100%;
}

.grid-box {
  width: 100%;
  margin-bottom: 1rem;
  background: #eee;
  padding: 1rem;
  border-radius: 5px;
}

.toggle-button {
  position: absolute;
  top: 0;
  padding: 1rem 2rem;
  border-radius: 0 0 1rem 1rem;
  right: 320px;
  z-index: 999;
}

.toggle-button.closed {
  right: 1rem;
}

#controls {
  position: absolute;
  background: #fff9;
  z-index: 999;
  right: 0;
  width: 30%;
  min-width: 300px;
  min-height: 100%;
  overflow-y: scroll;
  height: 100%;
  overflow-x: visible;
}
#controls.closed {
  width: 0;
}
.theme {
  padding: 0.5rem;
  background: #eee;
  margin-bottom: 1rem;
  border-radius: 5px;
}

.controls-container {
  position: relative;
  height: 100%;
}

input[type="number"] {
  margin-right: 1rem;
  width: 50px;
  line-height: 1.8rem;
  border-radius: 0.5rem;
  border: 0;
  text-align: center;
}

.friend {
  padding: 1rem;
  display: flex;
  position: relative;
  margin-bottom: 0.5rem;
  background: #fff;
}

.friend-color {
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100%;
}
.friend-id {
  flex: 1;
  align-items: center;
  display: flex;
}
.friend.isMe {
  background: #ccc;
  border: 1px solid;
  justify-content: flex-start;
}

.controls-inner label {
  position: relative;
}

.checkbox-label {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.checkbox-label:before,
.checkbox-label:after {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.checkbox-label:before {
  width: 30px;
  height: 30px;
  background: #fff;
}
.checkbox-label:after {
  width: 24px;
  height: 24px;
}

.checkbox-label span {
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 80%;
}
.input-checkbox {
  margin-right: 1rem;
}

input[type="checkbox"]:checked + .checkbox-label:after {
  background: #607d8b;
}
</style>



<style scoped>
input[type="range"] {
  width: 100%;
  margin: 0px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type="range"]:focus {
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  background: #333333;
  border: 0;
  width: 100%;
  height: 32px;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-thumb {
  margin-top: 0px;
  width: 17px;
  height: 32px;
  background: #ffffff;
  border: 0.4px solid rgba(0, 30, 0, 0.57);
  cursor: pointer;
  -webkit-appearance: none;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #333333;
}
input[type="range"]::-moz-range-track {
  background: #333333;
  border: 0;
  width: 100%;
  height: 32px;
  cursor: pointer;
}
input[type="range"]::-moz-range-thumb {
  width: 17px;
  height: 32px;
  background: #ffffff;
  border: 0.4px solid rgba(0, 30, 0, 0.57);
  cursor: pointer;
}
input[type="range"]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 0px 0;
  color: transparent;
  width: 100%;
  height: 32px;
  cursor: pointer;
}
input[type="range"]::-ms-fill-lower {
  background: #333333;
  border: 0;
}
input[type="range"]::-ms-fill-upper {
  background: #333333;
  border: 0;
}
input[type="range"]::-ms-thumb {
  width: 17px;
  height: 32px;
  background: #ffffff;
  border: 0.4px solid rgba(0, 30, 0, 0.57);
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type="range"]:focus::-ms-fill-lower {
  background: #333333;
}
input[type="range"]:focus::-ms-fill-upper {
  background: #333333;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align: auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type="range"] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}
</style>