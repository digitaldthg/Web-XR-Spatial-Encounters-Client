<template>
  <div id="app">
    <div id="dev">
      {{id}}
      {{this.$store.state.room}}

      <router-link to="/">Home</router-link>
    </div>
    <router-view></router-view>
    
  </div>
</template>

<script>
import config from "../main.config";

import store from './store';

export default {
  store,
  name: 'App',
  data(){
    return {
      id: null
    }
  },
  sockets: {
    connect: function (d) {
      this.id = this.$socket.id;
    },    
  },
}
</script>

<style src="./style/button.css"></style>
<style>
*{
  box-sizing: border-box;
}

html,body{
  width:100%;
  height:100%;
}
body{
  margin:0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app {
  
  width:100%;
  height:100%;
}

#dev{
  position: absolute;
  top:0;
  padding:1rem;
  z-index: 999;
  background: #fff;
}
</style>
