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
  BackSide
} from "three";
import UserData from "../class/UserData";
import Timer from "../Timer";
import explodingRing from "../scripts/explodingRing";
import Utils from "../scripts/utils";
import triangleUtils from '../scripts/triangleUtils';


function ease(x){
  const c1 = 5.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

Vector3.lerp = function ( v, alpha ) {

  this.x += ( v.x - this.x ) * alpha;
  this.y += ( v.y - this.y ) * alpha;
  this.z += ( v.z - this.z ) * alpha;
  this.w += ( v.w - this.w ) * alpha;

  return this;
}

export default {
  name: "Player",
  data() {
    return {
      delta: 0,
      fps: .1,
      player: null,
      ready: false,
      timer: null,
      timerTimeout : false,
      maxTimeout : 300,
      timerTimeoutTime : 2000,
      timeout: 0,
      thumb: false,
      rings: [],
      explosition: false,
      explodingFactor: 0.8,
      ringOffset: 0.15,
      bottomColor: new Color(0xff0000),
      keyArray: ["w", "a", "s", "d", "e"],
      speed: 0.05,
      data: Object.assign({}, UserData),
      raycaster: null,
      transform: {
        position: new Vector3(0, 1.75, 0),
        rotation: new Quaternion(),
        scale: new Vector3(),
      },
      head : null,
      lazyFollower : null,
      dummyObject : null,
      inVR: false,
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
      /*var target = new Vector3(
        this.data.transform.position.x,
        this.data.transform.position.y,
        this.data.transform.position.z
      );
      var origin = new Vector3(0, 0, 0);*/
      for (var i = 0; i <= 15; i++) {
        let scale = 0.05 * i;
        scale = scale < .3 ? .3 : scale;
        const geometry = new CylinderGeometry(scale, scale, 0.06, 64, 2, true);
        const material = new MeshBasicMaterial({
          side: DoubleSide,
          color: color,
        });
        const ring = new Mesh(geometry, material);

        this.$store.state.xr.Scene.add(ring);
        this.rings.push(ring);
      }

      this.player = new Group();

      this.$store.state.xr.Scene.add(this.player);
      this.$store.state.xr.Scene.add(this.playerGroup);

      this.lazyFollower = new Mesh(new BoxGeometry(.1,.1,.1), new MeshNormalMaterial());
      this.lazyFollower.position = new Vector3(0,0,0);
      this.$store.state.xr.Scene.add(this.lazyFollower);
      
      this.head = new Mesh(new BoxGeometry(.1,.1,.1), new MeshBasicMaterial({color : 0xff0000}));
      this.head.position = new Vector3(0,0,0);
      this.$store.state.xr.Scene.add(this.head);


      this.dummyObject = new Mesh(new BoxGeometry(.1,.1,.1), new MeshNormalMaterial());
      this.dummyObject.position = new Vector3(0,0,0);
      this.$store.state.xr.Scene.add(this.dummyObject);

      this.data.room = this.$route.params.roomID;

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

      this.playerFloor.add(this.timer.instance);
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
          this.EmitExplode();
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
      this.player.position.y = 1.75;

      this.playerGroup.position.x += dir.x * this.speed;
      this.playerGroup.position.z += dir.z * this.speed;
    },
    EmitExplode() {

      this.$socket.emit("client-player-explode", {
        position: this.playerGroup.position,
        color: {r:this.currentColor.r,g:this.currentColor.g,b:this.currentColor.b}
      });
       
     },

    Animate(t) {
      if (!this.ready) {
        return;
      }

      //UPDATE COLOR
      var target = this.transform.position.clone();
      var origin = this.lazyFollower.position.clone();

      var colorLastHex =
        this.$store.state.lastTheme.triangle_colors[this.$store.state.ownIdx];
      var colorNextHex =
        this.$store.state.nextTheme.triangle_colors[this.$store.state.ownIdx];

      var lerpColor = Utils.lerpColor(
        [{ value: colorLastHex }],
        [{ value: colorNextHex }],
        this.$store.state.themeLerp
      );
      let color = new Color();
      color.setHSL(lerpColor[0].value[0]/360, lerpColor[0].value[1]/100, lerpColor[0].value[2]/100);
      //Ringfarbe lerpen
      var currentY = target.y == 0 ? 0.01 : target.y;

      this.currentColor = this.bottomColor
        .clone()
        .lerp(
          color,
          Math.min(1, Math.max(0, currentY / this.data.transform.headHeight))
        );

      var ring_pos = this.player.position.clone();
     
      //UPDATE POSITION
      if (!this.inVR) {
        this.KeyBoardMovement();
      } else {
        var vrCamera = this.$store.state.xr.Renderer.instance.xr.getCamera(
          this.$store.state.xr.Camera.instance
        );

        vrCamera.matrixWorld.decompose(this.transform.position,this.transform.rotation,this.transform.scale);

        this.player.position.set(this.transform.position.x,this.transform.position.y,this.transform.position.z);
        this.playerGroup.position.set(this.transform.position.x, 0, this.transform.position.z );
        this.playerFloor.position.set( this.transform.position.x, 0, this.transform.position.z );

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

        ring_pos = pos.clone();

        if (intersection.length > 0 && !this.timerTimeout) {
          this.timer.SetVisible(true);
          if (this.timeout < this.maxTimeout ) {
            this.timeout++;
          } else {

            console.log("timer auslösen");
            this.timeout = 0;
            this.ResetCamera();
            this.thumb = false;
            this.timer.SetVisible(false);
            this.timerTimeout = true;

            setTimeout(()=>{
              this.timerTimeout = false;
            }, this.timerTimeoutTime);
          }

          this.timer.Progress(this.timeout, this.maxTimeout);
          this.reset = true;
        } else {
          this.timer.SetVisible(false);
        }
      } // end of only VR
    
      this.head.position = ring_pos.clone(); //new Vector3(this.player.position.x ,this.player.position.y,this.player.position.z);
      this.lazyFollower.position.lerp(new Vector3(ring_pos.x,0,ring_pos.z), .01);
      


      this.rings.map((ring, index) => {

        var lerpAlpha = (1 / (this.rings.length)) * index ;
        var _origin = this.lazyFollower.position.clone();
        var _target = ring_pos.clone();
            _target.y *= .6;
        var lerper = _target.clone().lerp(_origin.clone(), lerpAlpha );
        var lerperPos = _target.clone().lerp(_origin.clone(), lerpAlpha );

        ring.position.x = lerperPos.x;
        ring.position.y = lerper.y;
        ring.position.z = lerperPos.z;

        ring.material.color = this.currentColor;

      });

      this.delta += t.getDelta();
      this.ApplyData();


      if(!this.explosition && this.player.position.y < this.headHeight * this.explodingFactor){
        this.EmitExplode();
        this.explosition = true;
      }else if(this.explosition && this.player.position.y > this.headHeight * this.explodingFactor ){
        this.explosition = false;
      }


      if (this.delta > this.fps) {
        // The draw or time dependent code are here
        this.ReducedFPSCall();
        this.delta = this.delta % this.fps;
      }
    },
    ApplyData() {
      var dataCopy = Object.assign({}, this.data);
      dataCopy.transform.position.x = this.player.position.x;
      dataCopy.transform.position.y = this.player.position.y;
      dataCopy.transform.position.z = this.player.position.z;
      dataCopy.color = {
        r: this.currentColor.r,
        g: this.currentColor.g,
        b: this.currentColor.b,
      };

      this.data = dataCopy;

      //console.log("fps");
    },
    ReducedFPSCall() {
      this.$socket.emit("client-player", this.data);     
    },
  },
};
</script>