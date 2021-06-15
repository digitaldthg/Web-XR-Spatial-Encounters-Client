import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      xr : null,
    },
    mutations: {
      xr(state, data){
        state.xr = data;
      }
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