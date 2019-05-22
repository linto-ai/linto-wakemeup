import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Listen from './views/Listen.vue'
import MentionsLegales from './views/MentionsLegales.vue'
import AudioMonitoring from './views/AudioMonitoring.vue'
import Monitoring from './views/Monitoring.vue'
import Record from './views/Record.vue'
import ReinitPswd from './views/ReinitPswd.vue'
import ReinitPswdForm from './views/ReinitPswdForm.vue'
import Scenarios from './views/Scenarios.vue'
import UserPanel from './views/UserPanel.vue'
import Contact from './views/Contact.vue'

Vue.use(Router)

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
    path: '/reinit-password',
    name: 'Réinitialisation du mot de passe',
    component: ReinitPswd
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/reinit-password/:user/:token',
    name: 'Formulaire de réinitialisation du mot de passe',
    component: ReinitPswdForm
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
  }]
})
