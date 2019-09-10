<template>
  <div id="app">
     <div id="header">
      <HeaderApp :userConnected="userConnected"></HeaderApp>
      <AppNotify></AppNotify>
    </div>
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <ConnectionModal></ConnectionModal>
    <CreateAccountModal></CreateAccountModal>
    <PolicyAgreementModal></PolicyAgreementModal>
    <FooterApp></FooterApp>
    <cookieLegalNotify></cookieLegalNotify>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderApp from '@/components/Header.vue'
import AppNotify from '@/components/AppNotify.vue'
import FooterApp from '@/components/Footer.vue'
import cookieLegalNotify from '@/components/CookieLegalNotify.vue'
import ConnectionModal from '@/components/ConnectionModal.vue'
import CreateAccountModal from '@/components/CreateAccountModal.vue'
import PolicyAgreementModal from '@/components/PolicyAgreementModal.vue'
import { bus } from './main.js'
export default {
  data () {
    return {
      userConnected: {
        status: false,
        user: null,
        email: null,
        userNmae: null
      }
    }
  },
  async created () {
    const checkSession = await axios({
      url: `${process.env.VUE_APP_URL}/api/user/session`,
      method: 'get'
    })
    this.$session.start()
    // If user is connected
    if (checkSession.data.response.connected === true) {
      this.$session.set('cnxusr', checkSession.data.response.user)
      this.$session.set('cnxusrname', checkSession.data.response.userName)
      this.$session.set('cnxstatus', 'logged_on')
      this.$session.set('cnxusrmail', checkSession.data.response.email)
      this.userConnected = {
        status: true,
        user: checkSession.data.response.user,
        email: checkSession.data.response.email,
        userName: checkSession.data.response.userName
      }
    } else { // If user not conected
      this.userConnected = {
        status: false,
        user: null,
        email: null,
        userName: null
      }
      this.$session.destroy()
    }
  },
  mounted () {
    const cookieLegal = this.getCookie('wmu_legals')
    if (cookieLegal !== 'on') {
      bus.$emit('showCookieLegasls', {})
    }
  },
  methods: {
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  },
  components: {
    HeaderApp,
    AppNotify,
    FooterApp,
    cookieLegalNotify,
    ConnectionModal,
    CreateAccountModal,
    PolicyAgreementModal
  }
}
</script>
