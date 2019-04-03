<template>
  <div id="cookie-notify" :class="[cookieLegalShow ? 'active' : 'hidden']">
    <div class=" container-fluid">
      <div class="row justify-content-around">
        <div class="cookie-content col-11">
          En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de traceurs (cookies) afin d'améliorer votre expérience utilisateur et valider votre authentification. Les traceurs sont mis en place de manière anonyme et ne seront jamais utilisés à des fin commericales ou publicitaires.
        </div>
        <div class="col-1">
          <button @click="closeModal" class="closeCookieModal">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      cookieLegalShow: false
    }
  },
  mounted () {
    bus.$on('showCookieLegasls', () => { 
      this.cookieLegalShow = true
    })
  },
  methods: {
    closeModal () {
      this.cookieLegalShow = false
      this.setCookie('wmu_legals', 'on', 310)
    },
    setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60))
      const expires = 'expires='+d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    }
  }
}
</script>

