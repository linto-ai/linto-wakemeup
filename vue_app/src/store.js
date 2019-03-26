import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    userInfos: '',
    scenarios:'',
    audios: ''
  },
  mutations: {
    SET_USER: (state, data) => {
      state.userInfos = {
        email: data.email,
        gender: data.gender,
        deviceType: data.deviceType,
        firstName: data.firstName,
        lastName: data.lastName,
        ageRange: data.ageRange,
        nbListen: data.nbListen,
        nbRecord: data.nbRecord,
        userHash: data.userHash,
        recordList: data.recordList
      }
    },
    SET_SCENARIOS: (state, data) => { 
      state.scenarios = data
    },
    SET_AUDIOS: (state, data) => { 
      state.audios = data
    }
      
  },
  actions: {
    getUserInfos: async ({ commit, state }, hash) => {
      try {
        const getUser = await axios(`${process.env.VUE_APP_URL}/api/getUserInfos`,{
          method: 'post',
          data: { hash }
        })
        commit('SET_USER', getUser.data.user[0])
        return state.userInfos
      } catch (err) {
        console.error(err)
      }
    },
    getScenarios: async ({ commit, state }) => {
      try {
        const getScenarios = await axios(`${process.env.VUE_APP_URL}/api/scenarios`,{
          method: 'get'
        })
        commit('SET_SCENARIOS', getScenarios.data.scenarios)
        return state.scenarios
      } catch (err) {
        console.error(err)
      }
    },
    getAudios: async ({ commit, state }, userHash) => {
      try {
        const getAudios = await axios(`${process.env.VUE_APP_URL}/api/getAudios`,{
          method: 'get'
        })
        const audios = getAudios.data.audios
        let validAudios = []
        audios.map(a => {
          if(a.author !== userHash && !!a.userVoted){
            if(a.userVoted.indexOf(userHash) < 0){
              validAudios.push(a)
            }
          }
        })
        commit('SET_AUDIOS', validAudios)
        return state.audios
      } catch (err) {
        console.error(err)
      }
    }
  },
  getters: {
    USER_AUDIOS : (state) => {
      let audios = state.audios
      
      for (let i in lintos) {
        if (lintos[i].associatedRoom !== 'null') {
          for (let r in rooms) {
            if (!!rooms[r]._id && rooms[r].technicalId === lintos[i].associatedRoom) {
              lintos[i].roomId = rooms[r]._id
            } else if (!rooms[r]._id && rooms[r].technicalId === lintos[i].associatedRoom) {
              lintos[i].roomId = rooms[r].id
            }
          }
          associatedLintos.push(lintos[i])
        }
      }
      return associatedLintos
    },
  }
})
