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
      console.log(friend.id, this.$store.state.socketID, friend.id == this.$store.state.socketID);

      if (this.friends.hasOwnProperty(friend.id) && friend.id != this.$store.state.socketID) {
        //this.$store.state.xr.Scene.remove(this.friends[friend.id]);
        this.friends[friend.id].delete();
        delete this.friends[friend.id];


        console.log("delete friend with id ", friend.id);


      }
    },
    "server-friends-update": function (d) {
      var serverFriends = Object.assign({}, d);
      var localFriends = Object.assign({}, this.friends);

      this.$store.commit("idx",Object.keys(serverFriends).indexOf(this.$socket.id));

      this.$store.commit("serverFriends", serverFriends);
      //delete serverFriends[this.$socket.id];

      Object.keys(serverFriends).map((f,index) => {
        //console.log("INDEX ",index)
        console.log(serverFriends[f]);


        if(this.$socket.id == f || !serverFriends[f].visible){

          if(localFriends.hasOwnProperty(f)){
            localFriends[f].delete();
            delete localFriends[f];
            console.log("delete local friend because invisible");
          }

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