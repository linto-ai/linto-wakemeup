import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Listen from './views/Listen.vue'
import MentionsLegales from  './views/MentionsLegales.vue'
import AudioMonitoring from './views/AudioMonitoring.vue'
import Monitoring from './views/Monitoring.vue'
import Record from './views/Record.vue'
import Scenarios from './views/Scenarios.vue'
import UserPanel from './views/UserPanel.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/interface/account',
      name: 'Compte utilisateur',
      component: UserPanel
    },
    {
      path: '/interface/record',
      name: 'Record',
      component: Record
    },
    {
      path: '/interface/listen',
      name: 'Listen',
      component: Listen
    },
    {
      path: '/admin/scenarios',
      name: 'Ajouter des scenarios',
      component: Scenarios
    },
    {
      path: '/admin/monitoring',
      name: 'Monitoring',
      component: Monitoring
    },
    {
      path: '/admin/audio-monitoring',
      name: 'Audio monitoring',
      component: AudioMonitoring
    },
    {
      path: '/mentions-legales',
      name: 'Mentions Légales',
      component: MentionsLegales
    }
  ]
})