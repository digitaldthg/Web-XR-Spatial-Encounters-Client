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

      this.$store.commit("idx",Object.keys(serverFriends).indexOf(this.$socket.id))
      //delete serverFriends[this.$socket.id];

      Object.keys(serverFriends).map((f,index) => {
        //console.log("INDEX ",index)
        if(this.$socket.id == f){
          return;
        }
        if (!localFriends.hasOwnProperty(f)) {
            localFriends[f] = new SingleFriend(this.$store , serverFriends[f]);
          } else {
            localFriends[f].updateData(serverFriends[f],index);
          }
      });

      this.friends = localFriends;
    },
  },
  methods: {
    AnimateFriends(clock) {
      
      Object.values(this.friends).map((friend) => {
        friend.update(clock);
      });
    },
  },
};
</script>