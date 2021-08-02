import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      xr : null,
      room : null,
      speed : 0.1,
      frequency: 1,
      keysInit : false,
      themeLerp: 0,
    lastTheme: null,
    nextTheme: null,
    allThemes: []
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
        console.log("Set Speed ",data)
        state.speed = data
      },
      setFrequency(state,frequ){
        console.log("Set Frequ ",frequ)
        state.frequency = frequ
      },
      setThemeLerp(state,alpha){
        console.log("Set Theme Lerp",alpha)
        state.themeLerp = alpha
      },
      setLastTheme(state,theme){
        state.lastTheme = theme
      },
      setNextTheme(state,theme){
        state.nextTheme = theme
      },
      setAllThemes(state,themes){
        state.allThemes = themes
      },

    },
    actions: {
    }
});