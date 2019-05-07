<template>
  <div>
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Adresse email:</span>
      </div>
      <input type="text" v-model="userEmail" class="input" :class="[userEmailValid ? userEmailValid : '']" v-on:keyup.13="checkForm()"/>
      <span
        class="error-field"
        :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userEmailErrorMsg }}</span>
    </div>
    <div class="field-container btn">
      <button class="button green large" @click="checkForm()">{{ sendButtonLabel }}</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      userEmail: '',
      userEmailErrorMsg: '',
      userEmailValid: false,
      sendButtonLabel: 'Envoyer un lien de réinitialisation',
      mailSend: false
    }
  },
  methods: {
    async checkForm () {
      const isValid = this.validateEmail(this.userEmail)
      if (isValid) {
        this.userEmailErrorMsg = ''
        this.userEmailValid = 'valid'
        this.sendButtonLabel = 'Envoi en cours...'
        await this.sendMail(this.userEmail)
      } else {
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email valide'
        this.userEmailValid = 'error'
      }
    },
    async sendMail (email) {
      // Verify that the email is associated to a user
      const userEmailExist = await axios(`${process.env.VUE_APP_URL}/api/user/userEmailExist`, {
        method: 'post',
        data: { email }
      })
      if (userEmailExist.data.status === 'success') {
        this.sendButtonLabel = 'Envoi en cours, veuillez patienter...'
        // Generate reinitToken and send mail to user
        const setReinit = await axios(`${process.env.VUE_APP_URL}/api/user/setReinit`, {
          method: 'post',
          data: { email }
        })
        if (setReinit.data.status === 'success') {
          this.sendButtonLabel = 'Succès'
          this.mailSend = true
          bus.$emit('mail_send', {})
        } else {
          this.sendButtonLabel = 'Envoyer un lien de réinitialisation'
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue. Veuilez rééssayer ultérieurement ou contacter l\'administrateur du site',
            redirect: false
          })
        }
      } else {
        this.userEmailErrorMsg = 'Cette adresse email n\'est pas associées à un compte utilisateur'
        this.userEmailValid = 'error'
        this.sendButtonLabel = 'Envoyer un lien de réinitialisation'
      }
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    }
  }
}
</script>
