import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    xr: null,
    speed: 0.005
  },
  mutations: {
    xr(state, data) {
      state.xr = data;
    },
    // "<MUTATION_PREFIX><EVENT_NAME>"() {
    //     // do something
    // }
  },
  actions: {
    // "<ACTION_PREFIX><EVENT_NAME>"() {
    //     // do something
    // }
  }
});