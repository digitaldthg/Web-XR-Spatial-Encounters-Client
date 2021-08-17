import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    xr: null,
    room: null,
    ownIdx: 0,
    socketID : null,
    serverFriends: {},
    speed: 0.1,
    frequency: 1,
    keysInit: false,
    themeLerp: 0,
    startThemeName: "",
    lastTheme: null,
    nextTheme: null,
    lerpDuration: 2,
    allThemes: null,
    materialController: null,
    fogDistance: 0.2,
    playerPosition: null,
    startPosition:{x:0,y:0,z:7},
    autoOrbit : false,
    uiVisible : true,
    rotationSpeed : -1,
    triangleOpacity : 0.0
  },
  mutations: {
    ChangeRotationSpeed(state,data){
      state.rotationSpeed = data;
    },
    ToggleUI(state,data){
      state.uiVisible = data;
    },
    xr(state, data) {
      state.xr = data;
    },
    idx(state, idx) {
      state.ownIdx = idx;
    },
    socketID(state, id){
      state.socketID = id;
    },
    serverFriends(state, serverFriends){
      state.serverFriends = serverFriends;
    },
    room(state, data) {
      state.room = data;
    },
    setFogDistance(state, data) {
      state.fogDistance = data
    },
    setTriangleOpacity(state, data) {
      state.triangleOpacity = data
    },
    initKeyEvents(state, data) {
      state.keysInit = data;
    },
    setLerpDuration(state,data){
      state.lerpDuration = data
    },
    setMaterialController(state, data) {
      state.materialController = data;
    },
    setSpeed(state, data) {

      state.speed = data
    },
    setFrequency(state, frequ) {

      state.frequency = frequ
    },
    setThemeLerp(state, alpha) {

      state.themeLerp = alpha
    },
    setLastTheme(state, theme) {
      console.log("SET LAST THEME",theme)
      state.lastTheme = theme
    },
    setNextTheme(state, theme) {
      console.log("SET NEXT THEME",theme)
      state.nextTheme = theme

    },
    setAllThemes(state, themes) {
      if(state.allThemes == null){
        state.allThemes = themes
      }  
    },
    setPlayerPosition(state,position){
      state.playerPosition = position
    },
    ToggleAutoOrbit(state,autoOrbit){
      state.autoOrbit = autoOrbit;
    }

  },
  actions: {
  }
});