<template>
  <div id="page-content" >
    <div class="container-fluid h-100 talk green" id="player-container" >
      <div class="row h-100">
        <div class="col-3 h-100 player-content">
          <h2 class="green">Écoutez et validez des enregistrement</h2>
          <span class="content">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          </span>
        </div>
        <div class="col-9 h-100">
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
                  <span class="label red">Invalide</span>
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
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      audiosReady: false,
      wakeword: '',
      audioFile: '',
      userHash: '',
      isPlaying: '',
      playerAudio: null,
      audioHasBeenListen: false,
      noMoreAudio: false
    }
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
      this.getAudios(data.userHash)
    },
    audios: function (data) {
      if(data.length > 0){
        this.noMoreAudio = false
        this.wakeword = data[0].wakeword
        this.audioFile = '/assets/audios/' + data[0].fieldname
        this.audiosReady = true
        this.playerAudio = new Audio(this.audioFile)
      }
      else {
        this.noMoreAudio = true
      }
    }
  },
  methods: {
    getAudios (userHash) {
      this.$store.dispatch('getAudios', userHash ).then((resp) => {}, error => {
        console.error('error:', err)
      })
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
        audioId: this.audios[0]._id,
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
