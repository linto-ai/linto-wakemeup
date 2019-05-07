<template>
  <div>
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Nouveau mot de passe :</span>
      </div>
      <input type="password" class="input" v-model="userPswd" :class="[userPswdValid === 'error' ? 'error' : '', userPswdValid === 'valid' ? 'valid' : '']" v-on:keyup.13="updatePswd()">
      <span
        class="error-field"
        :class="[userPswdErrorMsg.length > 0 ? 'visible' : 'hidden']"
      >{{ userPswdErrorMsg }}</span>
    </div>
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label">Confirmation du nouveau de passe :</span>
      </div>
      <input type="password" class="input" v-model="userPswdConfirm" :class="[userPswdConfirmValid === 'error' ? 'error' : '', userPswdConfirmValid === 'valid' ? 'valid' : '']" v-on:keyup.13="updatePswd()">
      <span class="error-field" :class="[userPswdConfirmErrorMsg.length > 0 ? 'visible' : 'hidden']" >{{ userPswdConfirmErrorMsg }}</span>
    </div>
    <div class="field-container btn">
      <button class="button green large" @click="updatePswd()">Créer un nouveau mot de passe</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  props: {
    userHash: String
  },
  data () {
    return {
      userPswd: '',
      userPswdValid: false,
      userPswdErrorMsg: '',
      userPswdConfirm: '',
      userPswdConfirmValid: false,
      userPswdConfirmErrorMsg: ''
    }
  },
  methods: {
    checkPswd () {
      let pswdFormValid = true
      // check new password
      if (this.userPswd.length === 0) {
        pswdFormValid = false
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Veuillez saisir un nouveau mot de passe'
      } else if (this.userPswd === this.currentPswd) {
        pswdFormValid = false
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Le nouveau mot de passe doit être différent de l\'actuel'
      } else if (this.userPswd.length < 8) {
        pswdFormValid = false
        this.userPswdValid = 'error'
        this.userPswdErrorMsg = 'Votre mot de passe doit contenir au moins 8 caractères'
      } else {
        this.userPswdValid = 'valid'
        this.userPswdErrorMsg = ''
      }

      // check new password confirm
      if (this.userPswdConfirm.length === 0) {
        pswdFormValid = false
        this.userPswdConfirmValid = 'error'
        this.userPswdConfirmErrorMsg = 'Veuillez confirmer votre nouveau mot de passe'
      } else if (this.userPswdConfirm !== this.userPswd) {
        pswdFormValid = false
        this.userPswdConfirmValid = 'error'
        this.userPswdConfirmErrorMsg = 'Les mots de passe saisis ne correspondent pas'
      } else {
        this.userPswdConfirmValid = 'valid'
        this.userPswdConfirmErrorMsg = ''
      }
      return pswdFormValid
    },
    async updatePswd () {
      const pswdFormValid = this.checkPswd()
      if (pswdFormValid) {
        const payload = {
          newPswd: this.userPswd,
          userHash: this.userHash
        }
        const updatePswd = await axios(`${process.env.VUE_APP_URL}/api/user/reinitPswd`, {
          method: 'post',
          data: payload
        })
        if (updatePswd.data.status === 'success') {
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Votre mot de passe a été modifié',
            redirect: '/'
          })
        } else if (updatePswd.data.status === 'error') {
          bus.$emit('notify_app', {
            status: updatePswd.status,
            msg: 'error on creating new password',
            redirect: false
          })
        }
      }
    }
  }
}
</script>
