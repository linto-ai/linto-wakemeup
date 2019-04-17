<template>
  <div>
    <div class="modal" :class="[showConnectionModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title red">Se connecter</h3>
          <button @click="closeModal" class="close-modal"></button>
        </div>
        <div class="modal-body">
          <span>Veuillez renseigner vos identifiants</span>
          <div class="field-container">
            <div class="field-label">
              <span class="icon user"></span>
              <span class="label">Adresse email:</span>
            </div>
            <input type="text" class="input" v-model="userEmail" :class="[userEmailValid === 'error' ? 'error' : '', userEmailValid  === 'valid' ? 'valid' : '']">
            <span
              class="error-field"
              :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userEmailErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="icon pswd"></span>
              <span class="label">Mot de passe :</span>
            </div>
            <input type="password" class="input" v-model="userPswd" :class="[userPswdValid === 'error' ? 'error' : '', userPswdValid === 'valid' ? 'valid' : '']">
            <span
              class="error-field"
              :class="[userPswdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdErrorMsg }}</span>
          </div>
          <div class="field-container btn">
            <button class="button red large" @click="sendLogin()">S'identifier</button>
          </div>
          <button class="aslink">Identifiants oubliés ?</button>
          <div class="spacer"></div>
          <div class="divider red"></div>
          <div class="spacer"></div>
          <span>Vous n'avez pas d'identifiants ?</span>
          <div class="field-container btn">
            <button class="button green large" @click="toggleCreateAccountModal">Créer un compte</button>
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
      showConnectionModal: false,
      userEmail: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      userPswd: '',
      userPswdValid: false,
      userPswdErrorMsg: ''
    }
  },
  mounted () {
    bus.$on('toggle_connection_modal', () => {
      this.toggleConnectionModal()
    })
  },
  methods: {
    toggleConnectionModal () {
      this.showConnectionModal = !this.showConnectionModal
    },
    closeModal () {
      this.showConnectionModal = false
    },
    toggleCreateAccountModal () {
      this.showConnectionModal = false
      bus.$emit('toggle_create_account_modal', {})
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    checkForm () {
      // Check email
      if (this.userEmail.length === 0) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Vous devez renseigner une adresse email de connection'
      } else if (!this.validateEmail(this.userEmail)) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Le format de l\'adresse email est invalide'
      } else {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      }

      // Check password
      if (this.userPswd.length === 0) {
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Veuillez renseigner un mot de passe'
      } else {
        this.userPswdValid = 'valid'
        this.userPswdErrorMsg = ''
      }

      if (this.userEmailValid === 'valid' && this.userPswdValid === 'valid') {
        return true
      } else {
        return false
      }
    },
    async sendLogin () {
      const formValid = this.checkForm()
      if (formValid) {
        const payload = {
          email: this.userEmail,
          password: this.userPswd
        }
        const login = await axios(`${process.env.VUE_APP_URL}/login/userAuth`, {
          method: 'post',
          data: payload
        })
        if (login.data.status === 'error') {
          if (login.data.field === 'user') {
            this.userEmailValid = 'error'
            this.userEmailErrorMsg = login.data.msg
          } else if (login.data.field === 'password') {
            this.userPswdValid = 'error'
            this.userPswdErrorMsg = login.data.msg
          }
        } else if (login.data.status === 'success') {
          document.location.href = '/'
        }
      }
    }
  }
}
</script>
