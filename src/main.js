import Vue from 'vue';
import App from './App.vue';

import store from './store';
import VueSocketIO from 'vue-socket.io';
import config from "../main.config";

const socketConnection = new VueSocketIO({
  debug: false,
  connection: config.IP + ":"+ config.PORT,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
  options: { 
    withCredentials: true,
  }
});

console.log(socketConnection);



Vue.use(socketConnection);


Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
}).$mount('#app')
