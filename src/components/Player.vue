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
  BackSide,
  TorusGeometry,
} from "three";
import UserData from "../class/UserData";
import Timer from "../Timer";
import explodingRing from "../scripts/explodingRing";
import Utils from "../scripts/utils";
import triangleUtils from "../scripts/triangleUtils";
import Particles from "./Particles"
import TWEEN from "@tweenjs/tween.js";

import AudioController from "./Audio/AudioController";

function ease(x) {
  const c1 = 5.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

Vector3.lerp = function (v, alpha) {
  this.x += (v.x - this.x) * alpha;
  this.y += (v.y - this.y) * alpha;
  this.z += (v.z - this.z) * alpha;
  this.w += (v.w - this.w) * alpha;

  return this;
};

export default {
  name: "Player",
  data() {
    return {
      delta: 0,
      fps: 0.1,
      player: null,
      playerMaterial : new MeshBasicMaterial({
          side: DoubleSide,
          transparent:false,
          opacity :1
      }),
      ready: false,
      timer: null,
      timerTimeout: false,
      maxTimeout: 100, //Ladezeit
      timerTimeoutTime: 3000, //Zeit bis zum naechsten Reset
      timeout: 0,
      thumb: false,
      rings: [],
      ringScales: [],
      explosition: false,
      explodingFactor: 0.7,
      ringOffset: 0.15,
      bottomColor: new Color(0xff0000),
      keyArray: ["w", "a", "s", "d", "e", "j"],
      speed: 0.05,
      data: Object.assign({}, UserData),
      raycaster: null,
      transform: {
        position: new Vector3(0, 1.75, 0),
        rotation: new Quaternion(),
        scale: new Vector3(),
      },
      head: null,
      lazyFollower: null,
      dummyObject: null,
      inVR: false,
      AudioController: null,
      jumpOffset: 0,
      jumpFollowOffset: 0,
      jump: false,

      currentColor: new Color(0x0000ff),
      key: {
        w: 0,
        a: 0,
        d: 0,
        s: 0,
      },
    };
  },
  watch: {
    "$store.state.presentation" : function(boolean){
      this.player.visible = !boolean;

      console.log("presentation " , boolean);

      this.rings.map((r)=>{
        r.visible = !boolean;
      })
    
    },
    "$store.state.xr": function (state) {
      console.log("state player", state);
      this.ready = true;

      this.InitPlayer();

      this.InitTimer();
    },
  },

  mounted() {
    this.AudioController = new AudioController(this.$store);
  },
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

      var count = 10;
      for (var i = 0; i <= count; i++) {
        let scale = (1 / (count + 1)) * (i + 1);
        const geometry = new TorusGeometry(scale, 0.008, 6, 64); //new CylinderGeometry(scale, scale, 0.06, 64, 2, true);
        const ring = new Mesh(geometry, this.playerMaterial);
        this.playerMaterial.color = color;
        ring.rotation.x = (90 * Math.PI) / 180;

        this.$store.state.xr.Scene.add(ring);
        this.ringScales.push(scale);
        this.rings.push(ring);
      }

      this.player = new Group();

      this.$store.state.xr.Scene.add(this.player);
      this.$store.state.xr.Scene.add(this.playerGroup);

      this.lazyFollower = new Mesh(
        new BoxGeometry(0.1, 0.1, 0.1),
        new MeshNormalMaterial()
      );
      this.lazyFollower.position = new Vector3(0, 0, 0);
      this.lazyFollower.scale.set(0, 0, 0);
      this.lazyFollower.visible = false;
      this.$store.state.xr.Scene.add(this.lazyFollower);

      this.head = new Mesh(
        new BoxGeometry(0.1, 0.1, 0.1),
        new MeshBasicMaterial({ color: 0xff0000 })
      );
      this.head.scale = new Vector3(0, 0, 0);
      this.head.position = new Vector3(0, 0, 0);
      this.$store.state.xr.Scene.add(this.head);

      this.dummyObject = new Mesh(
        new BoxGeometry(0.1, 0.1, 0.1),
        new MeshNormalMaterial()
      );
      this.dummyObject.visible = false;
      this.dummyObject.position = new Vector3(0, 0, 0);
      this.$store.state.xr.Scene.add(this.dummyObject);

      this.data.room = this.$route.params.roomID;

      this.raycaster = new Raycaster();
      this.CreatePlayerFloor();
      this.InitEvents();
    },
    CreatePlayerFloor() {
      const geometry = new CircleGeometry(0.2, 32);
      const material = new MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
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

      this.playerFloor.add(this.timer.instance);
    },

    ResetCamera() {
      this.AudioController.PlaySound("menu.click");
      this.$store.state.xr.Controls.SetPositionAndRotation(
        new Vector3(
          this.$store.state.startPosition.x,
          this.$store.state.startPosition.y,
          this.$store.state.startPosition.z
        ),
        new Vector3(0, 0, 7)
      );

      var vrCamera = this.$store.state.xr.Renderer.instance.xr.getCamera(
        this.$store.state.xr.Camera.instance
      );

      vrCamera.matrixWorld.decompose(
        this.transform.position,
        this.transform.rotation,
        this.transform.scale
      );

      this.data.transform.headHeight = this.transform.position.y;
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
          this.EmitExplode();
          break;
        case "j":
          this.EmitJump();
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
      this.player.position.y = 1.75; // + this.jumpOffset;

      this.playerGroup.position.x += dir.x * this.speed;
      this.playerGroup.position.z += dir.z * this.speed;
      this.playerGroup.position.y = this.jumpOffset;
    },
    EmitExplode() {
      console.log("EXPLOSION");
      this.$socket.emit("client-player-explode", {
        position: this.playerGroup.position,
        color: {
          r: this.currentColor.r,
          g: this.currentColor.g,
          b: this.currentColor.b,
        },
      });
    },

    EmitJump() {
      this.$socket.emit("client-player-jump", {
        id: this.$store.state.socketID
      });
      this.Jump();
    },

    Jump() {
      var start = {
        offset: 0,
      };
      var end = {
        offset: 10,
      };
      new TWEEN.Tween(start)
        .to(end, 200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate((v) => {
          this.jumpOffset = v.offset;
        })
        .start()
        .onComplete(() => {
         
          new TWEEN.Tween({
            offset: 10,
          })
            .to(
              {
                offset: 0,
              },
              8000
            )
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate((v) => {
              this.jumpOffset = v.offset;
            })
            .start();
        });

      var startFollow = {
        offset: 0,
      };
      var endFollow = {
        offset: 15,
      };

      new TWEEN.Tween(startFollow)
        .to(endFollow, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((v) => {
          this.jumpFollowOffset = v.offset;
        })
        .start()
        .onComplete(() => {
           var particlePosition =  this.player.position.clone();
          particlePosition.y =  10;
          console.log("PART POS ",particlePosition)
          new Particles(this.$store, particlePosition);

          new TWEEN.Tween({
            offset: 15,
          })
            .to(
              {
                offset: 0,
              },
              8000
            )
            .easing(TWEEN.Easing.
Cubic.InOut)
            .onUpdate((v) => {
              this.jumpFollowOffset = v.offset;
            })
            .start();
        });
    },

    Animate(t) {
      if (!this.ready) {
        return;
      }

      //UPDATE COLOR
      var target = this.transform.position.clone();
      var origin = this.lazyFollower.position.clone();

      //TOP COLOR
      var colorIdxLast =
        this.$store.state.ownIdx %
        this.$store.state.lastTheme.triangle_colors.length;
      var colorLastHex =
        typeof this.$store.state.lastTheme == "undefined"
          ? "#ffffff"
          : this.$store.state.lastTheme.triangle_colors[colorIdxLast];
      var colorIdxNext =
        this.$store.state.ownIdx %
        this.$store.state.nextTheme.triangle_colors.length;
      var colorNextHex =
        typeof this.$store.state.nextTheme == "undefined"
          ? "#ffffff"
          : this.$store.state.nextTheme.triangle_colors[colorIdxNext];

      var colorTop = Utils.lerpColor(
        [{ value: colorLastHex }],
        [{ value: colorNextHex }],
        this.$store.state.themeLerp
      );

      let color = new Color();
      color.setHSL(
        colorTop[0].value[0] / 360,
        colorTop[0].value[1] / 100,
        colorTop[0].value[2] / 100
      );

      //BOTTOM COLOR
      var colorLastHexBottom =
        typeof this.$store.state.lastTheme == "undefined"
          ? "#623095"
          : this.$store.state.lastTheme.triangle_color_bottom;

      var colorNextHexBottom =
        typeof this.$store.state.nextTheme == "undefined"
          ? "#623095"
          : this.$store.state.nextTheme.triangle_color_bottom;

      var colorBottom = Utils.lerpColor(
        [{ value: colorLastHexBottom }],
        [{ value: colorNextHexBottom }],
        this.$store.state.themeLerp
      );

      let colorBottomHSL = new Color();
      colorBottomHSL.setHSL(
        colorBottom[0].value[0] / 360,
        colorBottom[0].value[1] / 100,
        colorBottom[0].value[2] / 100
      );

      //Ringfarbe lerpen
      var currentY = target.y == 0 ? 0.01 : target.y;

      var heightOffset = this.data.transform.headHeight * this.explodingFactor;

      this.currentColor = colorBottomHSL
        .clone()
        .lerp(
          color,
          Math.min(
            1,
            Math.max(
              0,
              (currentY - heightOffset) /
                (this.data.transform.headHeight - heightOffset)
            )
          )
        );

      var ring_pos = this.player.position.clone();

      //UPDATE POSITION
      if (!this.inVR) {
        this.KeyBoardMovement();
      } else {
        var vrCamera = this.$store.state.xr.Renderer.instance.xr.getCamera(
          this.$store.state.xr.Camera.instance
        );

        this.$store.state.xr.Camera.instance.parent.position.y =
          this.jumpOffset;

        vrCamera.matrixWorld.decompose(
          this.transform.position,
          this.transform.rotation,
          this.transform.scale
        );

        this.player.position.set(
          this.transform.position.x,
          this.transform.position.y + this.jumpOffset,
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

        //RESET INTERSECTION CHECK

        if (this.$store.state.canCalibrate) {
          console.log("canCalibrate");

          var pos = new Vector3();
          var dir = new Vector3();
          vrCamera.getWorldPosition(pos);
          vrCamera.getWorldDirection(dir);
          this.raycaster.set(pos, dir);
          var intersection = this.raycaster.intersectObjects(
            [this.playerFloor],
            true
          );

          ring_pos = pos.clone();

          if (intersection.length > 0 && !this.timerTimeout) {
            this.timer.SetVisible(true);
            if (this.timeout < this.maxTimeout) {
              this.timeout++;
            } else {
              this.timeout = 0;
              this.ResetCamera();
              this.thumb = false;
              this.timer.SetVisible(false);
              this.timerTimeout = true;

              setTimeout(() => {
                this.timerTimeout = false;
              }, this.timerTimeoutTime);
            }

            this.timer.Progress(this.timeout, this.maxTimeout);
            this.reset = true;
          } else {
            this.timer.SetVisible(false);
          }
        }
      } // end of only VR

      this.head.position = ring_pos.clone();
      this.head.rotation.copy(this.$store.state.xr.Camera.instance.rotation);

      this.lazyFollower.position.lerp(
        new Vector3(ring_pos.x, 0, ring_pos.z),
        0.01
      );

      this.$store.commit("setPlayerPosition", this.head.position);
      //Calculate forward playerDirectionVector für Camera um die Playerringe etwas nach hinten zu schieben
      this.playerDirectionVector = new Vector3();
      this.$store.state.xr.Camera.instance.getWorldDirection(
        this.playerDirectionVector
      );
      this.playerDirectionVector.y = 0;
      this.playerDirectionVector.normalize();

      var fac = -0.2;

      this.rings.map((ring, index) => {
        var scale = this.ringScales[index]*(1+this.jumpFollowOffset*0.2)
        ring.scale.set(scale,scale,scale)
        var lerpAlpha = (1 / this.rings.length) * index;
        var _origin = this.lazyFollower.position.clone();
        _origin.y = this.jumpFollowOffset;
        var _target = ring_pos.clone();
        _target.y *= 0.78;
        _target.y += this.jumpOffset;
        var lerper = _target.clone().lerp(_origin.clone(), lerpAlpha);
        var lerperPos = _target.clone().lerp(_origin.clone(), lerpAlpha);

        ring.position.x = lerperPos.x + this.playerDirectionVector.x * fac;

        ring.position.y = lerper.y;
        ring.position.z = lerperPos.z + this.playerDirectionVector.x * fac;

        ring.material.color = this.currentColor;
      });

      this.delta += t.getDelta();
      this.ApplyData();

      if (
        !this.explosition &&
        this.player.position.y <
          this.data.transform.headHeight * this.explodingFactor
      ) {
        console.log("EXPLOION");
        this.EmitExplode();
        this.explosition = true;
      } else if (
        this.explosition &&
        this.player.position.y >
          this.data.transform.headHeight * this.explodingFactor
      ) {
        this.explosition = false;
      }

      if (
        !this.jump &&
        this.player.position.y > this.data.transform.headHeight * 1.2
      ) {
        this.EmitJump();
        this.jump = true;
      } else if (
        this.jump &&
        this.player.position.y < this.data.transform.headHeight * 0.9
      ) {
        this.jump = false;
      }


      if (this.delta > this.fps) {
        // The draw or time dependent code are here
        this.ReducedFPSCall();
        this.delta = this.delta % this.fps;
      }
    },
    ApplyData() {
      var dataCopy = Object.assign({}, this.data);
      dataCopy.transform.position.x = this.lazyFollower.position.x;
      dataCopy.transform.position.y = this.lazyFollower.position.y;
      dataCopy.transform.position.z = this.lazyFollower.position.z;

      dataCopy.transform.headPosition.x = this.player.position.x;
      dataCopy.transform.headPosition.y = this.player.position.y;
      dataCopy.transform.headPosition.z = this.player.position.z;

      dataCopy.color = {
        r: this.currentColor.r,
        g: this.currentColor.g,
        b: this.currentColor.b,
      };

      this.data = dataCopy;
    },
    ReducedFPSCall() {
      this.$socket.emit("client-player", this.data);
    },
  },
};
</script>