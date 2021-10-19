<template></template>
<script>
import SingleFriend from "./SingleFriend";

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
      if (
        this.friends.hasOwnProperty(friend.id) &&
        friend.id != this.$store.state.socketID
      ) {
        this.friends[friend.id].delete();
        delete this.friends[friend.id];
      }
    },
    "server-friends-update": function (d) {
      var serverFriends = Object.assign({}, d);
      var localFriends = Object.assign({}, this.friends);

      this.$store.commit(
        "idx",
        Object.keys(serverFriends).indexOf(this.$socket.id)
      );

      this.$store.commit("serverFriends", serverFriends);

      Object.keys(serverFriends).map((f, index) => {
        if (this.$socket.id == f || !serverFriends[f].visible) {
          if (localFriends.hasOwnProperty(f)) {
            localFriends[f].delete();
            delete localFriends[f];
          }

          return;
        }
        if (!localFriends.hasOwnProperty(f)) {
          localFriends[f] = new SingleFriend(this.$store, serverFriends[f], f);
        } else {
          localFriends[f].updateData(serverFriends[f], index);
        }
      });

      this.friends = localFriends;
    },
    "server-player-jump": function (data) {
      Object.values(this.friends).map((friend) => {
        if(friend.id == data.id){
          friend.Jump();
        }
      });

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