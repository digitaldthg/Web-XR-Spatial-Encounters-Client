<template></template>
<script>
import {
  Mesh,
  SphereGeometry,
  ConeGeometry,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Vector3,
  Color,
  DoubleSide,
  Group
} from "three";
import Ring from "../Model/player_cylinder.glb";
import SingleFriend from './SingleFriend';

export default {
  name: "Friends",
  data() {
    return {
      xr: null,
      friends: {},
      friendRings: null,
    };
  },
  mounted() {},
  watch: {
    "$store.state.xr": function (xr) {
      // this.$store.state.xr.Loader.load({
      //   name: "Ring",
      //   url: Ring,
      //   onprogress: () => {
      //     console.log("progress");
      //   },
      // }).then((model) => {
      //   model.scene.children[0].material = new MeshBasicMaterial({
      //     color: new Color(0.5, 0.5, 0.5, 1),
      //     side: DoubleSide,
      //   });

      //   this.friendRings = new Group();
        
      //   for(var i=0;i<5;i++){
      //     let ring = model.scene.clone();
      //     ring.position.set(0,.25 * i,0);
      //     ring.scale.set(1 - (.15 * i),1,1 - (.15 * i));

      //     this.friendRings.add(ring);
      //   }

      //   console.log("RING LOADED", model.scene);
      // });

      this.$store.state.xr.Events.addEventListener(
        "OnAnimationLoop",
        this.AnimateFriends
      );
    },
  },
  sockets: {
    "server-friends-delete": function (friend) {
      console.log("%c smth disconnected", "background:#000; color:#fff;");
      console.log(friend.id);

      if (this.friends.hasOwnProperty(friend.id)) {
        //this.$store.state.xr.Scene.remove(this.friends[friend.id]);
        this.friends[friend.id].delete();
        delete this.friends[friend.id];
      }
    },
    "server-friends-update": function (d) {
      var serverFriends = Object.assign({}, d);
      var localFriends = Object.assign({}, this.friends);
      delete serverFriends[this.$socket.id];

      Object.keys(serverFriends).map((f) => {
        
        if (!localFriends.hasOwnProperty(f)) {
            localFriends[f] = new SingleFriend(this.$store , serverFriends[f]);
          } else {
            localFriends[f].updateData(serverFriends[f]);
          }
      });

      this.friends = localFriends;
    },
  },
  methods: {
    AnimateFriends() {
      
      Object.values(this.friends).map((friend) => {
        friend.update();
      });
    },
  },
};
</script>