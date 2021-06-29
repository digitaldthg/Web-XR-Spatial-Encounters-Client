import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      xr : null,
      room : null,
      speed : 0.01,
      keysInit : false
    },
    mutations: {
      xr(state, data){
        state.xr = data;
      },
      room(state,data){
        state.room = data;
      },
      initKeyEvents(state, data){
        state.keysInit = data;
      },
      setSpeed(state, data){
        state.speed = data
      },

    },
    actions: {
    }
});