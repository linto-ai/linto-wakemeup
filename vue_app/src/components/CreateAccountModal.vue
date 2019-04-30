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
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label">Nom d'utilisateur:</span>
              </div>
              <input type="text" class="input" v-model="userName" :class="[userNameValid === 'error' ? 'error' : '', userNameValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
              <span
                class="error-field"
                :class="[userNameErrorMsg.length > 0 ? 'visible' : 'hidden']"
              >{{ userNameErrorMsg }}</span>
            </div>
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label">Adresse email:</span>
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
                <span class="label">Mot de passe :</span>
                <button class="info-label"></button>
              </div>
              <input type="password" class="input" v-model="userPswd" :class="[userPswdValid === 'error' ? 'error' : '', userPswdValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
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
              <input type="password" class="input" v-model="userPswdConfirm" :class="[userPswdConfirmValid === 'error' ? 'error' : '', userPswdConfirmValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
              <span
                class="error-field"
                :class="[userPswdConfirmdErrorMsg.length > 0 ? 'visible' : 'hidden']"
              >{{ userPswdConfirmdErrorMsg }}</span>
            </div>
            <div class="field-container">
              <div class="field-label">
                <span class="required">*</span>
                <span class="label">Sexe :</span>
                <select class="select" v-model="userGender" :class="[userGenderValid === 'error' ? 'error' : '', userGenderValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
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
                <span class="label">Tranche d'age :</span>
                <select class="select" v-model="userAgeRange" :class="[userAgeRangeValid === 'error' ? 'error' : '', userAgeRangeValid === 'valid' ? 'valid' : '']" v-on:keyup.13="sendForm()">
                  <option value="" hidden>Sélectionner une tranche d'âge</option>
                  <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 10)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+10)}} ans</option>
                  <option value="90+">90+ ans</option>
                </select>
              </div>
              <span
                class="error-field"
                :class="[userAgeRangeErrorMsg.length > 0 ? 'visible' : 'hidden']"
              >{{ userAgeRangeErrorMsg }}</span>
            </div>
            
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
                <span class="label">Langue maternelle :</span>
                
                <select class="select" v-model="selectedLanguage" v-on:keyup.13="sendForm()" :class="[selectedLanguageValid === 'error' ? 'error' : '', selectedLanguageValid === 'valid' ? 'valid' : '']">
                  <option value="" hidden>Sélectionner une langue maternelle</option>
                  <option v-for="country in countriesList" :key="country" :value="country" >{{country}}</option>
                </select>
              </div>
              <span
                class="error-field"
                :class="[selectedLanguageErrorMsg.length > 0 ? 'visible' : 'hidden']"
              >{{ selectedLanguageErrorMsg }}</span>
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
                <div @click="setMicrophone('smartphone')" class="micro-type-item" :class="[deviceType == 'smartphone' ? 'active' : '']">
                  <span class="icon smartphone"></span>
                  <span class="label">Smartphone</span>
                </div>
              </div>
            </div>
            <div class="field-container btn">
              <button class="button green large" @click="sendForm()">{{ btnCreateAccountLabel }}</button>
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
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      accountCreated: false,
      btnCreateAccountLabel: 'Créer un compte',
      countriesList: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
      createAccountStatus: '',
      createAccoutMsg: '',
      deviceType: 'default',
      formValid: false,
      language: 'français',
      nativeOn: true,
      redirectMessage: 'Vous allez être redirigé dans 3 secondes...',
      showCreateAccountModal: false,
      selectedLanguage: '',
      selectedLanguageValid: false,
      selectedLanguageErrorMsg: '',
      userName: '',
      userNameValid: false,
      userNameErrorMsg: '',
      userEmail: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      userPswd: '',
      userPswdValid: false,
      userPswdErrorMsg: '',
      userPswdConfirm: '',
      userPswdConfirmValid: false,
      userPswdConfirmdErrorMsg: '',
      userGender: '',
      userGenderValid: false,
      userGenderErrorMsg: '',
      userAgeRange: '',
      userAgeRangeValid: false,
      userAgeRangeErrorMsg: '',
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
    nativeOn: function (data) {
      if (data) {
        this.language = 'français'
      } 
    },
    selectedLanguage: function (data) {
      if (!this.nativeOn) {
        this.language = this.selectedLanguage
      }
    }
  },
  methods: {
    toggleNative () {
      this.nativeOn = !this.nativeOn
    },
    setMicrophone (selected) {
      this.deviceType = selected
    },
    closeModal () {
      this.showCreateAccountModal = false
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    backToLogin () {
      this.showCreateAccountModal = false
      bus.$emit('toggle_connection_modal', {})
    },
     sendForm () {
      this.formValid = this.checkForm()
      if (this.formValid) {
        this.showCreateAccountModal = false
        bus.$emit('show_policy_agreement', {})
      }
    },
    async createAccount () {
      if (this.formValid) {
        this.btnCreateAccountLabel = 'Création en cours...'
        const payload = {
          email: this.userEmail,
          userName: this.userName,
          pswd: this.userPswd,
          gender: this.userGender,
          deviceType: this.deviceType,
          userAgeRange: this.userAgeRange,
          language: this.language,
          nativeFrench: this.nativeOn
        }
        const createUser = await axios(`${process.env.VUE_APP_URL}/login/createUser`, {
          method: 'post',
          data: payload
        })
        this.createAccountStatus = createUser.data.status
        this.createAccoutMsg = createUser.data.msg
        if (createUser.data.code === 'userExist') {
          this.userNameValid = 'error'
          this.userNameErrorMsg = createUser.data.msg
        }
        if (createUser.data.status === 'success') {
          this.btnCreateAccountLabel = 'Succès'
          this.setCookie('wmu_user', createUser.data.userHash)
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
      } else {
        return
      }
    },
    checkForm () {
      // Email address
      if (this.userEmail.length === 0) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email'
      } else if (!this.validateEmail(this.userEmail)) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email valide'
      } else {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      }

      // User Name
      if (this.userName.length === 0) {
        this.userNameValid = 'error'
        this.userNameErrorMsg = 'Veuillez renseigner un nom d\'utilisateur'
      } else {
        this.userNameValid = 'valid'
        this.userNameErrorMsg = ''
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
      } else if (this.userPswdConfirm !== this.userPswd) {
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

      // Age range
      if (this.userAgeRange === '') {
        this.userAgeRangeValid = 'error'
        this.userAgeRangeErrorMsg = 'Veuillez sélectionner une tranche d\'âge'
      } else {
        this.userAgeRangeValid = 'valid'
        this.userAgeRangeErrorMsg = ''
      }

      // Native Language
      if (this.nativeOn) {
        this.selectedLanguage = 'français'
        this.language = this.selectedLanguage
        this.selectedLanguageValid = 'valid'
        this.selectedLanguageErrorMsg = ''
      } else if (this.selectedLanguage !== '') {
        this.selectedLanguageValid = 'valid'
        this.language = this.selectedLanguage
        this.selectedLanguageErrorMsg = ''
      } else {
        this.language = ''
        this.selectedLanguageValid = 'error'
        this.selectedLanguageErrorMsg = 'Veuillez sélectionner votre langue maternelle'
      }

      if (
        this.userNameValid === 'valid' &&
        this.userEmailValid === 'valid' &&
        this.userPswdValid === 'valid' &&
        this.userPswdConfirmValid === 'valid' &&
        this.userGenderValid === 'valid' &&
        this.selectedLanguageValid === 'valid' &&
        this.userAgeRangeValid === 'valid') {
        return true
      } else {
        return false
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
