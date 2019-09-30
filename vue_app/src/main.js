import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import VueSession from 'vue-session'
import axios from 'axios'

export const bus = new Vue()

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueSession, { persist: true })

Vue.filter('formatAudioUrl', (dbPath) => {
  let splitPath = dbPath.split('uploads/')
  return '/assets/audios/' + splitPath[1]
})
Vue.filter('isEmail', (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return (regex.test(email))
})
Vue.filter('isRequired', (obj) => {
  if (obj.value.length === 0 || obj.value === '') {
    return false
  }
  return true
})

Vue.filter('validateAgeRange', (obj) => {
  let resp = {
    value: obj.value,
    error: null,
    valid: false
  }
  if (obj.value.length === 0 || obj.value === '') {
    resp.error = 'Ce champs est requis'
  } else {
    resp.valid = true
  }
  return resp
})

Vue.filter('validateRequired', (obj) => {
  let resp = {
    value: obj.value,
    error: null,
    valid: false
  }
  if (obj.value.length === 0 || obj.value === '') {
    resp.error = 'Ce champs est requis'
  } else {
    resp.valid = true
  }
  return resp
})

Vue.filter('emailExist', async (email) => {
  let emailExist = await axios(`${process.env.VUE_APP_URL}/api/user/userEmailExist`, {
    method: 'post',
    data: { email }
  })
  return emailExist
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
