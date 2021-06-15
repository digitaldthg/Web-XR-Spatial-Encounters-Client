<template>
  <div class="page">
    <div class="errorMessage" v-if="errorMsg != null">
      {{errorMsg}}
    </div>
    <Scene />
  </div>
</template>

<script>
import Scene from '../components/Scene.vue';
export default {
  name : "Room",
  components: { Scene },
  data(){
    return {
      errorMsg : null,
      fromJoin : false
    }
  },
  beforeDestroy(){

    console.log("room-leave");

    this.$socket.emit( "room-leave" , {
      id : this.$socket.id,
      room : this.$store.state.room
    });
  },
  mounted(){
    // if(typeof(this.$socket.io.id) == "undefined"){
    //   this.$nextTick(()=>{
    //     this.CheckForRoom();
    //   })
    // }else{
      
    // }
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