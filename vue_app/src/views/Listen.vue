<template>
  <div id="page-content" class="locked">
    <div class="container-fluid h-100 talk green" id="player-container">
      <div class="row h-100">
        <div class="player-content" :class="[showInfos ? 'col-4 h-100' : 'hidden', mobileView ? 'mobile': '']">
          <button @click="toggleInfos()" class="closeInfos toggle-infos"></button>
          <h2 class="green">Écoutez et validez des enregistrements</h2>
          <div class="content green">
            <p>Bienvenue dans l'interface de validation des mots-clés.</p>

            <p><strong>Écoutez</strong> les enregistrements réalisés par les utilisateurs.</p>
            <p> Pour qu'un son soit valide, il doit répondre à certains critères :
              <ul>
                <li>Le mot-clé doit être <strong>clairement audible</strong></li>
                <li>La commande prononcée doit être <strong>conforme à la commande écrite au-dessus du player</strong></li>
                <li>Il ne doit <strong>pas</strong> y avoir de <strong>sons parasites</strong> pendant la prononciation du mot-clé</li>
              </ul>
            </p>
            <div class="notice">
              <h3>Validation d'échantillons audio</h3>
              <ul>
                <li>Le mot-clé attendu est écris en rouge au-dessus du player audio</li>
                <li>Cliquez sur le bouton "<strong>Écouter</strong>" afin de jouer le son. </li>
                <li>Après avoir écouté le son, des boutons vous permettant de voter apparaitront</li>
                <li>Cliquez sur le bouton "<strong>Valide</strong>" si vous estimez que l'échantillon est valide</li>
                <li>Cliquez sur le bouton "<strong>Non valide</strong>" si vous estimez que l'échantillon n'est pas valide</li>
              </ul>
            </div>
          </div>
        </div>
        <div :class="[showInfos ? 'col-8 h-100' : 'col-12 h-100']">
          <button @click="toggleInfos()" :class="[!showInfos ? 'visible' : 'hidden']" class="showInfos toggle-infos"></button>
          <div id="player-wrapper" v-if="audiosReady && !noMoreAudio">
            <div class="say-word">
              <h3>"<span class="word">{{ wakeword }}</span>"</h3>
            </div>
            <div>
              <div class="btn-container">
                <div class="player-anim">
                  <span class="sound-bar bsmall"></span>
                  <span class="sound-bar bmed"></span>
                  <span class="sound-bar bbig"></span>
                </div>
                <button @click="playAudio()" class="button-play" id="start" :class="isPlaying"></button>

                <div class="player-anim">
                  <span class="sound-bar bbig"></span>
                  <span class="sound-bar bmed"></span>
                  <span class="sound-bar bsmall"></span>
                </div>
                <span class="label">Écouter</span>
              </div>
              <div class="sub-actions-container" v-if="audioHasBeenListen && !isPlaying">
                <div class="action-container">
                  <button @click="sendVote('good')" class="btn-player votegood"></button>
                  <span class="label green">Valide</span>
                </div>
                <div class="action-container">
                  <button @click="sendVote('bad')" class="btn-player votebad"></button>
                  <span class="label red">Non valide</span>
                </div>
                <div class="action-container">
                  <a href="/interface/listen" class="btn-player skip"></a>
                  <span class="label red">Passer</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!audiosReady && !noMoreAudio" class="loading">
            <img src="/assets/img/loading.gif" class="loading-img" />
            <span class="label">Chargement...</span>
          </div>
          <div v-if="noMoreAudio" class="record-complete white-container">
            Vous n'avez pas de mot-clé à valider.<br/>
            <a href="/">Retour à l'accueil</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      showInfos: true,
      audiosReady: false,
      audiosLoaded: false,
      wakeword: '',
      audioFile: '',
      userHash: null,
      userHashLoaded: false,
      isPlaying: '',
      playerAudio: null,
      audioHasBeenListen: false,
      noMoreAudio: false,
      userAudios: '',
      screenWidth: 0,
      mobileView: false,
      scenariosLoaded: false
    }
  },
  created () {
    this.$store.dispatch('getAudios').then((resp) => {
      // Error handler
      if (!!resp.error) {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
          redirect: false
        })
      }
    })
    this.$store.dispatch('getScenarios').then((resp) => {
      // Error handler
      if (!!resp.error) {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
          redirect: false
        })
      }
    })
  },
  mounted () {
    if (this.getCookie('wmu_listeninfos') !== 'undefined') {
      if (this.getCookie('wmu_listeninfos') === 'false') {
        this.showInfos = false
      } else if (this.getCookie('wmu_listeninfos') === 'true') {
        this.showInfos = true
      }
    }
    this.screenWidth = this.getScreenWidth()
    if (this.screenWidth <= 1280) {
      this.showInfos = false
    }
    window.addEventListener('resize', () => {
      this.screenWidth = this.getScreenWidth()
    })
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    },
    audios () {
      return this.$store.state.audios
    },
    scenarios () {
      return this.$store.state.scenarios
    },
    audioDatasLoaded () {
      return (this.audiosLoaded && this.scenariosLoaded && this.userHashLoaded)
    }
  },
  watch: {
    audioDatasLoaded (data) {
      if (data) {
        this.userAudios = this.$store.getters.AUDIO_BY_USER(this.userHash).sort(() => { return 0.5 - Math.random() })
      }
    },
    screenWidth: function (data) {
      if (data <= 1280) {
        this.mobileView = true
      } else {
        this.mobileView = false
      }
    },
    scenarios (data) {
      if (!!data.length && data.length > 0) {
        this.scenariosLoaded = true
      }
    },
    userInfos: function (data) {
      this.userHash = this.$store.state.userInfos.userHash
    },
    userHash: function (data) {
      if (data !== null) {
        this.userHashLoaded = true
      }
    },
    userAudios: function (data) {
      if (data.length > 0) {
        this.noMoreAudio = false
        this.wakeword = data[0].wakeword
        this.audioFile = '/assets/audios/' + data[0].fieldname
        this.audiosReady = true
        this.playerAudio = new Audio(this.audioFile)
      } else {
        this.audiosReady = false
        this.noMoreAudio = true
      }
    },
    audios: function (data) {
      if (!!data.length) {
        this.audiosLoaded = true
        if (data.length === 0) {
          this.noMoreAudio = true
        }
      }
    }
  },
  methods: {
    getScreenWidth () {
      return window.innerWidth
    },
    toggleInfos () {
      this.showInfos = !this.showInfos
      this.setCookie('wmu_listeninfos', this.showInfos, 31)
    },
    playAudio () {
      this.isPlaying = 'active'
      this.playerAudio.play()
      this.playerAudio.addEventListener('ended', () => {
        this.isPlaying = ''
        this.audioHasBeenListen = true
      })
    },
    async sendVote (vote) {
      const payload = {
        audioId: this.userAudios[0]._id,
        vote: vote,
        userHash: this.userInfos.userHash,
        wakeword: this.wakeword
      }
      const sendVote = await axios(`${process.env.VUE_APP_URL}/api/audios/vote`, {
        method: 'post',
        data: payload
      })
      if (sendVote.data.voteAudio === 'success') {
        bus.$emit('notify_app', {
          status: 'success',
          msg: 'Votre vote à bien été pris en compte.',
          redirect: '/interface/listen'
        })
      } else {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Erreur lors de l\'enregistrement',
          redirect: false
        })
      }
    },
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
    },
    setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60))
      const expires = 'expires=' + d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    }
  }
}
</script>
