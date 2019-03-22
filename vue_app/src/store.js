import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    userInfos: '',
    scenarios:''
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
        anonymous: data.anonymous,
        emailHash: data.emailHash,
        listenList: data.listenList,
        recordList: data.recordList
      }
    },
    SET_SCENARIOS: (state, data) => { 
      state.scenarios = data
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
    }
  },
  getters: {

  }
})
