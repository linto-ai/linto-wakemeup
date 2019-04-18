<template>
  <div class="h-100">
    <div id="page-content">
      <div id="home">
        <div id="highlight" class="container-fluid">
          <div class="row">
            <div class="col talk">
              <h2>Enregistrez votre voix</h2>
              <div class="title-icon">
                <img src="/assets/img/talk.svg" alt="Parler">
              </div>
              <div
                class="highlight-content"
              >Participez à l'enregistrement de campagnes de mots-clés. Enregistrez votre voix et créez des échantillons audio qui nous permettront d'enrichir et d'entraîner notre modèle de données.</div>
              <div class="highlight-action">
                <button data-url="/interface/record" @click="navigate($event)" class="button red">Enregistrez votre voix</button>
              </div>
            </div>
            <div class="col listen">
              <h2>Écoutez et participez à la validation</h2>
              <div class="title-icon">
                <img src="/assets/img/listen.svg" alt="Ecouter">
              </div>
              <div
                class="highlight-content"
              >Aidez-nous à confirmer la validité des échantillons audios créés par les utilisateurs. Ecoutez ces échantillons et donnez-nous votre avis en nous indiquant si les wakewords prononcés sont audibles et conformes aux consignes.</div>
              <div class="highlight-action">
                <button data-url="/interface/listen" @click="navigate($event)" class="button green">Écouter des enregistrements</button>
              </div>
            </div>
          </div>
        </div>
        <div class="divider red shadowTop"></div>
      </div>
    </div>
    <ConnectionModal></ConnectionModal>
    <CreateAccountModal></CreateAccountModal>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'
import ConnectionModal from '@/components/ConnectionModal.vue'
import CreateAccountModal from '@/components/CreateAccountModal.vue'
import { bus } from '../main.js'
export default {
  data () {
    return {
      showConnectModal: false,
      userConnected: false
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
    navigate (e) {
      if(!this.userConnected){
        bus.$emit('toggle_connection_modal', {})
      } else {
        const url = e.target.getAttribute('data-url')
        window.location.href = url
      }
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
  },
  components: {
    Header,
    ConnectionModal,
    CreateAccountModal
  }
}
</script>
