import Vue from 'vue';

import VueRouter from 'vue-router';
import router from './Router';

import App from './App.vue';

import store from './store';
import VueSocketIO from 'vue-socket.io';
import config from "../main.config";
import InputColorPicker from "vue-native-color-picker";

const socketConnection = new VueSocketIO({
  debug: false,
  connection: config.IP + ":"+ config.PORT,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
  options: { 
    secure: true,
    withCredentials: true,
    rejectUnauthorized: false,
    //transports: ['websocket'], 
    upgrade: false
  }
});


Vue.use(VueRouter);
Vue.use(socketConnection);
Vue.use(InputColorPicker);


Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
