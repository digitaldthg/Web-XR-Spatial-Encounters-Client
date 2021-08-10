import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    xr: null,
    room: null,
    ownIdx: 0,
    speed: 0.1,
    frequency: 1,
    keysInit: false,
    themeLerp: 0,
    startThemeName: "",
    lastTheme: null,
    nextTheme: null,
    allThemes: [],
    materialController: null,
    fogDistance: 0.01,
    playerPosition: null
  },
  mutations: {
    xr(state, data) {
      state.xr = data;
    },
    idx(state, idx) {
      state.ownIdx = idx;
    },
    room(state, data) {
      state.room = data;
    },
    setFogDistance(state, data) {
      state.fogDistance = data
    },
    initKeyEvents(state, data) {
      state.keysInit = data;
    },
    setMaterialController(state, data) {
      state.materialController = data;
    },
    setSpeed(state, data) {
      //console.log("Set Speed ",data)
      state.speed = data
    },
    setFrequency(state, frequ) {
      //console.log("Set Frequ ",frequ)
      state.frequency = frequ
    },
    setThemeLerp(state, alpha) {
      //onsole.log("Set Theme Lerp",alpha)
      state.themeLerp = alpha
    },
    setLastTheme(state, theme) {
      state.lastTheme = theme
    },
    setNextTheme(state, theme) {
      // if(this.state.themeLerp == 1){
      // state.lastTheme = theme
      // }else if(this.state.themeLerp == 0){
      state.nextTheme = theme
      //}
    },
    setAllThemes(state, themes) {
      state.allThemes = themes
    },
    setPlayerPosition(state,position){
      state.playerPosition = position
    }

  },
  actions: {
  }
});