import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      xr : null,
      room : null,
      speed : 0.01
    },
    mutations: {
      xr(state, data){
        state.xr = data;
      },
      room(state,data){
        state.room = data;
      }
    },
    actions: {
    }
});