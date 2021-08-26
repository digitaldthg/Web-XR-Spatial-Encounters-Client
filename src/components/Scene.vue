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
  PointsMaterial,
  Points,
  BufferGeometry,
  BufferAttribute,
  Texture,
  FloatType,
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
import MultiCameraController from "./MultiCameraController";

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
      views: null,
      initViews: false,
    };
  },
  mounted() {
    this.InitScene();

    this.multiCamController = new MultiCameraController({
      store: this.$store,
    });

    this.multiCamController.Init();

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
    "$store.state.presentation": function (presentation) {
      this.multiCamController.enabled = presentation;
    },
    "$store.state.rotationSpeed": function (newSpeed) {
      this.xr.Controls.Desktop.orbit.autoRotateSpeed = newSpeed;
    },
    "$store.state.autoOrbit": function (autoOrbit) {
      console.log("AutoOrbit", autoOrbit);

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
    },
    "$store.state.lastTheme": function (lerpValue) {
      if (this.xr.Scene.fog == null) {
        this.InitFog();
      }
    },
  },
  methods: {
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
    InitParticles() {
      console.log("INIT PARTICLES");
      this.textureSize = 32.0;
      const pointGeometry = new BufferGeometry();
      var verts = [];
      this.particleNum = 1000;
      this.box = {
        x: 50,
        y: 100,
        z: 50,
      };
      for (let i = 0; i < this.particleNum; i++) {
        const x = -this.box.x + Math.floor(Math.random() * (this.box.x * 2));
        const y = -this.box.y + Math.floor(Math.random() * (this.box.y * 2));
        const z = -this.box.z + Math.floor(Math.random() * (this.box.z * 2));

        verts.push(x, y, z);
      }

      var vertices = new Float32Array(verts);
      pointGeometry.setAttribute("position", new BufferAttribute(vertices, 3));

      const pointMaterial = new PointsMaterial({
        size: 1,
        color: 0xffffff,
        vertexColors: false,
        map: this.GetParticleTexture(),
        // blending: THREE.AdditiveBlending,
        transparent: true,
        fog: true,
        depthWrite: true,
        depthTest: false,
      });

      const velocities = [];
      for (let i = 0; i < this.particleNum; i++) {
        const x = Math.floor(Math.random() * 6 - 3) * 0.01;
        const y = Math.floor(Math.random() * 10 + 3) * -0.05;
        const z = Math.floor(Math.random() * 6 - 3) * 0.01;
        velocities.push(x, y, z);
      }

      this.particles = new Points(pointGeometry, pointMaterial);
      //this.particles.renderOrder = 20;
      this.particles.geometry.velocities = velocities;
      this.particles.visible = false;
      this.xr.Scene.add(this.particles);
    },
    InitScene() {
      this.xr = new webXRScene("scene");

      this.InitFog();
      this.InitParticles();

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
        this.materialController.StartLerpThemes();
      });

      this.xr.Controls.SetPosition(-7, 20, 15);
      this.xr.Controls.Desktop.orbit.target.set(-7, 0, -7);

      this.$store.commit("xr", this.xr);
      this.clock = new Clock();
      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.RenderLoop
      );

      var btn = this.$store.state.xr.Controls.GetVRButton();

      btn.addEventListener("click", ()=>{
        console.log(this.$store.state.audioController);
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
      this.teppich.position.set(-7, 0.1, -8);
      this.teppich.rotation.set(Math.PI * -0.5, 0, 0);
      //this.xr.Scene.add(this.teppich);
      this.xr.CustomTextureLoader.load(TeppichTex).then((map) => {
        this.teppichMaterial.map = map;
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
      plane.position.set(
        -0.65,
        0.01,
        -6
      );
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

        console.log("set pressed true", gp.buttons[0].pressed);
      } else if (!gp.buttons[0].pressed) {
        this.pressed = false;
      }
    },
    GetParticleTexture() {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("data-name", "PARTICLE TEXTURE");
      let container = document.getElementById("canvases");
      container.appendChild(canvas);

      const ctx = canvas.getContext("2d");

      const diameter = this.textureSize;
      canvas.width = diameter;
      canvas.height = diameter;
      const canvasRadius = diameter / 2;

      /* gradation circle
    ------------------------ */
      this.drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);

      const texture = new Texture(canvas);
      //texture.minFilter = THREE.NearestFilter;
      texture.type = FloatType;
      texture.needsUpdate = true;
      return texture;
    },
    drawRadialGradation(ctx, canvasRadius, canvasW, canvasH) {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        canvasRadius,
        canvasRadius,
        0,
        canvasRadius,
        canvasRadius,
        canvasRadius
      );
      gradient.addColorStop(0, "rgba(255,255,255,1.0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.restore();
    },

    RenderLoop() {
      this.GamePadLoop();

      return;

      const pos = this.particles.geometry.attributes.position.array;
      const velArr = this.particles.geometry.velocities;

      for (var i = 0; i < pos.length; i += 3) {
        const velocity = {
          x: velArr[i],
          y: velArr[i + 1],
          z: velArr[i + 2],
        };

        // y
        pos[i + 1] += velocity.y;

        if (pos[i + 1] < -this.box.y) {
          pos[i + 1] = this.box.y;
        }
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
    },
    HandleXRView(xrMode) {
      console.log("session", xrMode);
    },

    SetEnvironmentModel() {
      this.envModel.traverse((child) => {
        if (child.name != "Scene") {
          var material = this.materialController.GetMaterial(child.name);
          child.material = material;
          //console.log("CHILD Mat ", child.material)
        }

        console.log("CHILDREN ", child.name);

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