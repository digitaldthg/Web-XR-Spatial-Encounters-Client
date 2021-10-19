<template>
  <div class="page">
    <Controls/>
    
    <div class="errorMessage" v-if="errorMsg != null">
      {{errorMsg}}
    </div>
    <Scene />
  </div>
</template>

<script>
import Controls from '../components/Controls.vue';
import Scene from '../components/Scene.vue';
export default {
  name : "Room",
  components: { Scene, Controls },
  data(){
    return {
      errorMsg : null,
      fromJoin : false
    }
  },
  beforeDestroy(){

    this.$socket.emit( "room-leave" , {
      id : this.$socket.id,
      room : this.$store.state.room
    });
  },
  mounted(){
    
    this.CheckForRoom();
  },
 
  methods:{
    CheckForRoom(){
      if(typeof(this.$socket.id) == "undefined" || this.$store.state.room == null){
        this.$router.push("/");
      }
      
    }
  }
}
</script>