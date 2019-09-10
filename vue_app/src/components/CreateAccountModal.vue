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
          <div v-if="!accountCreated">

            <!-- User Name -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userName.error !== null ? 'error' : '']">Nom d'utilisateur:</span>
              </div>
              <input
                type="text"
                class="input"
                v-model="formFields.userName.value"
                :class="[
                  formFields.userName.error !== null ? 'error' : '',
                  formFields.userName.valid ? 'valid' : ''
                ]"
                @keyup.13="handleCreateAccount()"
              >
              <span class="error-field" v-if="formFields.userName.error !== null">{{ formFields.userName.error }}</span>
            </div>

            <!-- User Email -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userEmail.error !== null ? 'error' : '']">Adresse email:</span>
              </div>
              <input
                type="text"
                class="input"
                v-model="formFields.userEmail.value"
                :class="[
                  formFields.userEmail.error !== null ? 'error' : '',
                  formFields.userEmail.valid ? 'valid' : ''
                ]"
                @keyup.13="handleCreateAccount()"
              >
              <span class="error-field" v-if="formFields.userEmail.error !== null">{{ formFields.userEmail.error }}</span>
            </div>

            <!-- Password -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userPswd.error !== null ? 'error' : '']">Mot de passe :</span>
                <button class="info-label"></button>
              </div>
              <input
                type="password"
                class="input"
                v-model=" formFields.userPswd.value"
                :class="[formFields.userPswd.error !== null ? 'error' : '']"
                @keyup.13="handleCreateAccount()"
              >
              <span class="error-field" v-if="formFields.userPswd.error !== null">{{ formFields.userPswd.error }}</span>
            </div>


            <!-- Password Confirm -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userPswdConfirm.error !== null ? 'error' : '']">Confirmation du mot de passe :</span>
              </div>
              <input
                type="password"
                class="input"
                v-model=" formFields.userPswdConfirm.value"
                :class="[
                  formFields.userPswdConfirm.error !== null ? 'error' : '',
                  formFields.userPswdConfirm.valid ? 'valid' : ''
                ]"
                @keyup.13="handleCreateAccount()"
              >
              <span class="error-field" v-if="formFields.userPswdConfirm.error !== null">{{ formFields.userPswdConfirm.error }}</span>
            </div>

            <!-- User Gender -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userGender.error !== null ? 'error' : '']">Sexe :</span>
                <select
                  class="select"
                  v-model=" formFields.userGender.value"
                  :class="[
                    formFields.userGender.error !== null ? 'error' : '',
                    formFields.userGender.valid ? 'valid' : ''
                  ]"
                  @keyup.13="handleCreateAccount()"
                >
                  <option value="" hidden>Sélectionner un sexe</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
                <span class="error-field" v-if="formFields.userGender.error !== null">{{ formFields.userGender.error }}</span>
              </div>
            </div>

            <!-- User Age Range -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.userAgeRange.error !== null ? 'error' : '']">Tranche d'age :</span>
                <select
                  class="select"
                  v-model=" formFields.userAgeRange.value"
                  :class="[
                    formFields.userAgeRange.error !== null ? 'error' : '',
                    formFields.userAgeRange.valid ? 'valid' : ''
                  ]"
                  @keyup.13="handleCreateAccount()"
                >
                  <option value="" hidden>Sélectionner une tranche d'âge</option>
                  <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 10)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+10)}} ans</option>
                  <option value="90+">90+ ans</option>
                </select>
              </div>
              <span class="error-field" v-if="formFields.userAgeRange.error !== null">{{ formFields.userAgeRange.error }}</span>
            </div>

            <!-- Native Language -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label">Je suis français natif :</span>
                <button class="custom-toggle-btn" @click="toggleNative()" :class="[nativeOn ? 'on': 'off']">
                  <span class="cursor" ></span>
                </button>
              </div>
            </div>

            <div class="field-container" v-show="!nativeOn">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label" :class="[formFields.nativeLanguage.error !== null ? 'error' : '']">Langue maternelle :</span>
                <select
                  class="select"
                  ref="languageSelectInput"
                  v-model="selectedLanguage"
                  :class="[
                    formFields.nativeLanguage.error !== null ? 'error' : '',
                    formFields.nativeLanguage.valid ? 'valid' : ''
                  ]"
                >
                  <option value="" hidden>Sélectionner une langue maternelle</option>
                  <option v-for="country in countriesList" :key="country" :value="country" >{{country}}</option>
                </select>
              </div>
              <span class="error-field" v-if="formFields.nativeLanguage.error !== null">{{ formFields.nativeLanguage.error }}</span>
            </div>
            <!-- Device type -->
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label">Type de mircophone (<i>Choix modifiable à posteriori</i>):</span>
              </div>
              <div class="micro-type-container">
                <div class="micro-type-item" @click="setMicrophone('default')" :class="[formFields.deviceType.value == 'default' ? 'active' : '']">
                  <span class="icon default"></span>
                  <span class="label">Micro par défaut</span>
                </div>
                <div class="micro-type-item" @click="setMicrophone('casque')" :class="[formFields.deviceType.value == 'casque' ? 'active' : '']">
                  <span class="icon casque"></span>
                  <span class="label">Micro-casque</span>
                </div>
                <div @click="setMicrophone('pied')" class="micro-type-item" :class="[formFields.deviceType.value == 'pied' ? 'active' : '']">
                  <span class="icon pied"></span>
                  <span class="label">Micro à pied</span>
                </div>
                <div @click="setMicrophone('smartphone')" class="micro-type-item" :class="[formFields.deviceType.value == 'smartphone' ? 'active' : '']">
                  <span class="icon smartphone"></span>
                  <span class="label">Smartphone</span>
                </div>
              </div>
            </div>
            <div class="field-container btn">
              <button class="button green large" @click.prevent="handleCreateAccount()">{{ btnCreateAccountLabel }}</button>
              <span class="status-field" :class="[createAccountStatus.length > 0 ? 'visible ' + createAccountStatus : 'hidden']">{{ createAccoutMsg }}</span>
            </div>
        </div>
        <div v-else class="account-success" >
          <div class="account-success-title">
            <span class="icon"></span>
            <span class="label">Votre compte à bien été créé !</span>
          </div>
          <div class="account-succes-content">
            Merci d'avoir créé un compte sur wakemeup.linto.ai. <br/>
            {{ redirectMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
//import { required, email, minLength, alphaNum, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      accountCreated: false,
      btnCreateAccountLabel: 'Créer un compte',
      countriesList: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D\'Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
      createAccountStatus: '',
      createAccoutMsg: '',
      nativeOn: true,
      redirectMessage: 'Vous allez être redirigé dans 3 secondes...',
      showCreateAccountModal: false,
      selectedLanguage: '',
      formFields: {
        userName: {
          value: '',
          error: null,
          valid: false
        },
        userPswd: {
          value: '',
          error: null,
          valid: false
        },
        userPswdConfirm: {
          value: '',
          error: null,
          valid: false
        },
        userEmail: {
          value: '',
          error: null,
          valid: false
        },
        userGender: {
          value: '',
          error: null,
          valid: false
        },
        userAgeRange: {
          value: '',
          error: null,
          valid: false
        },
        nativeFrench: {
          value: true,
          error: null,
          valid: false
        },
        nativeLanguage: {
          value: 'français',
          error: null,
          valid: false
        },
        deviceType: {
          value: 'default',
          error: null,
          valid: true
        }
      }
    }
  },
  mounted () {
    bus.$on('toggle_create_account_modal', () => {
      this.showCreateAccountModal = true
    })
    bus.$on('policy_agreement_response', (data) => {
      if (data) {
        this.showCreateAccountModal = true
        this.accountCreated = true
        this.createAccount()
      }
    })
  },
  watch: {
    'formFields.userEmail.value': function (data) {
      this.formFields.userEmail.value = data.toLowerCase()
    },
    nativeOn: function (data) {
      this.formFields.nativeFrench.value = data
      if (data) {
        this.formFields.nativeLanguage.value = 'français'
      } else {
        this.formFields.nativeLanguage.value = ''
        this.selectedLanguage = ''
      }
    },
    selectedLanguage: function (data) {
      if (!this.nativeOn) {
        this.formFields.nativeLanguage.value = this.selectedLanguage
      }
    }
  },
  methods: {
    isRequired (obj) {
      if(obj.value.length === 0 || obj.value === '') {
        return false
      }
      return true
    },
    isEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    async handleCreateAccount () {
      let valid = true
      for(let field in this.formFields) {
        this.formFields[field].error = null
        this.formFields[field].valid = false
      }

      // User name
      if(!this.isRequired(this.formFields.userName)) {
        valid = false
        this.formFields.userName.error = 'ce champ est requis'
      } else {
        let userExist = await axios(`${process.env.VUE_APP_URL}/api/user/userNameExist`,{
          method: 'post',
          data: { name: this.formFields.userName.value }
        })
        if(userExist.data.status === 'success') {
          valid = false
          this.formFields.userName.error = 'Ce nom d\'utilisateur est déjà utilisé'
        } else {
          this.formFields.userName.valid = true
        }
      }

      // Email
      if(!this.isRequired(this.formFields.userEmail)) {
        valid = false
        this.formFields.userEmail.error = 'ce champ est requis'
      } else {
        let emailExist = await axios(`${process.env.VUE_APP_URL}/api/user/userEmailExist`,{
          method: 'post',
          data: { email: this.formFields.userEmail.value }
        })
        if(!this.isEmail(this.formFields.userEmail.value)) {
          valid = false
          this.formFields.userEmail.error = 'Le format de l\'adressse email saisie est invalide'
        } else if(emailExist.data.status === 'success') {
          valid = false
          this.formFields.userEmail.error = 'Cette adresse email est déjà utilisée'
        } else {
          this.formFields.userEmail.valid = true
          }
        }

      // Password
      if(!this.isRequired(this.formFields.userPswd)) {
        valid = false
        this.formFields.userPswd.error = 'ce champ est requis'
      } else if (this.formFields.userPswd.value.length < 6) {
        valid = false
        this.formFields.userPswd.error = 'Le mot de passe doit contenir au moins 6 caractères'
      }

      // Password Confirm
      if(!this.isRequired(this.formFields.userPswdConfirm)) {
        valid = false
        this.formFields.userPswdConfirm.error = 'ce champ est requis'
      } else if (this.formFields.userPswdConfirm.value !== this.formFields.userPswd.value) {
        valid = false
        this.formFields.userPswdConfirm.error = 'Les deux mots de passe doivent être identiques'
      }

      // Gender
      if(!this.isRequired(this.formFields.userGender)) {
        valid = false
        this.formFields.userGender.error = 'Ce champ est requis'
      } else {
        this.formFields.userGender.valid = true
      }

      // Age range
      if(!this.isRequired(this.formFields.userAgeRange)) {
        valid = false
        this.formFields.userAgeRange.error = 'Ce champ est requis'
      } else {
        this.formFields.userAgeRange.valid = true
      }

      // Native language
      if(this.formFields.nativeLanguage.value.length === 0 || this.formFields.nativeLanguage.value === '') {
        valid = false
        this.formFields.nativeLanguage.error = 'Vous devez choisir une langue native'
      } else {
        this.formFields.nativeLanguage.valid = true
      }

      // Send Form
      if (valid) {
        this.sendForm()
      }
    },
    toggleNative () {
      this.nativeOn = !this.nativeOn
    },
    setMicrophone (value) {
      this.formFields.deviceType.value = value
    },
    closeModal () {
      this.showCreateAccountModal = false
    },
    backToLogin () {
      this.showCreateAccountModal = false
      bus.$emit('toggle_connection_modal', {})
    },
    sendForm (validator) {
      this.showCreateAccountModal = false
      bus.$emit('show_policy_agreement', {})
    },
    async createAccount () {
      this.btnCreateAccountLabel = 'Création en cours...'
      const payload = {
        email: this.formFields.userEmail.value,
        userName: this.formFields.userName.value,
        pswd: this.formFields.userPswd.value,
        gender: this.formFields.userGender.value,
        deviceType: this.formFields.deviceType.value,
        userAgeRange: this.formFields.userAgeRange.value,
        language: this.formFields.nativeLanguage.value,
        nativeFrench: this.formFields.nativeFrench.value
      }

      const createUser = await axios(`${process.env.VUE_APP_URL}/login/createUser`, {
        method: 'post',
        data: payload
      })
      this.createAccountStatus = createUser.data.status
      this.createAccoutMsg = createUser.data.msg
      if (createUser.data.status === 'success') {
        this.btnCreateAccountLabel = 'Succès'
        this.setCookie('wmu_user', createUser.data.userHash, 1)
        setTimeout(() => {
          this.redirectMessage = 'Vous allez être redirigé dans 2 secondes...'
          setTimeout(() => {
            this.redirectMessage = 'Vous allez être redirigé dans 1 seconde...'
            setTimeout(() => {
              document.location.href = '/'
            }, 1000)
          }, 1000)
        }, 1000)
      } else {
        this.btnCreateAccountLabel = 'Créer un compte'
      }
    },
    setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60))
      const expires = 'expires=' + d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    },
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  }
}
</script>
