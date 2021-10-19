<template>
  <div id="scene">
    <Player />
    <Friends />
    <Environment />
    <div id="vr-button" ref="vrButton" v-show="$store.state.uiVisible"></div>
  </div>
</template>
<script>
import webXRScene from "../webXRScene/src";
import Environment from "./Environment.vue";
import Friends from "./Friends.vue";
import Player from "./Player.vue";
import Utils from "../scripts/utils";
import CalibrationTex from "../Model/environment/textures/calibrationcorner.png";
import TeppichTex from "../Model/environment/textures/floor/grain_tape.png";
import RotatingObj from "./RotatingObj";
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
import MaterialController from "./MaterialController";
import MultiCameraController from "./MultiCameraController";

import Scheune from "../Model/environment/scheune.glb";

export default {
  components: { Player, Friends, Environment },
  name: "Scene",
  data() {
    return {
      xr: null,
      reset: false,
      envModel: null,
      scheunenModel: null,
      materialController: null,
      pressed: false,
      views: null,
      initViews: false,
      scheunenMaterial: new MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 1,
      }),
    };
  },
  mounted() {
    this.InitScene();

    this.multiCamController = new MultiCameraController({
      store: this.$store,
    });

    this.multiCamController.Init();
  },
  destroyed() {
    this.$store.state.xr.Events.removeEventListener(
      "OnAnimationLoop",
      this.RenderLoop
    );
  },
  sockets: {
    "server-fog-update": function (value) {
      this.$store.commit("setFogDistance", value);
    },
  },
  watch: {
    "$store.state.presentation": function (presentation) {
      this.multiCamController.enabled = presentation;
    },
    "$store.state.rotationSpeed": function (newSpeed) {
      this.xr.Controls.Desktop.orbit.autoRotateSpeed = newSpeed;
    },
    "$store.state.autoOrbit": function (autoOrbit) {

      if (autoOrbit) {
        this.xr.Controls.Desktop.orbit.autoRotateSpeed =
          this.$store.state.rotationSpeed;
        this.xr.Controls.Desktop.orbit.autoRotate = true;
      } else {
        this.xr.Controls.Desktop.orbit.autoRotate = false;
      }
    },
    "$store.state.fogDistance": function (fogDistance) {
      this.xr.Scene.fog.density = fogDistance;
    },
    "$store.state.themeLerp": function (lerpValue) {
      this.ChangeFogColor();
    },
    "$store.state.teppichOpacity": function (lerpValue) {
      this.ChangeTeppich();
      this.ChangeScheune();
    },
    "$store.state.lastTheme": function (lerpValue) {
      if (this.xr.Scene.fog == null) {
        this.InitFog();
      }
    },
  },
  methods: {
    ChangeScheune() {
      this.scheunenMaterial.opacity = this.$store.state.teppichOpacity;
    },
    ChangeTeppich() {
      this.teppich.material.opacity = this.$store.state.teppichOpacity;
    },
    ChangeFogColor() {
      if (
        typeof this.$store.state.lastTheme == "undefined" ||
        typeof this.$store.state.nextTheme == "undefined"
      ) {
        return;
      }

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
      var fogColor = new Color(1, 1, 1);
      var fogDensity = this.$store.state.fogDistance;
      this.xr.Scene.fog = new FogExp2(fogColor, fogDensity);
  
    },
    InitScene() {
      this.xr = new webXRScene("scene");

      this.InitFog();

      this.materialController = new MaterialController(this.xr, this.$store);

      this.xr.Camera.instance.near = 0.01;
      this.xr.Camera.instance.far = 1000;
      this.xr.Camera.instance.updateProjectionMatrix();

      this.xr.Loader.load({
        name: "EnvironmentModel",
        onprogress: () => {},
        url: envModel,
      }).then((model) => {
        this.envModel = model.scene;
        this.xr.Scene.add(this.envModel);
        this.SetEnvironmentModel();
        this.materialController.StartLerpThemes();
      });

      this.xr.Controls.SetPosition(-7, 20, 15);
      this.xr.Controls.Desktop.orbit.target.set(-7, 0, -7);

      /**
       *  Scheuene
       */

      this.xr.Loader.load({
        name: "Scheune",
        onprogress: () => {},
        url: Scheune,
      }).then((model) => {
        this.scheunenModel = model.scene;
        this.scheunenModel.position.set(-7, 0, -8);
        this.scheunenModel.traverse((child) => {
          if (child.hasOwnProperty("material")) {
            child.material = this.scheunenMaterial;
            this.scheunenMaterial.opacity = this.$store.state.teppichOpacity;
          }
        });

        this.scheunenModel.renderOrder = 9;
        this.xr.Scene.add(this.scheunenModel);
      });

      this.$store.commit("xr", this.xr);
      this.clock = new Clock();
      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.RenderLoop
      );

      var btn = this.$store.state.xr.Controls.GetVRButton();

      btn.addEventListener("click", () => {
        this.$store.state.audioController.EnableSounds();
      });

      this.$refs.vrButton.appendChild(btn);

      this.$store.state.xr.Events.addEventListener(
        "OnChangeXRView",
        this.HandleXRView
      );

      //SCHEUNEN BODEN
      const teppichGeometry = new PlaneGeometry(10.1, 16.1);
      this.teppichMaterial = new MeshBasicMaterial({
        color: 0x607d8b,
        side: FrontSide,
        transparent: true,
      });
      this.teppich = new Mesh(teppichGeometry, this.teppichMaterial);
      this.teppich.renderOrder = 9;
      this.teppich.position.set(-7, 0.02, -8);
      this.teppich.rotation.set(Math.PI * -0.5, 0, 0);
      this.xr.CustomTextureLoader.load(TeppichTex).then((map) => {
        this.teppichMaterial.map = map;
        this.teppichMaterial.opacity = this.$store.state.teppichOpacity;
        this.xr.Scene.add(this.teppich);
      });

      //CALIBRATION PLANE
      const planeGeometry = new PlaneGeometry(0.5, 0.5);
      this.planeMaterial = new MeshBasicMaterial({
        color: 0xffffff,
        side: FrontSide,
        transparent: true,
        depthTest: false,
      });
      const plane = new Mesh(planeGeometry, this.planeMaterial);
      plane.renderOrder = 16;
      plane.position.set(-0.65, 0.01, -6);
      plane.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.25);

      this.xr.CustomTextureLoader.load(CalibrationTex).then((map) => {
        this.planeMaterial.alphaMap = map;
        this.xr.Scene.add(plane);
      });
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
        this.$socket.emit("client-gamepad-event", null);
      } else if (!gp.buttons[0].pressed) {
        this.pressed = false;
      }
    },
    

    RenderLoop() {
      this.GamePadLoop();
      return;

    },
    HandleXRView(xrMode) {
    },

    SetEnvironmentModel() {
      this.envModel.traverse((child) => {
        if (child.name != "Scene") {
          var material = this.materialController.GetMaterial(child.name);
          child.material = material;
        }

        switch (child.name) {
          case "base_floor":
            child.renderOrder = 0;
            child.visible = false;
            break;
          case "bg_back":
            child.renderOrder = 9;
            break;
          case "bg_front":
            child.renderOrder = 10;
            break;
          case "bg_moving":
            new RotatingObj(this.xr, child);
            child.renderOrder = 12;
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
            child.renderOrder = 13;
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
  bottom: 3rem;
  left: 3rem;
  right: initial;
  top: initial;
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
  background: #607d8b;
  position: relative;
  display: block;
}
</style>