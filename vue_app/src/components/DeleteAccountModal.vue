<template>
  <div>
    <div class="modal" :class="[ showModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title red">Se connecter</h3>
          <button @click="closeModal" class="close-modal"></button>
        </div>
        <div class="modal-body">
          Êtes-vous sûr de vouoir supprimer votre compte ? Tous vos enregistrements audios seront supprimés de notre base de données et ne seront pas utilisés dans les futurs campagnes de mots-clés. <br/>
          <strong class="red">Cette action est irréversible</strong>.
        </div>
        <div class="modal-footer">
          <button class="button grey" @click="closeModal()">Annuler</button>
          <button class="button red" @click="deleteAccount()">Supprimer mon compte</button>
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
      showModal: false,
      userHash: ''
    }
  },
  mounted () {
    bus.$on('toggle_deleteAccount_modal', (data) => {
      this.toggleModal()
      this.userHash = data.userHash
    })
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },
    closeModal () {
      this.showModal = false
    },
    async deleteAccount () {
      const deleteUser = await axios(`${process.env.VUE_APP_URL}/api/user`, {
        method: 'delete',
        data: { userHash: this.userHash }
      })
      this.showModal = false
      if (deleteUser.data.status === 'success') {
        // If user has been deleted > redirect logout
        bus.$emit('notify_app', {
          status: 'success',
          msg: 'Votre compte a été supprimé avec succès.',
          redirect: '/logout'
        })
      } else {
        // If an error has occured on deleting user
        bus.$emit('notify_app', {
          status: 'error',
          msg: deleteUser.msg,
          redirect: false
        })
      }
    }
  }
}
</script>
