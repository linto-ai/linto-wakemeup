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
              <span class="label">Nom d'utilisateur / email:</span>
            </div>
            <input
              type="text"
              class="input"
              v-model="userName"
              :class="[this.userNameErrorMsg.length > 0 ? 'error' : '']"
              @keyup.13="handleLogin()"
            >
            <span class="error-field">{{ userNameErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="icon pswd"></span>
              <span class="label">Mot de passe :</span>
            </div>
            <input
              type="password"
              class="input"
              v-model="userPswd"
              :class="[this.userPswdErrorMsg.length > 0 ? 'error' : '']"
              @keyup.13="handleLogin()"
            >
            <span class="error-field">{{ userPswdErrorMsg }}</span>
          </div>
          <div class="field-container btn">
            <button
              class="button green large"
              @click="handleLogin"
            >{{ connexionBtnLabel }}</button>
          </div>
          <a href="/reinit-password">Mot de passe oublié ?</a>
          <div class="spacer"></div>
          <div class="divider red"></div>
          <div class="spacer"></div>
          <span>Vous n'avez pas d'identifiants ?</span>
          <div class="field-container btn">
            <button class="button green large" @click="toggleCreateAccountModal" >Créer un compte</button>
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
      userName: '',
      userNameErrorMsg: '',
      userPswd: '',
      userPswdErrorMsg: '',
      connexionBtnLabel: 's\'identifier',
    }
  },
  mounted () {
    bus.$on('toggle_connection_modal', () => {
      this.toggleConnectionModal()
    })
  },
  watch: {
    userName: function (data) {
      if (data.indexOf('@') >= 0) {
        this.userName = data.toLowerCase()
      }
    }
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
    handleLogin () {
      this.userNameErrorMsg = ''
      this.userPswdErrorMsg = ''
      let valid = true

      if (this.userName.length === 0 || this.userName === '') {
        this.userNameErrorMsg = 'Ce champs est obligatoire'
        valid = false
      }
      if (this.userPswd.length === 0 || this.userPswd === '') {
        this.userPswdErrorMsg = 'Ce champs est obligatoire'
        valid = false
      }
      if (valid) {
        this.sendLogin()
      }
    },
    async sendLogin () {
      this.connexionBtnLabel = 'Connexion...'
      const payload = {
        userName: this.userName,
        password: this.userPswd
      }
      const login = await axios(`${process.env.VUE_APP_URL}/login/userAuth`, {
        method: 'post',
        data: payload
      })
      if (login.data.status === 'error') {
        this.connexionBtnLabel = 's\'identifier'
        if (login.data.field === 'user') {
          this.userNameErrorMsg = login.data.msg
        } else if (login.data.field === 'password') {
          this.userPswdErrorMsg = login.data.msg
        }
      } else if (login.data.status === 'success') {
        document.location.href = '/'
      }
    }
  }
}
</script>
