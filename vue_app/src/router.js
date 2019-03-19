import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Interface from './views/Interface.vue'
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
      path: '/interface/overview',
      name: 'Interface',
      component: Interface
    },
    {
      path: '/interface/account',
      name: 'Compte utilisateur',
      component: UserPanel
    }
  ]
});