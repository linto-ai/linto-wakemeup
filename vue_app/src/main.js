import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import VueSession from 'vue-session'

export const bus = new Vue()

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueSession, { persist: true })

Vue.filter('formatAudioUrl', (dbPath) => {
  let splitPath = dbPath.split('uploads/')
  return '/assets/audios/' + splitPath[1]
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
