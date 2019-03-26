<template>
  <div>
    <div id="page-content">
      <div class="container-fluid">
        <div class="row justify-content-around">
          <div class="col-5">
            <h2>Informations utilisateur</h2>
            <div class="white-container">
              <table class="user-panel-tab">
                <tbody>
                  <tr>
                    <td class="tab-label">Adresse email :</td>
                    <td class="tab-input">
                      <input class="input" v-model="userEmail"  :class="[userEmailValid === 'error' ? 'error' : '', userEmailValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ userEmailErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Sexe :</td>
                    <td class="tab-input">
                      <select class="select" v-model="userInfos.gender">
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Type de microphone :</td>
                    <td class="tab-input">
                      <div class="micro-type-container">
                        <div class="micro-type-item" @click="setMicrophone('default')" :class="[userInfos.deviceType === 'default' ? 'active' : '']">
                          <span class="icon default"></span>
                          <span class="label">Micro par défaut</span>
                        </div>
                        <div class="micro-type-item" @click="setMicrophone('casque')" :class="[userInfos.deviceType === 'casque' ? 'active' : '']">
                          <span class="icon casque"></span>
                          <span class="label">Micro-casque</span>
                        </div>
                        <div class="micro-type-item" @click="setMicrophone('pied')" :class="[userInfos.deviceType === 'pied' ? 'active' : '']">
                          <span class="icon pied"></span>
                          <span class="label">Micro à pied</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="spacer"></div>
              <div class="divider grey"></div>
              <div class="spacer"></div>
              <span class="info">Les informations suivantes sont facultatives</span>
              <table class="user-panel-tab">
                <tbody>
                  <tr>
                    <td class="tab-label">Nom :</td>
                    <td class="tab-input">
                      <input class="input" v-model="userInfos.lastName" :class="[lastNameValid === 'error' ? 'error' : '', lastNameValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[lastNameErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ lastNameErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Prénom :</td>
                    <td class="tab-input">
                      <input class="input" v-model="userInfos.firstName" :class="[firstNameValid === 'error' ? 'error' : '', firstNameValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[firstNameErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ firstNameErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Tranche d'âge :</td>
                    <td class="tab-input">
                      <select class="select" v-model="userInfos.ageRange">
                        <option value="" hidden>Sélectionner votre tranche d'âge</option>
                        <option value="10-20">10 - 20 ans</option>
                        <option value="20-30">20 - 30 ans</option>
                        <option value="30-40">30 - 40 ans</option>
                        <option value="40-50">40 - 50 ans</option>
                        <option value="50-60">50 - 60 ans</option>
                        <option value="60-70">60 - 70 ans</option>
                        <option value="70+">70+ ans</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;">
                      <button class="button green large" @click="updateProfil()">Mettre mes informations à jour</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2>Modifier le mot de passe</h2>
            <div class="white-container">
              <table class="user-panel-tab">
                <tbody>
                  <tr>
                    <td class="tab-label">Mot de passe actuel :</td>
                    <td class="tab-input">
                      <input class="input" type="password" v-model="currentPswd"  :class="[currentPswdValid === 'error' ? 'error' : '', currentPswdValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[currentPswdErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ currentPswdErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Nouveau mot de passe :</td>
                    <td class="tab-input">
                      <input class="input" type="password" v-model="newPswd"  :class="[newPswdValid === 'error' ? 'error' : '', newPswdValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[newPswdErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ newPswdErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tab-label">Confirmation du ouveau mot de passe :</td>
                    <td class="tab-input">
                      <input class="input" type="password" v-model="newPswdConfirm"  :class="[newPswdConfirmValid === 'error' ? 'error' : '', newPswdConfirmValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[newPswdConfirmErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ newPswdConfirmErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;">
                      <button class="button red large" @click="updatePswd()">Modifier le mot de passe</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-5">
            <h2>Statistiques</h2>
            <div class="white-container">
              <div class="row">
                <div class="col user-stats">
                  <h3>Wake-words enregistrés</h3>
                  <div class="stats-container">
                    <span class="icon talk"></span>
                    <span class="number talk">{{ userInfos.nbRecord }}</span>
                  </div>
                  <a href="/interface/record" class="button red">S'enregistrer</a>
                </div>
                <div class="col user-stats">
                  <h3>Wake-words écoutés</h3>
                  <div class="stats-container">
                    <span class="icon listen"></span>
                    <span class="number listen">{{ userInfos.nbListen }}</span>
                  </div>
                  <a href="/interface/listen" class="button green">Écouter</a>
                </div>
              </div>
            </div>
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
      userEmail: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      lastNameValid: false,
      lastNameErrorMsg: '',
      firstNameValid: false,
      firstNameErrorMsg: '',
      currentPswd: '',
      currentPswdValid: false,
      currentPswdErrorMsg: '',
      newPswd: '',
      newPswdValid: false,
      newPswdErrorMsg: '',
      newPswdConfirm: '',
      newPswdConfirmValid: false,
      newPswdConfirmErrorMsg: ''
    }
  },
  computed : {
    userInfos () {
      this.userEmail = this.$store.state.userInfos.email
      return this.$store.state.userInfos
    }
  },
  methods: {
    setMicrophone (data) {
      this.userInfos.deviceType = data
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    validateNames (name) {
      return (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name))
    },
    checkProfil () {
      let profilValid = true
      // check email
      if (this.validateEmail(this.userEmail)) {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      } else {
        profilValid = false
        if (this.userInfos.email.length === 0) {
          this.userEmailValid = 'error'
          this.userEmailErrorMsg = 'Veuillez renseigner une adresse email'
        } else {
          this.userEmailValid = 'error'
          this.userEmailErrorMsg = 'Le format de l\'adresse email est invalide'
        }
      }
      
      // check lastname
      if (this.validateNames(this.userInfos.lastName) || this.userInfos.lastName.length === 0) {
        this.lastNameValid = 'valid'
        this.lastNameErrorMsg = ''
      } else {
        profilValid = false
        this.lastNameValid = 'error'
        this.lastNameErrorMsg = 'Veuillez saisir un Nom valide'
      }

      // check firstanme
       if (this.validateNames(this.userInfos.firstName) || this.userInfos.firstName.length === 0) {
        this.firstNameValid = 'valid'
        this.firstNameErrorMsg = ''
      } else {
        profilValid = false
        this.firstNameValid = 'error'
        this.firstNameErrorMsg = 'Veuillez saisir un Prénom valide'
      }
      return profilValid
    },
    async updateProfil () {
      const profilValid = this.checkProfil()
      if (profilValid) {
        let payload = this.userInfos
        payload.email = this.userEmail
        const updateUser = await axios(`${process.env.VUE_APP_URL}/api/updateUser`, {
          method: 'post',
          data: payload
        })
        if (updateUser.data.status === 'success') {
          this.userEmailValid = false
          this.lastNameValid = false
          this.firstNameValid = false
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Vos informations ont été mises à jour',
            redirect: false
          })
          this.$store.dispatch('getUserInfos', this.userInfos.emailHash)
        }
      }
      else {
        return
      }
    },
    checkPswd () {
      let pswdFormValid = true

      // check current password
      if (this.currentPswd.length === 0 ) {
        pswdFormValid = false
        this.currentPswdValid = 'error'
        this.currentPswdErrorMsg = 'Veuillez saisir votre mot de passe actuel'
      } else {
        this.currentPswdValid = 'valid'
        this.currentPswdErrorMsg = ''
      }

      // check new password
      if (this.newPswd.length === 0 ) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Veuillez saisir un nouveau mot de passe'
      } else if (this.newPswd === this.currentPswd ) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Le nouveau mot de passe doit être différent de l\'actuel'

      } else if (this.newPswd.length < 8 ) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Votre mot de passe doit contenir au moins 8 caractères'
      } else {
        this.newPswdValid = 'valid'
        this.newPswdErrorMsg = ''
      }

      // check new password confirm
      if (this.newPswdConfirm.length === 0 ) {
        pswdFormValid = false
        this.newPswdConfirmValid = 'error'
        this.newPswdConfirmErrorMsg = 'Veuillez confirmer votre nouveau mot de passe'
      } else if (this.newPswdConfirm != this.newPswd ) {
        pswdFormValid = false
        this.newPswdConfirmValid = 'error'
        this.newPswdConfirmErrorMsg = 'Les mots de passe saisis ne correspondent pas'
      } else {
        this.newPswdConfirmValid = 'valid'
        this.newPswdConfirmErrorMsg = ''
      }

      return pswdFormValid
    },
    async updatePswd () {
      const pswdFormValid = this.checkPswd()
      if (pswdFormValid) { 
        const payload = {
          currentPswd: this.currentPswd,
          newPswd: this.newPswd,
          emailHash: this.userInfos.emailHash
        }
        const updatePswd = await axios(`${process.env.VUE_APP_URL}/api/updateUserPswd`, {
          method: 'post',
          data: payload
        })
        if (updatePswd.data.status === 'success') {
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Votre mot de passe a été modifié',
            redirect: false
          })
          this.$store.dispatch('getUserInfos', this.userInfos.emailHash)
        } else if (updatePswd.data.status === 'error') {
          if (updatePswd.data.code === 0) {
            this.currentPswdValid = 'error'
            this.currentPswdErrorMsg = 'Le mot de passe saisi est invalide'
          } else {
            bus.$emit('notify_app', {
            status: updatePswd.status,
            msg: updatePswd.data.msg,
            redirect: false
          })
          }
        }
      } else {
        return
      }
    }
  }
}
</script>