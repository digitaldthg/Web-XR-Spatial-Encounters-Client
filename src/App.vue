<template>
  <div id="app">
    <router-view></router-view>

    <div id="canvases" :class="{visible : visible, 'not-visible' : !visible}"></div>
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
      visible : config.showDevTools,
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

<style src="./style/button.css"></style>
<style>

*{
  box-sizing: border-box;
}

html,body, #app{
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


canvas{
  top: 0;
  left: 0;
}

div#canvases {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 200px;
  display: flex;
}

#canvases canvas {
  width: 20%!important;
  height: 100%!important;
  position: relative;
}


.not-visible{
  display:none!important;
}

</style>
