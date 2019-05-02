<template>
  <div>
    <div class="modal" :class="[showDeleteAudioModal ? 'visible' : 'hidden']" v-if="audioFile">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title red">Supprimer un fichier audio</h3>
          <button @click="closeModal" class="close-modal"></button>
        </div>
        <div class="modal-body">
          <span >Êtes-vous sûr de vouloir supprimer ce fichier: "<strong>{{ audioFile.fieldname }}</strong>" ?</span><br/>
          <span class="warning">Attention: cette action est irréversible.</span>
        </div>
        <div class="modal-footer">
          <button class="button cancel" @click="closeModal()">Cancel</button>
          <button class="button red" @click="deleteAudio(audioFile._id, audioFile.fieldname)">Supprimer</button>
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
      showDeleteAudioModal: false,
      audioFile: null
    }
  },
  mounted () {
    bus.$on('toggle_delete_audio', (audio) => {
      this.showDeleteAudioModal = true
      this.audioFile = audio
    })
  },
  methods: {
    closeModal () {
      this.showDeleteAudioModal = false
    },
    async deleteAudio (audioId, fieldname) {
      const deleteAudio = await axios(`${process.env.VUE_APP_URL}/api/audios/delete`, {
        method: 'delete',
        data: { audioId, fieldname }
      })
      bus.$emit('notify_app', {
        status: deleteAudio.data.status,
        msg: deleteAudio.data.msg,
        redirect: false
      })
      this.showDeleteAudioModal = false
      if(deleteAudio.data.status === 'success') {
        this.$store.dispatch('getAudios')
      }
    }
  }
}
</script>
