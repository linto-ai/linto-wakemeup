<template>
  <div>
    <!-- Name -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Nom / Prénom :</span>
      </div>
       <input
        type="text"
        class="input"
        v-model.lazy="userName"
        :class="{error: $v.userName.$error, valid: !$v.userName.$invalid}"
        @blur="$v.userName.$touch()"
        @keyup.13="sendForm($v)"
      >
      <span class="error-field" v-if="!$v.userName.required">Ce champ est obligatoire</span>
      <span class="error-field" v-if="userName.length > 0 && !$v.userName.isName">Veuillez saisir un nom valide</span>
    </div>
    <!-- Society -->
    <div class="field-container">
      <div class="field-label">
        <span class="label">Société :</span>
      </div>
      <input type="text" class="input" v-model.lazy="userSociety" v-on:keyup.13="sendForm()">
    </div>
    <!-- Email -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Email :</span>
      </div>
      <input
        type="text"
        class="input"
        v-model.lazy="userEmail"
        :class="{error: $v.userEmail.$error, valid: !$v.userEmail.$invalid}"
        @blur="$v.userEmail.$touch()"
        @keyup.13="sendForm($v)"
      >
      <span class="error-field" v-if="!$v.userEmail.required">Ce champ est obligatoire</span>
      <span class="error-field" v-if="!$v.userEmail.email">Le format de l'adresse email est invalide</span>
    </div>
    <!-- Subject -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Objet :</span>
      </div>
      <input
        type="text"
        class="input"
        v-model.lazy="userSubject"
        :class="{error: $v.userSubject.$error, valid: !$v.userSubject.$invalid}"
        @blur="$v.userSubject.$touch()"
        @keyup.13="sendForm($v)"
      >
      <span class="error-field" v-if="!$v.userSubject.required">Ce champ est obligatoire</span>
    </div>
    <!-- Message -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Message :</span>
      </div>
      <textarea
        class="input textarea"
        v-model.lazy="userMessage"
        :class="{error: $v.userMessage.$error, valid: !$v.userMessage.$invalid}"
        @blur="$v.userMessage.$touch()"
        @keyup.13="sendForm($v)"
      ></textarea>
      <span class="error-field" v-if="!$v.userMessage.required">Ce champ est obligatoire</span>
    </div>
    <!-- Captcha -->
    <div class="field-container captcha">
      <Captcha :status="captchaErrorMsg.length > 0 ? 'error' : ''"></Captcha>
      <span
        class="error-field"
        :class="[captchaErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ captchaErrorMsg }}</span>
    </div>
    <!-- Submit button -->
    <div class="field-container btn">
      <button class="button green large" @click="sendForm($v)">{{ btnLabel }}</button>
    </div>
  </div>
</template>
<script>
import { required, email, regex } from 'vuelidate/lib/validators'
import { bus } from '../main.js'
import Captcha from './Captcha.vue'
import axios from 'axios'
export default {
  data () {
    return {
      userName: '',
      userSociety: '',
      userEmail: '',
      userSubject: '',
      userMessage: '',
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
  validations: {
    userName: {
      required,
      isName: (val) => {
        const regExp = /^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/g
        return (regExp.test(val))
      }
    },
    userEmail: {
      required,
      email
    },
    userSubject: {
      required
    },
    userMessage: {
      required
    }
  },
  watch: {
    userEmail: function (data) {
      this.userEmail = data.toLowerCase()
    }
  },
  methods: {
    async sendForm (validator) {
      validator.$touch()
      if (!this.captchaValid) {
        this.captchaErrorMsg = 'Le captcha est erroné'
      } else {
        this.captchaErrorMsg = ''
      }
      if (!validator.$invalid && this.captchaValid) {
        const payload = {
          userName: this.userName,
          subject: this.userSubject,
          email: this.userEmail.toLowerCase(),
          message: this.formatMessage(this.userMessage),
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
          validator.$reset()
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
    formatMessage (msg) {
      const formattedMsg = msg
      .replace(/\n/g, '<br />')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      return formattedMsg
    }
  },
  components: {
    Captcha
  }
}
</script>
