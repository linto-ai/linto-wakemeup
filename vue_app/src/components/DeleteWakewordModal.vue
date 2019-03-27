<template>
  <div>
    <div class="modal" :class="[showModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title red">Supprimer un wakeword</h3>
          <button @click="closeModal" class="close-modal"></button>
        </div>
        <div class="modal-body">
          <p class="content">Êtes-vous sûr de vouloir supprimer le wakeword "<strong>{{ wakeword }}</strong>" des scénarios d'enregistrement ?</p>

          <div class="modal-footer">
            <button class="button grey" @click="closeModal()">Annuler</button>
            <button class="button red" @click="deleteWakeword(wakeword)">Supprimer</button>
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
      showModal: false,
      wakeword: ''
    }
  },
  methods: {
    closeModal () {
      this.showModal = false
    },
    async deleteWakeword (data) {
      const deleteww = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
        method: 'delete',
        data: {wakeword: data}
      })
      if(deleteww.data.deleteWakeword === 'success') {
        bus.$emit('wakeword_deleted', {})
        bus.$emit('notify_app', {
          status: 'success',
          msg: 'Wakeword supprimé avec succès.',
          redirect: false
        })
    } else {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Erreur lors de la suppression du wakeword',
          redirect: false
        })
      }
      this.showModal = false
    }
  },
  mounted () {
    bus.$on('show_deleteWakeWord_modal', (data) => {
      this.showModal = true
      this.wakeword = data.wakeword
    })
  }
}
</script>
