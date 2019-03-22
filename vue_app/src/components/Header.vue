<template>
  <div class="header-container container-fluid">
    <div class="row">
      <div class="col logo-container">
        <a href="/"><img id="wakemeup-logo" src="/assets/img/wakemeup-logo.svg" alt="Wake Me Up" /></a>
        <img id="linagora-labs-logo" src="/assets/img/linagora-labs.png" alt="Linagora Labs" />
      </div>
      <div class="col user-panel">
        <button v-if="!userConnected" class="button red" @click="toggleConnectionModal()">Se connecter/S'inscrire</button>
        <div v-if="userConnected" class="user-menu">
          <button class="toggle-user-menu" @click="toggleUserMenu" :class="[showUserMenu ? 'opened' : 'closed']"> 
            <span class="label">{{ userInfos.email }}</span>
            <span class="icon"></span>
          </button>
          <div class="user-submenu" :class="[showUserMenu ? 'visible' : 'hidden']">
            <a href="/interface/account" class="user-submenu-link">
              <span class="icon user"></span>
              <span class="label user">Mon compte</span>
            </a>
            <a href="/logout" class="user-submenu-link logout">
              <span class="icon logout"></span>
              <span class="label logout">Déconnexion</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
import axios from 'axios'
export default {
  data () {
    return {
      userConnected: false,
      showUserMenu: false
    }
  },
  created () {
    const userCookie = this.getCookie('wmu_user')
    if (userCookie !== 'disconnected') {
      this.$store.dispatch('getUserInfos', userCookie).then((resp) => {
        if (resp) {
          this.userConnected = true
        }
      }, error => {
        console.error('error:', err)
      })
    }
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    }
  },
  methods: {
    toggleConnectionModal () {
      bus.$emit('toggle_connection_modal', {})
    },
    toggleUserMenu () {
      this.showUserMenu = !this.showUserMenu
    },
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
  }
}
</script>
