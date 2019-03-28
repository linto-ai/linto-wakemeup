import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { cpus } from 'os';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    userInfos: '',
    scenarios: '',
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
        recordList: data.recordList,
        role: data.role
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
    getUserInfos: async ({
      commit,
      state
    }, hash) => {
      try {
        const getUser = await axios(`${process.env.VUE_APP_URL}/api/user/getInfos`, {
          method: 'post',
          data: {
            hash
          }
        })
        commit('SET_USER', getUser.data.user[0])
        return state.userInfos
      } catch (err) {
        console.error(err)
      }
    },
    getScenarios: async ({
      commit,
      state
    }) => {
      try {
        const getScenarios = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
          method: 'get'
        })
        commit('SET_SCENARIOS', getScenarios.data.scenarios)
        return state.scenarios
      } catch (err) {
        console.error(err)
      }
    },
    getAudios: async ({
      commit,
      state
    }) => {
      try {
        const getAudios = await axios(`${process.env.VUE_APP_URL}/api/audios`, {
          method: 'get'
        })
        const audios = getAudios.data.audios
        
        commit('SET_AUDIOS', getAudios.data.audios)
        return state.audios
      } catch (err) {
        console.error(err)
      }
    }
  },
  getters: {
    AUDIO_BY_USER: (state) => (userHash) => {
      try {
        let audios = state.audios
        console.log('all audios', audios)
        let validAudios = []
        audios.map(a => {
          if (a.author !== userHash && !!a.userVoted) {
            if (a.userVoted.indexOf(userHash) < 0) {
              validAudios.push(a)
            }
          }
        })
        return validAudios
      } catch (err) {
        console.error(err)
      }
    },
    APP_STATS: (state) => {
      let scenarios = state.scenarios
      if (scenarios.length > 0) {

        let nbListen = 0
        let nbRecord = 0
        scenarios.map(s => {
          nbListen += s.nbListen
          nbRecord += s.nbRecord
        })

        return {
          nbListen,
          nbRecord
        }
      }
    },
    GENDER_RATIO: (state) => {
      let male = 0
      let female = 0
      let audios = state.audios
      audios.map(a => {
        if (a.gender === 'male') {
          male += 1
        } else if (a.gender === 'female') {
          female += 1
        }
      })

      const total = male + female
      const pctMale = male * 100 / total
      const pctFemale = female * 100 / total

      return {
        total,
        pctMale,
        pctFemale
      }
    },
    DEVICES_RATIO: (state) => {
      let audios = state.audios
      let defaultDevice = 0
      let headphone = 0
      let external = 0

      audios.map(a => {
        if (a.deviceType === 'default'){
          defaultDevice += 1
        } else if (a.deviceType === 'casque') {
          headphone += 1
        } else if (a.deviceType === 'pied') { 
          external += 1
        }
      })

      const total = parseInt(defaultDevice) + parseInt(headphone) + parseInt(external)

      const prctDefault = defaultDevice * 100 / total
      const prctHeadphone = headphone * 100 / total
      const prctExternal = external * 100 / total 
      console.log('GETTER:', total, defaultDevice, headphone, external)
      console.log('RESP:',prctDefault, prctExternal, prctHeadphone)
      return {
        prctDefault,
        prctExternal,
        prctHeadphone
      }
    }
  }
})