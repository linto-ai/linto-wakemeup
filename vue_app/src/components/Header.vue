<template>
  <div class="header-container container-fluid">
    <div class="row">
      <div class="col-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 logo-container">
        <a href="/"><img id="wakemeup-logo" src="/assets/img/wakemeup-logo.svg" alt="Wake Me Up" /></a>
        <a href="https://research.linagora.com" target="_blank"><img id="linagora-labs-logo" src="/assets/img/linagora-labs.png" alt="Linagora Labs" /></a>
      </div>
      <div class="col-4 d-none d-sm-none d-md-block d-lg-block d-xl-block links text-center">
        <button data-url='/interface/record' @click.prevent="navigate($event)" class="header-link red">S'enregistrer</button>
        <span class="text-separator"> | </span>
        <button data-url='/interface/listen' @click.prevent="navigate($event)" class="header-link green">Écouter</button>
      </div>
      <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 user-panel">
        <button v-if="!userConnected.status" class="button red" @click="toggleConnectionModal()">Connexion</button>

        <div v-if="userConnected.status" class="user-menu">
          <div class="user-metrics" style="display: inline-block;">
          <span class="icon record"></span><span class="metrics record">{{ userInfos.nbRecord }}</span> <span class="icon listen"></span><span class="metrics listen">{{ userInfos.nbListen }}</span>
          </div>
          <button class="toggle-user-menu" @click="toggleUserMenu" :class="[showUserMenu ? 'opened' : 'closed']">
            <span class="label">{{ userConnected.userName }}</span>
            <span class="icon"></span>
          </button>
          <div class="user-submenu" :class="[showUserMenu ? 'visible' : 'hidden']">
            <a href="/interface/account" class="user-submenu-link">
              <span class="icon user"></span>
              <span class="label user">Mon compte</span>
            </a>
            <div class="mobile-links d-block d-sm-block d-md-none">
              <a href="/interface/record" class="user-submenu-link">
                <span class="icon record"></span>
                <span class="label record">S'enregistrer</span>
              </a>
              <a href="/interface/listen" class="user-submenu-link">
                <span class="icon listen"></span>
                <span class="label listen">Écouter</span>
              </a>
            </div>
             <a href="/admin/scenarios" class="user-submenu-link" v-if="isAdmin">
              <span class="icon wakewords"></span>
              <span class="label wakewords">Scénarios</span>
            </a>
            <a href="/admin/monitoring" class="user-submenu-link" v-if="isAdmin">
              <span class="icon monitoring"></span>
              <span class="label monitoring">Monitoring</span>
            </a>
            <a href="/admin/audio-monitoring" class="user-submenu-link" v-if="isAdmin">
              <span class="icon audio-monitoring"></span>
              <span class="label audio-monitoring">Audio monitoring</span>
            </a>
            <button @click="logout()" class="user-submenu-link logout">
              <span class="icon logout"></span>
              <span class="label logout">Déconnexion</span>
            </button>
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
  props: ['userConnected'],
  data () {
    return {
      showUserMenu: false,
      isAdmin: false
    }
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    }
  },
  watch: {
    userConnected: function (data) {
      if (data.status === true) {
        this.$store.dispatch('getUserInfos', data.user)
      }
    },
    userInfos: function (data) {
      if(data.role === 'administrator'){
        this.isAdmin = true
      }
    }
  },
  methods: {
    toggleConnectionModal () {
      bus.$emit('toggle_connection_modal', {})
    },
    toggleUserMenu () {
      this.showUserMenu = !this.showUserMenu
    },
    navigate (e) {
      if(!this.userConnected.status){
        this.toggleConnectionModal()
      } else {
        const url = e.target.getAttribute('data-url')
        window.location.href = url
      }
    },
    logout () {
      this.$session.destroy()
      window.location.href = '/logout'
    }
  }
}
</script>

