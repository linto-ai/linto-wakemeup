import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

function compareValues(param) {
    return function(a, b) {
        const key = param.key
        const order = param.order
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0
        }
        const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]

        let comparison = 0
        if (varA > varB) {
            comparison = 1
        } else if (varA < varB) {
            comparison = -1
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        )
    }
}

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        userInfos: '',
        scenarios: '',
        audios: '',
        voteLimit: 3,
        validAudios: null
    },
    mutations: {
        // Set user infos without sensitive datas
        SET_USER: (state, data) => {
            state.userInfos = {
                email: data.email,
                userName: data.userName,
                gender: data.gender,
                deviceType: data.deviceType,
                ageRange: data.ageRange,
                nbListen: data.nbListen,
                nbRecord: data.nbRecord,
                userHash: data.userHash,
                recordList: data.recordList,
                nativeFrench: data.nativeFrench,
                language: data.language,
                role: data.role,
                id: data._id
            }
        },
        // Set recording scenarios
        SET_SCENARIOS: (state, data) => {
            state.scenarios = data
        },
        // Set audio files
        SET_AUDIOS: (state, data) => {
            state.audios = data
        },
        // Sort audios list by key
        SORT_AUDIOS: (state, param) => {
            let audioList = state.audios
            let sortTable = audioList.sort(compareValues(param))
            state.audios = sortTable
        },
        SET_VOTE_LIMIT: (state, data) => {
            state.voteLimit = data
        },
        SET_RECORD_GOAL: (state, data) => {
            state.recordGoal = data
        },
        SET_NB_VALID_AUDIOS: (state, data) => {
            state.validAudios = data
        }
    },
    actions: {
        // Get user informations after connexion
        getUserInfos: async({ commit, state }, hash) => {
            try {
                const getUser = await axios(`${process.env.VUE_APP_URL}/api/user/getInfos`, {
                    method: 'post',
                    data: { hash }
                })
                if (getUser.data.user.length > 0) {
                    commit('SET_USER', getUser.data.user[0])
                }
                return state.userInfos
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // Get recording scenarios
        getScenarios: async({ commit, state }) => {
            try {
                const getScenarios = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
                    method: 'get'
                })
                commit('SET_SCENARIOS', getScenarios.data.scenarios)
                return state.scenarios
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // Get audio files
        getAudios: async({ commit, state }) => {
            try {
                const getAudios = await axios(`${process.env.VUE_APP_URL}/api/audios`, {
                    method: 'get'
                })
                const audios = getAudios.data.audios
                commit('SET_AUDIOS', audios)
                return state.audios
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // Sort audio list by key
        sortAudios: async({ commit, state }, param) => {
            try {
                commit('SORT_AUDIOS', param)
                return state.audios
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        getVoteLimit: async({ commit, state }) => {
            try {
                const voteLimit = await axios(`${process.env.VUE_APP_URL}/api/audios/vote/limit`, {
                    method: 'get'
                })
                if (!!voteLimit.data.value) {
                    commit('SET_VOTE_LIMIT', voteLimit.data.value)
                }
                return state.voteLimit
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        getvalidAudios: async({ commit, state }) => {
            try {
                const getvalidAudios = await axios(`${process.env.VUE_APP_URL}/api/audios/validaudios`, {
                    method: 'get'
                })
                commit('SET_NB_VALID_AUDIOS', getvalidAudios.data)
                return state.validAudios
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        }
    },
    getters: {
        ENABLED_SCENARIOS: (state) => {
            let scenarios = state.scenarios
            let enabledScenarios = []
            scenarios.map(s => {
                if (s.status === 'enabled') {
                    enabledScenarios.push(s)
                }
            })
            return enabledScenarios
        },
        // Get audios that can be validate by an user
        // (audios that the user didn't record or has already voted for)
        AUDIO_BY_USER: (state) => (userHash) => {
            try {
                let audios = state.audios
                let scenarios = state.scenarios
                let enabledWakeword = []

                scenarios.map(s => {
                    if (s.status === 'enabled') {
                        enabledWakeword.push(s.wakeword)
                    }
                })
                let validAudios = []
                audios.map(a => {
                    if (enabledWakeword.indexOf(a.wakeword) >= 0) {

                        if (a.author !== userHash && a.userVoted.indexOf(userHash) < 0 && a.mimetype === 'audio/wav' && a.status === 'vote') {
                            console.log(a.author, ' vs ', userHash)
                            console.log(a)
                            validAudios.push(a)
                        }
                    }
                })
                return validAudios
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // Get total number of "listened" and "recorded" audios
        APP_STATS: (state) => {
            try {
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
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // Get the ratio between male and female
        GENDER_RATIO: (state) => {
            try {
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
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        // get the ratio of used devices
        DEVICES_RATIO: (state) => {
            try {
                let audios = state.audios
                let defaultDevice = 0
                let headphone = 0
                let external = 0
                let smartphone = 0

                audios.map(a => {
                    if (a.deviceType === 'default') {
                        defaultDevice += 1
                    } else if (a.deviceType === 'casque') {
                        headphone += 1
                    } else if (a.deviceType === 'pied') {
                        external += 1
                    } else if (a.deviceType === 'smartphone') {
                        smartphone += 1
                    }
                })
                const total = parseInt(defaultDevice) + parseInt(headphone) + parseInt(external)
                const prctDefault = defaultDevice * 100 / total
                const prctHeadphone = headphone * 100 / total
                const prctExternal = external * 100 / total
                const prctSmartphone = smartphone * 100 / total
                return {
                    prctDefault,
                    prctExternal,
                    prctHeadphone,
                    prctSmartphone
                }
            } catch (err) {
                console.error(err)
                return { error: err }
            }
        },
        RECORD_BY_DAY: (state) => {
            try {
                let audios = state.audios
                let datas = []
                audios.map(a => {
                    let date = a.recordDate.split('T')[0]
                    let dateSet = false
                    datas.map(d => {
                        if (d.x === date) {
                            dateSet = true
                            d.y += 1
                        }
                    })
                    if (!dateSet) {
                        datas.push({
                            x: date,
                            y: 1
                        })
                    }
                })
                return datas
            } catch (error) {
                console.error(error)
                return { error }
            }
        }
    }
})