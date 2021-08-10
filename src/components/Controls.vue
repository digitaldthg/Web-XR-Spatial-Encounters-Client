<template>
  <div id="controls" :class="{ hidden: !config.showDevTools }">
    <div class="controls-inner" v-if="open">
      <div class="grid">
        <div class="grid-1">
          <div class="dev-info">Eigene SocketID: {{ $socket.id }}</div>
          <div class="dev-info">Raum: {{ $store.state.room }}</div>
        </div>
        
        <div class="grid-1">
          
          <div class="dev-info" v-for="friend in $store.state.serverFriends" v-bind:key="friend.id">
            <div class="friend-id" :class="{isMe : friend.id == $socket.id}">{{friend.id}}</div>

            <template v-if="friend.id != $socket.id">
              <button @click="e => DeleteFriend(friend)">x</button>
              <input type="checkbox" @input="e => ToggleFriend(friend, e.target.value)" />
            </template>
          </div>


          
        </div>

        <div class="grid-2-1">
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
              @input="updateSlider"
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
              @input="updateScale"
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
              @input="updateSpeed"
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
              @input="updateThemeLerp"
            />
            {{ this.$store.state.themeLerp }}
          </div>
          <div>
            <label for="fog">FogDistance: </label>
            <input
              type="range"
              id="fog"
              name="fog"
              min="0"
              max="0.1"
              step="0.00001"
              value="0.01"
              @change="updateFog"
              @input="updateFog"
            />
            {{ this.$store.state.fogDistance }}
          </div>
        </div>

        <div class="grid-2-1">
          <div class="themes">
            <div
              class="theme"
              v-for="theme in this.$store.state.allThemes"
              v-bind:key="theme.name"
            >
              {{ theme.name }}
              <button @click="(e) => LerpTheme(theme, 2)">play</button>
            </div>
          </div>
        </div>
      </div>
      <div class="colorGradients" v-if="$store.state.lastTheme != null">
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
      </div>
    </div>

    <button class="toggle-button" @click="Toggle">open / close</button>
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
      scale: 0.5,
      config: config,
    };
  },
  watch: {
    "$store.state.xr": function (nextXR) {
      if (nextXR != null) {
        nextXR.Events.addEventListener("OnAnimationLoop", () => TWEEN.update());
      }
    },
  },
  mounted() {
    this.InitEvents();
  },
  methods: {
    Toggle() {
      this.open = !this.open;
    },
    LerpTheme(nextTheme, time) {
      this.$socket.emit("client-theme-lerp", {
        alpha: 0,
      });
      
      this.$socket.emit("client-theme", {
        last: this.$store.state.nextTheme.name,
        next: nextTheme.name,
      });

      var lerpObject = { lerp: 0 };
      const tween = new TWEEN.Tween(lerpObject)
        .to(
          {
            lerp: 1,
          },
          1000
        )
        .onUpdate((v) => {
          console.log("v lerp", v);

          this.$socket.emit("client-theme-lerp", {
            alpha: v.lerp,
          });
        })
        .start(); // Start
    },
    ChangeThemeColor(e, colorIndex) {
      console.log(
        "ChangeThemeColor",
        e.target.value,
        this.$store.state.lastTheme.gradient_skybox[colorIndex].value
      );

      this.$store.state.lastTheme.gradient_skybox[colorIndex].value =
        e.target.value;

      console.log(this.$store.state.materialController);

      this.$store.state.materialController.LerpThemes(
        this.$store.state.lastTheme,
        this.$store.state.nextTheme,
        this.$store.state.themeLerp
      );
    },
    InitEvents() {
      window.addEventListener("keydown", (e) => {
        if (e.key == "p") {
          this.open = !this.open;
        }
      });
    },
    changeTheme(nextThemeName) {
      console.log("OnChange Dropdpwn constorls", nextThemeName);
      this.$socket.emit("client-theme", {
        name: nextThemeName,
      });
    },
    updateThemeLerp(event) {
      //console.log("SLIDER VALUE ", event.target.value);
      //this.frequence = event.target.value;
      this.$socket.emit("client-theme-lerp", {
        alpha: parseFloat(event.target.value),
      });
    },
    updateSlider(event) {
      //console.log("SLIDER VALUE ", event.target.value);
      //this.frequence = event.target.value;
      this.$socket.emit("client-change-frequency", {
        frequency: parseFloat(event.target.value),
      });
    },
    updateFog(event) {
      console.log("SLIDER FOG VALUE ", event.target.value);
      //this.frequence = event.target.value;
      this.$socket.emit("client-change-fog", {
        fog: parseFloat(event.target.value),
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

    DeleteFriend(friend){
      console.log(friend);

      this.$socket.emit("client-delete-friend", {
        friend: friend ,
        room : this.$store.state.room
      });
    },
    ToggleFriend(friend , boolean){
      
      console.log(friend, boolean);

      this.$socket.emit("client-change-speed", {
        speed: parseFloat(event.target.value),
      });
    }
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

.grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-box{
  width:100%;
  margin-bottom: 1rem;
  background: #eee;
  padding:1rem;
  border-radius : 5px;
}

.toggle-button {
  position: absolute;
  top: 0;
  padding: 1rem 2rem;
  border-radius: 0 0 1rem 1rem;
  right: 320px;
  z-index: 999;
}

.toggle-button.closed{
  right: 1rem;
}

#controls {
  position: absolute;
  background: #fff9;
  z-index: 999;
  right: 0;
  width: 300px;
  min-height: 100%;
  overflow-y: scroll;
  height: 100%;
  overflow-x: visible;
}
#controls.closed{
  width:0;
}
.theme {
  padding: .5rem;
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


.friend-id{
  padding:1rem;
  margin-bottom: .5rem;
}

.friend-id.isMe {
    background:#eee;
  }

</style>

