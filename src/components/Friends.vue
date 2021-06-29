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
      this.$store.state.xr.Loader.load({
        name: "Ring",
        url: Ring,
        onprogress: () => {
          console.log("progress");
        },
      }).then((model) => {
        model.scene.children[0].material = new MeshBasicMaterial({
          color: new Color(0.5, 0.5, 0.5, 1),
          side: DoubleSide,
        });

        this.friendRings = new Group();
        
        for(var i=0;i<5;i++){
          let ring =  model.scene.children[0].clone();
          let scale = (1 - (.05 * i));
              ring.scale.set(ring.scale.x - scale, 1 , ring.scale.x - scale);
              ring.position.set(0, .25 * i ,0);
              
              this.friendRings.add(ring);

        }
        // var firstRing = model.scene.children[0].clone();
        //     firstRing.scale.set(firstRing.scale.x*0.75, firstRing.scale.y , firstRing.scale.z*0.75);


        console.log("RING LOADED", model.scene);
      });

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
        this.$store.state.xr.Scene.remove(this.friends[friend.id]);

        delete this.friends[friend.id];
      }
    },
    "server-friends-update": function (d) {
      var serverFriends = Object.assign({}, d);
      var localFriends = Object.assign({}, this.friends);
      delete serverFriends[this.$socket.id];

      Object.keys(serverFriends).map((f) => {
        console.log("FRIEND RINGS ",this.friendRings)
        if (this.friendRings != null) {
          if (!localFriends.hasOwnProperty(f)) {
            localFriends[f] = this.CreateFriend(serverFriends[f]);
          } else {
            localFriends[f] = this.UpdateFriend(f, serverFriends[f]);
          }
        }
      });

      this.friends = localFriends;
    },
  },
  methods: {
    CreateFriend(serverData) {
      /*const geometry = new ConeGeometry(0.5, 1, 12, 2, false, 0, Math.PI * 2);

      var friend = new Mesh(
        geometry,
        new MeshBasicMaterial({
          color: new Color(
            serverData.color.r,
            serverData.color.g,
            serverData.color.b,
            serverData.color.a
          ),
        })
      );*/

      var friend = this.friendRings.clone();

      friend.position.x = serverData.transform.position.x;
      friend.position.y = serverData.transform.position.y;
      friend.position.z = serverData.transform.position.z;

      friend.userData.targetPosition = new Vector3(
        serverData.transform.position.x,
        serverData.transform.position.y,
        serverData.transform.position.z
      );
      friend.userData.lastPosition = new Vector3(
        serverData.transform.position.x,
        serverData.transform.position.y,
        serverData.transform.position.z
      );
      friend.userData.lerpAlpha = 0;
      friend.userData.color = Object.assign({}, serverData.color);

      this.$store.state.xr.Scene.add(friend);
      return friend;
    },

    UpdateFriend(friendId, serverData) {
      this.friends[friendId].userData.targetPosition = new Vector3(
        serverData.transform.position.x,
        serverData.transform.position.y,
        serverData.transform.position.z
      );

      this.friends[friendId].userData.lastPosition =
        this.friends[friendId].position.clone();
      this.friends[friendId].userData.lerpAlpha = 0;
      this.friends[friendId].userData.color = Object.assign(
        {},
        serverData.color
      );

      return this.friends[friendId];
    },
    AnimateFriends() {
      //console.log("AnimateFriends", this.friends);

      Object.values(this.friends).map((friend) => {
        this.AnimateSingleFriend(friend);
      });
    },
    AnimateSingleFriend(friend) {
      if (friend.userData.targetPosition != null) {
        var newPos = friend.userData.lastPosition.lerp(
          friend.userData.targetPosition,
          friend.userData.lerpAlpha / 100
        );
        //var newQuat = this.lastRotation.slerp(this.nextRotation , this.lerpAlpha / 100);
        friend.position.set(newPos.x, newPos.y, newPos.z);
        //this.instance.quaternion.set(newQuat.x, newQuat.y, newQuat.z, newQuat.w);
        friend.userData.lerpAlpha++;

        /*friend.material.color = new Color(
          friend.userData.color.r,
          friend.userData.color.g,
          friend.userData.color.b,
          friend.userData.color.a
        );*/

        if (friend.userData.lerpAlpha >= 100) {
          friend.userData.lerpAlpha = 0;
          friend.userData.targetPosition = null;
        }
      }
    },
  },
};
</script>