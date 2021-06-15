<template>
  <div id="app">
    {{id}}
<Controls/>
    <Scene />
  </div>
</template>

<script>
import config from "../main.config";
import Scene from './components/Scene.vue';
import Controls from './components/Controls.vue'
import store from './store';

export default {
  store,
  components: { Scene,Controls },
  name: 'App',
  data(){
    return {
      id: null
    }
  },
  sockets: {
    connect: function (d) {
      console.log(this.$socket.id);
      this.id = this.$socket.id;
    },
   
    
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
