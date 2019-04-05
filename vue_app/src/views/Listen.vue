<template>
  <div class="h-100">
    <div id="page-content" class="locked">
      <div class="container-fluid h-100 talk green" id="player-container" >
        <div class="row h-100">
          <div class="player-content" :class="[showInfos ? 'col-4 h-100' : 'hidden']">
            <button @click="toggleInfos()" class="closeInfos toggle-infos"></button>
            <h2 class="green">Écoutez et validez des enregistrements</h2>
            <div class="content green">
              <p>Bienvenue dans l'interface de validation des wakewords.</p>
              
              <p><strong>Écoutez</strong> les enregistrements réalisés par les utilsateurs.</p>
              <p> Pour qu'un son soit valide, il doit répondre à certains critères :
                <ul>
                  <li>Le wakewords doit être <strong>clairement audible</strong></li>
                  <li>La commande prononcée doit être <strong>conforme avec la commande écrites au-dessus du player</strong></li>
                  <li>Il ne doit <strong>pas</strong> y avoir de <strong>sons parasites</strong> pendant la prononciation du wakeword</li>
              </p>

              <div class="notice"><h3>Validation d'échantillons audio</h3>
                <ul>
                  <li>Le wakeword attendu est écris en rouge au-dessus du player audio</li>
                  <li>Cliquez sur le bouton "<strong>Écouter</strong>" afin de jouer le son. </li>
                  <li>Après avoir écouté le son, des boutons vous permettant de voter apparaitrons</li>
                  <li>Cliquez sur le bouton "<strong>Valide</strong>" si vous estimez que l'échantillon est valide</li>
                  <li>Cliquez sur le bouton "<strong>Non valide</strong>" si vous estimez que l'échantillon n'est pas valide</li>
                </ul>
              </div>
            </div>
          </div>
          <div :class="[showInfos ? 'col-8 h-100' : 'col-12 h-100']">
            <button @click="toggleInfos()" :class="[!showInfos ? 'visible' : 'hidden']" class="showInfos toggle-infos" ></button>
            <div id="player-wrapper" v-if="audiosReady && !noMoreAudio">
              <div class="say-word">
                <h3>"<span class="word">{{ wakeword }}</span>"</h3>
              </div>
              <div> 
                <div class="btn-container">
                  <div class="player-anim">
                    <span class="sound-bar bsmall" :class="[isRecording ? 'animate' : '']"></span>
                    <span class="sound-bar bmed" :class="[isRecording ? 'animate' : '']"></span>
                    <span class="sound-bar bbig" :class="[isRecording ? 'animate' : '']"></span>
                  </div>
                  <button @click="playAudio()" class="button-play" id="start" :class="isPlaying"></button>
                  
                  <div class="player-anim">
                    <span class="sound-bar bbig" :class="[isRecording ? 'animate' : '']"></span>
                    <span class="sound-bar bmed" :class="[isRecording ? 'animate' : '']"></span>
                    <span class="sound-bar bsmall" :class="[isRecording ? 'animate' : '']"></span>
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
                </div>
              </div>
            </div>
            <div v-if="!audiosReady && !noMoreAudio" class="loading">
              <img src="/assets/img/loading.gif" class="loading-img" />
              <span class="label">Chargement...</span>
            </div>
            <div v-if="!audiosReady && noMoreAudio" class="record-complete white-container">
                Vous n'avez pas de "wake-word" à valider.<br/>
                <a href="/">Retour à l'accueil</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      showInfos: true,
      audiosReady: false,
      wakeword: '',
      audioFile: '',
      userHash: '',
      isPlaying: '',
      playerAudio: null,
      audioHasBeenListen: false,
      noMoreAudio: false,
      userHash: '',
      userAudios: ''
    }
  }, 
  created () {
    this.$store.dispatch('getAudios').then((resp) => {}, error => {
      console.error('error:', err)
    })
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    },
    audios () {
      return this.$store.state.audios
    }
  },
  watch: {
    userInfos: function (data) {
      this.userHash = this.$store.state.userInfos.userHash
    },
    userHash: function (data) {
      if(!!this.audios) {
        this.userAudios = this.$store.getters.AUDIO_BY_USER(data)
      }
    },
    audios: function (data) {
      if(!!this.userHash) {
        this.userAudios = this.$store.getters.AUDIO_BY_USER(this.userHash)
      }
    },
    userAudios: function (data) {
      if(data.length > 0) {
        this.noMoreAudio = false
        this.wakeword = data[0].wakeword
        this.audioFile = '/assets/audios/' + data[0].fieldname
        this.audiosReady = true
        this.playerAudio = new Audio(this.audioFile)
      } else {
        this.audiosReady = false
        this.noMoreAudio = true
      }
    }
  },
  methods: {
    toggleInfos() {
      this.showInfos = !this.showInfos
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
      const payload = {
        audioId: this.userAudios[0]._id,
        vote: vote, 
        userHash: this.userInfos.userHash,
        wakeword: this.wakeword
      }
      const sendVote = await axios(`${process.env.VUE_APP_URL}/api/audios/vote`, {
        method: 'post',
        data: payload
      })

      if(sendVote.data.voteAudio === 'success'){
        bus.$emit('notify_app', {
          status: 'success',
          msg: 'Vote pris en compte.',
          redirect: '/interface/listen'
        })
      } else {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Erreur lors de l\'enregistrement',
          redirect: false
        })
      }
    }
  }
}
</script>
