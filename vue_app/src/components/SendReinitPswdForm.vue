<template>
  <div>
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Adresse email:</span>
      </div>
      <input
        type="text"
        class="input"
        v-model="userEmail"
        :class="{error: $v.userEmail.$error, valid: !$v.userEmail.$invalid}"
        @blur="$v.userEmail.$touch()"
        @keyup.13="sendMail($v)"
      >
      <span class="error-field" v-if="!$v.userEmail.required">Ce champ est obligatoire</span>
      <span class="error-field" v-if="!$v.userEmail.email">Le format de l'adresse email est invalide</span>
      <span class="error-field" v-if="userEmail.length > 0 && !$v.userEmail.userExist">Cette adresse email n'est pas associée à un compte</span>
    </div>
    <div class="field-container btn">
      <button class="button green large" @click.prevent="sendMail($v)">{{ sendButtonLabel }}</button>
    </div>
  </div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      userEmail: '',
      sendButtonLabel: 'Envoyer un lien de réinitialisation',
      mailSend: false
    }
  },
  validations: {
    userEmail: {
      required,
      email,
      userExist: async (val) => {
        const testUser = await axios(`${process.env.VUE_APP_URL}/api/user/userEmailExist`, {
          method: 'post',
          data: {email: val}
        })
        if (testUser.data.status === 'success') {
          return true
        }
        return false
      }
    }
  },
  methods: {
    async sendMail (validator) {
      validator.$touch()
      if(!validator.$error) {
        // Verify that the email is associated to a user
        const email = this.userEmail
        this.sendButtonLabel = 'Envoi en cours, veuillez patienter...'
        // Generate reinitToken and send mail to user
        const setReinit = await axios(`${process.env.VUE_APP_URL}/api/user/setReinit`, {
          method: 'post',
          data: { email }
        })
        if (setReinit.data.status === 'success') {
          this.sendButtonLabel = 'Succès'
          this.mailSend = true
          bus.$emit('reinit_mail_send', {})
        } else {
          this.sendButtonLabel = 'Envoyer un lien de réinitialisation'
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue. Veuilez rééssayer ultérieurement ou contacter l\'administrateur du site',
            redirect: false
          })
        }
      }
    }
  }
}
</script>
