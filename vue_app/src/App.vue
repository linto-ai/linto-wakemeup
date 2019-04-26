<template>
  <div id="app">
     <div id="header">
      <HeaderApp></HeaderApp>
      <AppNotify></AppNotify>
    </div>
    <transition>
      <keep-alive>
        <router-view></router-view>
        
      </keep-alive>
    </transition>
    <FooterApp></FooterApp>
    <cookieLegalNotify></cookieLegalNotify>
  </div>
</template>
<script>
import HeaderApp from '@/components/Header.vue'
import AppNotify from '@/components/AppNotify.vue'
import FooterApp from '@/components/Footer.vue'
import cookieLegalNotify from '@/components/CookieLegalNotify.vue'
import { bus } from './main.js'
export default {
  data() {
    return {};
  },
  mounted () {
    const cookieLegal = this.getCookie('wmu_legals')
    if(cookieLegal !== 'on') {
      bus.$emit('showCookieLegasls', {})
    }
  },
  methods: {
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
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
    cookieLegalNotify
  }
};
</script>
