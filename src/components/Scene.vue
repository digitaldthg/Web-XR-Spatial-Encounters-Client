<template>
  <div id="scene">
    <Player />
    <Friends />
    <Environment />

    <div id="vr-button" ref="vrButton"></div>
  </div>
</template>
<script>
import webXRScene from "../webXRScene/src";
import Environment from "./Environment.vue";
import Friends from "./Friends.vue";
import Player from "./Player.vue";
import Utils from "../scripts/utils";
import CalibrationTex from "../Model/environment/textures/calibrationcorner.png";
import {
  Color,
  FogExp2,
  Clock,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  FrontSide,
} from "three";
import envModel from "../Model/environment/environment.glb";

import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  UnrealBloomPass,
} from "postprocessing";
import MaterialController from "./MaterialController";

export default {
  components: { Player, Friends, Environment },
  name: "Scene",
  data() {
    return {
      xr: null,
      reset: false,
      envModel: null,
      materialController: null,
      pressed: false,
    };
  },
  mounted() {
    this.InitScene();

    console.log("mount Scene");
  },
  destroyed() {
    this.$store.state.xr.Events.removeEventListener(
        "OnAnimationLoop",
        this.RenderLoop
      );
    console.log("destroy Scene");
  },
  sockets: {
    "server-fog-update": function (value) {
      this.$store.commit("setFogDistance", value);
    },
  },
  watch: {
    "$store.state.fogDistance": function (fogDistance) {
      this.xr.Scene.fog.density = fogDistance;
    },
    "$store.state.themeLerp": function (lerpValue) {
      this.ChangeFogColor();
    },
    "$store.state.lastTheme": function (lerpValue) {
      if (this.xr.Scene.fog == null) {
        this.InitFog();
      }
    },
  },
  methods: {
    ChangeFogColor() {
      var colorLastHex = this.$store.state.lastTheme["fog_color"];
      var colorNextHex = this.$store.state.nextTheme["fog_color"];

      var lerpColor = Utils.lerpColor(
        [{ value: colorLastHex }],
        [{ value: colorNextHex }],
        this.$store.state.themeLerp
      );

      let color = new Color();
      color.setHSL(
        lerpColor[0].value[0] / 360,
        lerpColor[0].value[1] / 100,
        lerpColor[0].value[2] / 100
      );

      this.xr.Scene.fog.color = color;
    },
    InitFog() {
      if (
        this.$store.state.lastTheme == null ||
        this.$store.state.nextTheme == null
      ) {
        return;
      }

      //Init FOG
      var fogColor = new Color(0, 0, 1);
      var fogDesity = this.$store.state.fogDistance;
      this.xr.Scene.fog = new FogExp2(fogColor, fogDesity);
      this.ChangeFogColor();
    },
    InitScene() {
      console.log("--------INIT SCENE-----------");
      this.xr = new webXRScene("scene");

      this.materialController = new MaterialController(this.xr, this.$store);

      this.xr.Camera.instance.near = 0.01;
      this.xr.Camera.instance.far = 1000;
      this.xr.Camera.instance.updateProjectionMatrix();

      this.xr.Loader.load({
        name: "EnvironmentModel",
        onprogress: () => {},
        url: envModel,
      }).then((model) => {
        console.log("loaded", model);
        this.envModel = model.scene;
        this.xr.Scene.add(this.envModel);
        this.SetEnvironmentModel();
      });

      this.xr.Controls.SetPosition(0, 5, 10);

      this.$store.commit("xr", this.xr);
      this.clock = new Clock();
      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.RenderLoop
      );

      var btn = this.$store.state.xr.Controls.GetVRButton();

      this.$refs.vrButton.appendChild(btn);

      this.$store.state.xr.Events.addEventListener(
        "OnChangeXRView",
        this.HandleXRView
      );

      //CALIBRATION PLANE
      const planeGeometry = new PlaneGeometry(1, 1);
      this.planeMaterial = new MeshBasicMaterial({
        color: 0xFF10F0,
        side: FrontSide,
        transparent: true,
      });
      const plane = new Mesh(planeGeometry, this.planeMaterial);
      plane.renderOrder = 16;
      plane.position.set(
        this.$store.state.startPosition.x,
        this.$store.state.startPosition.y,
        this.$store.state.startPosition.z
      );
      plane.rotation.set(Math.PI * -0.5, 0,Math.PI * 0.25);

      this.xr.CustomTextureLoader.load(CalibrationTex).then((map) => {
        this.planeMaterial.alphaMap = map;
        this.xr.Scene.add(plane);
      });

      this.InitFog();
    },
    GamePadLoop() {
      var gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : navigator.webkitGetGamepads
        ? navigator.webkitGetGamepads
        : [];
      if (!gamepads) {
        return;
      }

      var gp = gamepads[0];

      if (gp == null) {
        return;
      }

      if (gp.buttons[0].pressed && !this.pressed) {
        this.pressed = true;
        this.$socket.emit("client-gamepad-event",null);

        console.log("set pressed true", gp.buttons[0].pressed);
      } else if (!gp.buttons[0].pressed) {
        this.pressed = false;
      }
    },
    RenderLoop() {
      this.GamePadLoop();
    },
    HandleXRView(xrMode) {
      console.log("session", xrMode);
    },

    SetEnvironmentModel() {
      this.envModel.traverse((child) => {
        if (child.name != "Scene") {
          var material = this.materialController.GetMaterial(child.name);
          child.material = material;
          // console.log("CHILD Mat ", child.material)
        }

        // console.log("CHILDREN ", child.name);

        switch (child.name) {
          case "base_floor":
            child.renderOrder = 0;
            break;
          case "bg_back":
            child.renderOrder = 9;
            break;
          case "bg_front":
            child.renderOrder = 10;
            break;
          case "fog_floor":
            child.renderOrder = 11;
            break;
          case "skybox_gradient":
            child.renderOrder = 3;
            break;
          case "skybox_texture":
            child.renderOrder = 4;
          case "grid_floor":
            child.renderOrder = 7;
            break;
          case "guardian":
            child.renderOrder = 12;
            break;
          case "sun":
            child.renderOrder = 8;
            break;
        }
      });
    },
  },
};
</script>

<style>
#scene {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

#vr-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  width: 200px;
  height: 50px;
}

#VRButton {
  width: 100%;
  height: 100%;
  color: #fff;
  border-radius: 5px;
  font-weight: 700;
  background: tomato;
  position: relative;
  display: block;
}
</style>