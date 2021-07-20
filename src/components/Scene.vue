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
import Umgebung from "../Model/playarea.glb";
import floorGrid from "../assets/grid-01.png";
import {
  AmbientLight,
  Color,
  Fog,
  Clock,
  Vector3,
  TextureLoader,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  MeshBasicMaterial,
  MeshPhongMaterial,
  BoxGeometry,
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
    };
  },
  sockets: {
    //  "server-friends-update": function (d) {
    //     //console.log(d);
    //   },
  },
  mounted() {
    this.InitScene();
  },
  methods: {
    InitScene() {
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

      //LIGHTS
      // var ambient = new AmbientLight(0xeeeeee, 1);
      // this.xr.Scene.add(ambient);

      //FOG
      // var fogColor = new Color(0, 0, 0);
      // this.xr.Scene.fog = new Fog(fogColor, 2, 20);
      // this.xr.Scene.background = fogColor;
      // this.xr.Renderer.instance.setClearColor(fogColor, 1);

      //FLOOR
      //const loader = new TextureLoader();
      // this.floorTexuture = loader.load(floorGrid, (texture) => {
      // console.log("TEXTURE LOADED");
      //in this example we create the material when the texture is loaded
      // const geometry = new PlaneGeometry(10, 10);
      // const material = new MeshPhongMaterial({
      // color: 0xffffff,
      // side: DoubleSide,
      // map: texture,
      // transparent: true,
      // });
      // const plane = new Mesh(geometry, material);
      // plane.rotation.set(Math.PI / 2, 0, 0);
      // this.xr.Scene.add(plane);
      // });

      //DEBUG BOX
      // const geometry = new BoxGeometry(0.5,2,0.5);
      // const material = new MeshBasicMaterial({
      //   color: 0xffffff
      // });
      // const box = new Mesh(geometry, material);
      // box.position.set(0,1,5.25);
      // this.xr.Scene.add(box);

      /*this.xr.Loader.load({
        name : "Playarea",
        url : Umgebung,
        onprogress : ()=>{
          console.log("progress")
        }
      }).then(model => this.xr.Scene.add(model.scene));

      /*this.composer = new EffectComposer(this.xr.Renderer.instance);
      this.composer.addPass(new RenderPass(this.xr.Scene, this.xr.Camera.instance));
      this.composer.addPass(
        new EffectPass(this.xr.Camera.instance, new BloomEffect())
      );*/

      // const geometry = new THREE.PlaneGeometry(50, 50);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0x111111,
      //   side: THREE.DoubleSide,
      // });
      // const plane = new THREE.Mesh(geometry, material);
      // plane.rotateX(Math.PI / 2);
      // this.xr.Scene.add(plane);

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
    },
    RenderLoop() {},
    HandleXRView(xrMode) {
      console.log("session", xrMode);
    },

    SetEnvironmentModel() {
      this.envModel.traverse((child) => {
        var material = this.materialController.GetMaterial(child.name);
        console.log("Set Materials ", child.name, material);
        child.material = material;

        switch (child.name) {
          case "base_floor":
            child.renderOrder = 7;
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