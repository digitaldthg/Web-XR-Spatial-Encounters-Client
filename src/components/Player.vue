<template></template>
<script>
import {
  Mesh,
  CylinderGeometry,
  DoubleSide,
  BoxGeometry,
  Group,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Color,
  Vector3,
  Quaternion,
  Raycaster,
  CircleGeometry,
} from "three";
import UserData from "../class/UserData";
import Timer from "../Timer";
import explodingRing from "../scripts/explodingRing";
import Utils from "../scripts/utils";

export default {
  name: "Player",
  data() {
    return {
      delta: 0,
      fps: 0.25,
      player: null,
      ready: false,
      timer: null,
      timeout: 0,
      thumb: false,
      rings: [],
      explosition: false,
      ringOffset: 0.15,
      bottomColor: new Color(0xffffff),
      keyArray: ["w", "a", "s", "d", "e"],
      speed: 0.1,
      data: Object.assign({}, UserData),
      raycaster: null,
      transform: {
        position: new Vector3(),
        rotation: new Quaternion(),
        scale: new Vector3(),
      },
      inVR: false,
      currentColor: new Color(0xffffff),
      key: {
        w: 0,
        a: 0,
        d: 0,
        s: 0,
      },
    };
  },
  watch: {
    "$store.state.xr": function (state) {
      console.log("state player", state);
      this.ready = true;

      this.InitPlayer();

      this.InitTimer();
    },
  },

  mounted() {},
  methods: {
    InitPlayer() {
      this.$store.state.xr.Events.addEventListener(
        "OnChangeXRView",
        this.ConvertPlayerToVR
      );

      this.playerGroup = new Group();
      var color = new Color(
        this.data.color.r,
        this.data.color.g,
        this.data.color.b,
        this.data.color.a
      );
      this.currentColor = color;
      var target = new Vector3(
        this.data.transform.position.x,
        this.data.transform.position.y,
        this.data.transform.position.z
      );
      var origin = new Vector3(0, 0, 0);

      for (var i = 0; i <= 5; i++) {
        let scale = 0.03 * i * i;
        const geometry = new CylinderGeometry(scale, scale, 0.06, 64, 2, true);
        const material = new MeshBasicMaterial({
          side: DoubleSide,
          color: color,
        });
        const ring = new Mesh(geometry, material);

        this.playerGroup.add(ring);
        this.rings.push(ring);
      }

      this.player = new Group();

      this.$store.state.xr.Scene.add(this.player);
      this.$store.state.xr.Scene.add(this.playerGroup);

      this.data.room = this.$route.params.roomID;

      console.log(this.$route.params.roomID);

      this.raycaster = new Raycaster();
      this.CreatePlayerFloor();
      this.InitEvents();
    },
    CreatePlayerFloor() {
      const geometry = new CircleGeometry(0.5, 32);
      const material = new MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0,
      });
      const circle = new Mesh(geometry, material);
      circle.rotation.x = (-90 * Math.PI) / 180;
      circle.position.y += 0.01;
      this.playerFloor = circle;
      this.$store.state.xr.Scene.add(circle);
    },
    InitTimer() {
      this.timer = new Timer({
        store: this.$store,
        xr: this.$store.state.xr,
      });

      this.player.add(this.timer.instance);
    },

    ResetCamera() {
      this.$store.state.xr.Controls.SetPositionAndRotation(
        new Vector3(0, 0, 7),
        new Vector3(0, 0, 10)
      );

      this.data.transform.headHeight = this.data.transform.position.y;
    },
    ConvertPlayerToVR() {
      this.inVR = true;
    },
    InitEvents() {
      this.keyDown = this.keyDown.bind(this);
      this.keyUp = this.keyUp.bind(this);

      this.Animate = this.Animate.bind(this);
      window.addEventListener("keydown", this.keyDown);
      window.addEventListener("keyup", this.keyUp);

      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.Animate
      );
    },

    keyDown(e) {
      const keyName = e.key;

      if (!this.keyArray.includes(keyName)) {
        return;
      }

      var keyCopy = Object.assign({}, this.key);

      console.log("Key down ", keyName);

      switch (keyName) {
        case "w":
          keyCopy.w = 1;
          break;
        case "a":
          keyCopy.a = 1;
          break;
        case "s":
          keyCopy.s = 1;
          break;
        case "d":
          keyCopy.d = 1;
          break;
        case "e":
          this.Explode();
          break;
      }

      this.key = keyCopy;
    },
    keyUp(e) {
      const keyName = e.key;

      //console.log(keyName);

      if (keyName == "f") {
        this.ResetCamera();
      }

      if (!this.keyArray.includes(keyName)) {
        return;
      }

      var keyCopy = Object.assign({}, this.key);

      switch (keyName) {
        case "w":
          keyCopy.w = 0;
          break;
        case "a":
          keyCopy.a = 0;
          break;
        case "s":
          keyCopy.s = 0;
          break;
        case "d":
          keyCopy.d = 0;
          break;
      }

      this.key = keyCopy;
    },
    KeyBoardMovement() {
      var dir = {
        x: 0,
        z: 0,
      };

      if (this.key.a > 0) {
        dir.x = -1;
      }
      if (this.key.d > 0) {
        dir.x = 1;
      }

      if (this.key.w > 0) {
        dir.z = -1;
      }
      if (this.key.s > 0) {
        dir.z = 1;
      }

      this.player.position.x += dir.x * this.speed;
      this.player.position.z += dir.z * this.speed;

      this.playerGroup.position.x += dir.x * this.speed;
      this.playerGroup.position.z += dir.z * this.speed;
    },
    Explode() {
      console.log("explode", this.currentColor);
      new explodingRing({
        xr: this.$store.state.xr,
        position: this.player.position,
        currentColor: this.currentColor,
      });
      this.$socket.emit("client-player-explode");
    },
    Animate(t) {
      if (!this.ready) {
        return;
      }

      //UPDATE COLOR
      var target = this.transform.position.clone();
      var origin = new Vector3(0, 0, 0);

      //console.log("UPDATE PLAYER ", this.data.idx);

      var hexColor = this.$store.state.lastTheme.triangle_colors[this.data.idx];
      var hslColor = Utils.hexToHSL(hexColor);
      //console.log("HSL ",hslColor)

      let color = new Color(
        this.data.color.r,
        this.data.color.g,
        this.data.color.b
      );

      //Ringfarbe lerpen
      var currentY = target.y == 0 ? 0.01 : target.y;
      this.currentColor = this.bottomColor
        .clone()
        .lerp(
          color,
          Math.min(1, Math.max(0, currentY / this.data.transform.headHeight))
        );

      //ring.material.color = this.currentColor;
      this.rings.map((ring, index) => {
        var lerpAlpha = (1 / (this.rings.length - 1)) * index;
        var lerper = target.clone().lerp(origin, lerpAlpha);
        //ring.position.set(0,lerper.y, );
        ring.position.y = lerper.y;
      });

      //UPDATE POSITION
      if (!this.inVR) {
        this.KeyBoardMovement();
      } else {
        var vrCamera = this.$store.state.xr.Renderer.instance.xr.getCamera(
          this.$store.state.xr.Camera.instance
        );

        vrCamera.matrixWorld.decompose(
          this.transform.position,
          this.transform.rotation,
          this.transform.scale
        );
        this.player.position.set(
          this.transform.position.x,
          this.transform.position.y,
          this.transform.position.z
        );
        this.playerGroup.position.set(
          this.transform.position.x,
          0,
          this.transform.position.z
        );

        this.playerFloor.position.set(
          this.transform.position.x,
          0,
          this.transform.position.z
        );

        this.player.quaternion = this.transform.rotation.clone();

        if (
          this.player.position.y < this.transform.headHeight * 0.6 &&
          !this.explosition
        ) {
          this.Explode();
        }

        if (
          this.player.position.y > this.transform.headHeight * 0.6 &&
          this.explosition
        ) {
          this.explosition = false;
        }

        //RESET INTERSECTION CHECK
        var pos = new Vector3();
        var dir = new Vector3();
        vrCamera.getWorldPosition(pos);
        vrCamera.getWorldDirection(dir);
        this.raycaster.set(pos, dir);
        var intersection = this.raycaster.intersectObjects(
          [this.playerFloor],
          true
        );

        if (intersection.length > 0) {
          this.timer.SetVisible(true);
          if (this.timeout < 100) {
            this.timeout++;
          } else {
            this.timeout = 0;
            this.ResetCamera();
            this.thumb = false;
            this.timer.SetVisible(false);
          }

          this.timer.Progress(this.timeout);

          this.reset = true;
        } else {
          this.timer.SetVisible(false);
        }
      }

      this.delta += t.getDelta();

      if (this.delta > this.fps) {
        // The draw or time dependent code are here
        this.ReducedFPSCall();
        this.delta = this.delta % this.fps;
      }

      this.ApplyData();
    },
    ApplyData() {
      var dataCopy = Object.assign({}, this.data);
      dataCopy.transform.position.x = this.player.position.x;
      dataCopy.transform.position.y = this.player.position.y;
      dataCopy.transform.position.z = this.player.position.z;

      this.data = dataCopy;
    },
    ReducedFPSCall() {
      this.$socket.emit("client-player", this.data);
    },
  },
};
</script>