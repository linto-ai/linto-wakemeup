<template>
  <div>
    <div class="modal" :class="[showCreateAccountModal ? 'visible' : 'hidden']">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title green">Créer un compte</h3>
          <button @click="closeModal()" class="close-modal"></button>
          <button @click="backToLogin()" class="back-login-modal"></button>
        </div>
        <div class="modal-body">
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Adresse email:</span>
            </div>
            <input type="text" class="input" v-model="userEmail" :class="[userEmailValid === 'error' ? 'error' : '', userEmailValid === 'valid' ? 'valid' : '']">
            <span
              class="error-field"
              :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userEmailErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Mot de passe :</span>
              <button class="info-label"></button>
            </div>
            <input type="password" class="input" v-model="userPswd" :class="[userPswdValid === 'error' ? 'error' : '', userPswdValid === 'valid' ? 'valid' : '']">
            <span
              class="error-field"
              :class="[userPswdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Confirmation du mot de passe :</span>
            </div>
            <input type="password" class="input" v-model="userPswdConfirm" :class="[userPswdConfirmValid === 'error' ? 'error' : '', userPswdConfirmValid === 'valid' ? 'valid' : '']">
            <span
              class="error-field"
              :class="[userPswdConfirmdErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userPswdConfirmdErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Sexe :</span>
              <select class="select" v-model="userGender" :class="[userGenderValid === 'error' ? 'error' : '', userGenderValid === 'valid' ? 'valid' : '']">
                <option value="" hidden>Sélectionner un sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
            <span
              class="error-field"
              :class="[userGenderErrorMsg.length > 0 ? 'visible' : 'hidden']"
            >{{ userGenderErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="required">*</span>
              <span class="label">Type de mircophone (<i>Choix modifiable à posterior</i>):</span>
            </div>
            <div class="micro-type-container">
              <div class="micro-type-item" @click="setMicrophone('default')" :class="[deviceType == 'default' ? 'active' : '']">
                <span class="icon default"></span>
                <span class="label">Micro par défaut</span>
              </div>
              <div class="micro-type-item" @click="setMicrophone('casque')" :class="[deviceType == 'casque' ? 'active' : '']">
                <span class="icon casque"></span>
                <span class="label">Micro-casque</span>
              </div>
              <div @click="setMicrophone('pied')" class="micro-type-item" :class="[deviceType == 'pied' ? 'active' : '']">
                <span class="icon pied"></span>
                <span class="label">Micro à pied</span>
              </div>
            </div>
          </div>
          <div class="field-container btn">
            <button class="button green large" @click="sendForm()">{{ btnCreateAccountLabel }}</button>
            <span class="status-field" :class="[createAccountStatus.length > 0 ? 'visible ' + createAccountStatus : 'hidden']">{{ createAccoutMsg }}</span>
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
  data() {
    return {
      showCreateAccountModal: false,
      deviceType: 'default',
      userEmail: "",
      userEmailValid: false,
      userEmailErrorMsg: "",
      userPswd: "",
      userPswdValid: false,
      userPswdErrorMsg: "",
      userPswdConfirm: "",
      userPswdConfirmValid: false,
      userPswdConfirmdErrorMsg: "",
      userGender: '',
      userGenderValid: false,
      userGenderErrorMsg: '',
      btnCreateAccountLabel: 'Créer un compte',
      createAccountStatus: '',
      createAccoutMsg: ''
    }
  },
  mounted () {
    bus.$on('toggle_create_account_modal', () => {
      this.showCreateAccountModal = true
    })
  },
  methods: {
    setMicrophone (selected) {
      this.deviceType = selected
    },
    closeModal () {
      this.showCreateAccountModal = false
    },
    backToLogin () {
      this.showCreateAccountModal = false
      bus.$emit('toggle_connection_modal', () => {})
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    async sendForm () {
      const formValid = this.checkForm()
      if (formValid) {
        this.btnCreateAccountLabel = 'Création en cours...'
        const payload = {
          email : this.userEmail,
          pswd: this.userPswd,
          gender: this.userGender,
          deviceType: this.deviceType
        }
        const createUser = await axios(`${process.env.VUE_APP_URL}/login/createUser`,{
          method: 'post',
          data: payload
        })
        this.createAccountStatus = createUser.data.status
        this.createAccoutMsg = createUser.data.msg
        if (createUser.data.status === 'success') {
          this.btnCreateAccountLabel = 'Succès'
          this.createAccoutMsg += ', vous allez être redirigé dans 3 sec'
          this.setCookie('wmu_user', createUser.data.userHash)
          setTimeout(() => {
            document.location.href = '/'
          },3000)
        } else {
          this.btnCreateAccountLabel = 'Créer un compte'
        }
      } else {
        return
      }
    },
    checkForm () {
      // User Email 
      if (this.userEmail.length === 0) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email'
      } else if (!this.validateEmail(this.userEmail)) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Le format de l\'adresse email est invalide'
      } else {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      }

      // Password
      if (this.userPswd.length === 0) {
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Veuillez renseigner un mot de passe'
      } else if (this.userPswd.length < 8) {
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Le mot de passe doit contenir au moins 8 caractères'
      } else {
        this.userPswdValid = 'valid'
        this.userPswdErrorMsg = ''
      }

      // Confrim password
      if (this.userPswdConfirm.length === 0) {
        this.userPswdConfirmValid = 'error'
      }
      else if (this.userPswdConfirm !== this.userPswd) {
        this.userPswdConfirmValid = 'error'
        this.userPswdConfirmdErrorMsg = 'Les mots de passes doivent êtres identiques'
      } else {
        this.userPswdConfirmValid = 'valid'
        this.userPswdConfirmdErrorMsg = ''
      }

      // Gender
      if (this.userGender === '') {
        this.userGenderValid = 'error'
        this.userGenderErrorMsg = 'Veuillez sélectionner un sexe'
      } else {
        this.userGenderValid = 'valid'
        this.userGenderErrorMsg = ''
      }
      
      if (this.userEmailValid === 'valid' && this.userPswdValid === 'valid' && this.userPswdConfirmValid === 'valid' && this.userGenderValid === 'valid') {
        return true
      } else {
        return false
      }
    },
    setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60))
      const expires = 'expires='+d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    },
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  }
}
</script>
