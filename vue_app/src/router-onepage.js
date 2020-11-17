import Vue from 'vue'
import Router from 'vue-router'
import HomeOnePage from './views/HomeOnePage.vue'
import MentionsLegales from './views/MentionsLegales.vue'
import PolicyAgreement from './views/PolicyAgreement.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: HomeOnePage
        },
        {
            path: '/mentions-legales',
            name: 'Mentions Légales',
            component: MentionsLegales
        },
        {
            path: '/cgu',
            name: 'Conditions générales d\'utilisation',
            component: PolicyAgreement
        }
    ]
})