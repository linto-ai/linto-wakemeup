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
              <span class="label">Nom d'utilisateur:</span>
            </div>
            <input
              type="text"
              class="input"
              v-model.lazy="userName"
              :class="{error: $v.userName.$error || userNameErrorMsg.length > 0}"
              @blur="$v.userName.$touch()"
              @keyup.13="sendLogin($v)"
            >
            <span class="error-field" v-if="!$v.userName.required">Ce champ est obligatoire</span>
            <span class="error-field" v-if="!$v.userName.alphaNum">Le nom d'utilisateur ne doit contenir que des caractères alpha-numériques</span>
            <span class="error-field" v-if="!$v.userName.minLength">Le nom d'utilisateur doit comporter au moins {{ $v.userName.$params.minLength.min }} caractères</span>
            <span class="error-field" v-if="userNameErrorMsg.length > 0">{{ userNameErrorMsg }}</span>
          </div>
          <div class="field-container">
            <div class="field-label">
              <span class="icon pswd"></span>
              <span class="label">Mot de passe :</span>
            </div>
            <input
              type="password"
              class="input"
              v-model.lazy="userPswd"
              :class="{error: $v.userPswd.$error || userPswdErrorMsg.length > 0}"
              @keyup.13="sendLogin($v)">
            <span class="error-field" v-if="!$v.userPswd.required">Ce champ est obligatoire</span>
            <span class="error-field" v-if="!$v.userPswd.minLength">Le mot de passe doit contenir au moins {{ $v.userPswd.$params.minLength.min }}</span>
            <span class="error-field" v-if="userPswdErrorMsg.length > 0">{{ userPswdErrorMsg }}</span>

          </div>
          <div class="field-container btn">
            <button
              class="button green large"
              @click.prevent="sendLogin($v)"
              :disabled="$v.$invalid"
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
import { required, minLength, alphaNum } from 'vuelidate/lib/validators'
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
  validations: {
    userName: {
      required,
      minLength: minLength(3),
      alphaNum
    },
    userPswd: {
      required,
      minLength: minLength(6)
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
    async sendLogin (formValidator) {
      this.connexionBtnLabel = 'Connexion...'
      this.userPswdErrorMsg = ''
      this.userNameErrorMsg = ''
      if (!formValidator.$error && !formValidator.$invalid) {
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
}
</script>
