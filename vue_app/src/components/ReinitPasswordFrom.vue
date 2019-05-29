<template>
  <div>
     <!-- Password -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label" :class="{error: $v.userPswd.$error}">Mot de passe :</span>
        <button class="info-label"></button>
      </div>
      <input
        type="password"
        class="input"
        v-model="userPswd"
        :class="{error: $v.userPswd.$error, valid: !$v.userPswd.$invalid}"
        @blur="$v.userPswd.$touch()"
        @keyup.13="updatePswd($v)"
      >
      <span class="error-field" v-if="!$v.userPswd.required">Ce champ est obligatoire</span>
      <span class="error-field" v-if="!$v.userPswd.minLength">Le mot de passe doit contenir au moins {{ $v.userPswd.$params.minLength.min }} caractères</span>
    </div>
    <!-- Password Confirm -->
    <div class="field-container">
      <div class="field-label">
        <span class="required">*</span>
        <span class="label" :class="{error: $v.userPswdConfirm.$error}">Confirmation du mot de passe :</span>
      </div>
      <input
        type="password"
        class="input"
        v-model="userPswdConfirm"
        :class="{error: $v.userPswdConfirm.$error, valid: $v.userPswdConfirm.sameAsPassword && userPswdConfirm.length > 0}"
        @blur="$v.userPswdConfirm.$touch()"
        @keyup.13="updatePswd($v)"
      >
      <span class="error-field" v-if="$v.userPswdConfirm.$error">Le mot de passe de confirmation est différent du mot de passe saisi.</span>
    </div>
    <div class="field-container btn">
      <button class="button green large" @click="updatePswd($v)">Créer un nouveau mot de passe</button>
    </div>
  </div>
</template>
<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  props: {
    userHash: String
  },
  data () {
    return {
      userPswd: '',
      userPswdConfirm: ''
    }
  },
  validations: {
    userPswd: {
      required,
      minLength: minLength(6)
    },
    userPswdConfirm: {
      sameAsPassword: sameAs('userPswd')
    }
  },
  methods: {
    async updatePswd (validator) {
      validator.$touch()
      if (!validator.$error) {
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
