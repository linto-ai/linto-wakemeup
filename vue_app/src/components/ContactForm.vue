<template>
  <div>
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Nom / Prénom :</span>
      </div>
      <input type="text" class="input" v-model="userName" :class="[userNameValid === 'error' ? 'error' : '', userNameValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
      <span
        class="error-field"
        :class="[userNameErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userNameErrorMsg }}</span>
    </div>

    <div class="field-container">
      <div class="field-label">
        <span class="label">Société :</span>
      </div>
      <input type="text" class="input" v-model="userSociety" :class="[userSocietyValid === 'error' ? 'error' : '', userSocietyValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
      <span
        class="error-field"
        :class="[userSocietyErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userSocietyErrorMsg }}</span>
    </div>

    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Email :</span>
      </div>
      <input type="text" class="input" v-model="userEmail" :class="[userEmailValid === 'error' ? 'error' : '', userEmailValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
      <span
        class="error-field"
        :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userEmailErrorMsg }}</span>
    </div>

    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Objet :</span>
      </div>
      <input type="text" class="input" v-model="userSubject" :class="[userSubjectValid === 'error' ? 'error' : '', userSubjectValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
      <span
        class="error-field"
        :class="[userSubjectErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userSubjectErrorMsg }}</span>
    </div>

    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Message :</span>
      </div>
      <textarea class="input textarea" v-model="userMessage" :class="[userMessageValid === 'error' ? 'error' : '', userMessageValid === 'valid' ? 'valid' : '']"></textarea>
      <span
        class="error-field"
        :class="[userMessageErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userMessageErrorMsg }}</span>
    </div>
    <div class="field-container captcha">
      <Captcha :status="captchaErrorMsg.length > 0 ? 'error' : ''"></Captcha>
      <span
        class="error-field"
        :class="[captchaErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ captchaErrorMsg }}</span>
    </div>
    <div class="field-container btn">
        <button class="button green large" @click="sendForm()">{{ btnLabel }}</button>

    </div>

  </div>
</template>
<script>
import { bus } from '../main.js'
import Captcha from './Captcha.vue'
import axios from 'axios'
export default {
  data () {
    return {
      userName: '',
      userNameValid: false,
      userNameErrorMsg: '',
      userSociety: '',
      userSocietyValid: false,
      userSocietyErrorMsg: '',
      userEmail: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      userSubject: '',
      userSubjectValid: false,
      userSubjectErrorMsg: '',
      userMessage: '',
      userMessageValid: false,
      userMessageErrorMsg: '',
      btnLabel: 'Envoyer',
      captchaValid: false,
      captchaErrorMsg: ''
    }
  },
  mounted () {
    bus.$on('contact_captcha', (data) => {
      this.captchaValid = data.value
    })
  },
  methods: {
    checkForm () {
      let formValid = true

        // Email address
      if (this.userEmail.length === 0) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email'
        formValid = false
      } else if (!this.validateEmail(this.userEmail)) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email valide'
        formValid = false
      } else {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      }

      // User Name
      if (this.userName.length === 0) {
        this.userNameValid = 'error'
        this.userNameErrorMsg = 'Veuillez renseigner votre nom'
        formValid = false
      } else {
        this.userNameValid = 'valid'
        this.userNameErrorMsg = ''
      }

      // Subject
      if (this.userSubject.length === 0) {
        this.userSubjectValid = 'error'
        this.userSubjectErrorMsg = 'Veuillez renseigner l\'objet de votre message'
        formValid = false
      } else {
        this.userSubjectValid = 'valid'
        this.userSubjectErrorMsg = ''
      }

      // Message
      if (this.userMessage.length === 0) {
        this.userMessageValid = 'error'
        this.userMessageErrorMsg = 'Veuillez saisir un message'
        formValid = false
      } else {
        this.userMessageValid = 'valid'
        this.userMessageErrorMsg = ''
      }

      if (!this.captchaValid) {
        this.captchaErrorMsg = 'Le captcha est erroné'
        formValid = false
      } else {
        this.captchaErrorMsg = ''
      }

      return formValid
    },
    async sendForm () {
      const formValid = this.checkForm()
      if (formValid) {
        const payload = {
          userName: this.userName,
          subject: this.userSubject,
          email: this.userEmail.toLowerCase(),
          message: this.userMessage,
          society: this.userSociety
        }
        this.btnLabel = 'Envoi en cours...'
        let sendMail = await axios(`${process.env.VUE_APP_URL}/api/contact/send`, {
          method: 'post',
          data: { payload }
        })
        if (sendMail.data.status === 'success') {
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Votre message a bien été envoyé, il sera traité dans les plus brefs délais.',
            redirect: false
          })
          this.userMessage = ''
          this.btnLabel = 'Envoyer'
        } else {
          bus.$emit('notify_app', {
            status: 'error',
            msg: sendMail.data.msg,
            redirect: false
          })
          this.btnLabel = 'Envoyer'
        }
      }
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    }
  },
  components: {
    Captcha
  }
}
</script>
