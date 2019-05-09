<template>
  <div id="page-content" class="h-100" >
    <div class="container-fluid" id="user-panel" v-if="dataLoaded">
      <div class="row justify-content-around">
        <div class="col-xl-6 col-lg-7 col-md-12">
          <h2>Informations utilisateur</h2>
          <div class="white-container">
            <table class="user-panel-tab">
              <tbody>
                <tr>
                  <td class="tab-label">Adresse email :</td>
                  <td class="tab-input">
                    <input type="text" class="input" v-model="userInfos.email"  :class="[userEmailValid === 'error' ? 'error' : '', userEmailValid === 'valid' ? 'valid' : '']" />
                    <span class="error-field" :class="[userEmailErrorMsg.length > 0 ? 'visible' : 'hidden']" >{{ userEmailErrorMsg }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Sexe :</td>
                  <td class="tab-input">
                    <select class="select" v-model="userInfos.gender" v-on:keyup.13="updateProfil()" :class="[userGenderValid === 'error' ? 'error' : '', userGenderValid === 'valid' ? 'valid' : '']">
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                    <span class="error-field" :class="[userGenderErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ userGenderErrorMsg }}</span>
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
                      <div class="micro-type-item" @click="setMicrophone('smartphone')" :class="[userInfos.deviceType === 'smartphone' ? 'active' : '']">
                        <span class="icon smartphone"></span>
                        <span class="label">Smartphone</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Tranche d'âge :</td>
                  <td class="tab-input">
                    <select class="select" v-model="userInfos.ageRange" v-on:keyup.13="updateProfil()" :class="[userAgeRangeValid === 'error' ? 'error' : '', userAgeRangeValid === 'valid' ? 'valid' : '']">
                      <option value="" hidden>Sélectionner une tranche d'âge</option>
                      <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 10)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+10)}} ans</option>
                      <option value="90+">90+ ans</option>
                    </select>
                    <span class="error-field" :class="[userAgeRangeErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ userAgeRangeErrorMsg }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Je suis français natif :</td>
                  <td class="tab-input">
                    <button class="custom-toggle-btn userpanel" @click="toggleNative()" :class="[nativeFrench ? 'on': 'off']">
                        <span class="cursor" ></span>
                    </button>
                  </td>
                </tr>
                <tr v-if="!nativeFrench">
                  <td class="tab-label">Je suis français natif :</td>
                  <td class="tab-input">
                    <select class="select" v-model="selectedLanguage" v-on:keyup.13="updateProfil()" :class="[selectedLanguageValid === 'error' ? 'error' : '', selectedLanguageValid === 'valid' ? 'valid' : '']">
                      <option value="" hidden>Sélectionner une langue maternelle</option>
                      <option v-for="country in countriesList" :key="country" :value="country" >{{country}}</option>
                    </select>
                      <span class="error-field" :class="[selectedLanguageErrorMsg.length > 0 ? 'visible' : 'hidden']" >{{ selectedLanguageErrorMsg }}</span>
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
                    <input class="input" type="password" v-model="currentPswd"  :class="[currentPswdValid === 'error' ? 'error' : '', currentPswdValid === 'valid' ? 'valid' : '']" v-on:keyup.13="updatePswd()"/>
                    <span class="error-field" :class="[currentPswdErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ currentPswdErrorMsg }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input class="input" type="password" v-model="newPswd"  :class="[newPswdValid === 'error' ? 'error' : '', newPswdValid === 'valid' ? 'valid' : '']" v-on:keyup.13="updatePswd()"/>
                    <span class="error-field" :class="[newPswdErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ newPswdErrorMsg }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Confirmation du nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input class="input" type="password" v-model="newPswdConfirm"  :class="[newPswdConfirmValid === 'error' ? 'error' : '', newPswdConfirmValid === 'valid' ? 'valid' : '']" v-on:keyup.13="updatePswd()"/>
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
        <div class="col-xl-5 col-lg-5 col-md-12">
          <h2>Statistiques</h2>
          <div class="white-container">
            <div class="row">
              <div class="col user-stats">
                <h3>Mots-clés enregistrés</h3>
                <div class="stats-container">
                  <span class="icon talk"></span>
                  <span class="number talk">{{ userInfos.nbRecord }}</span>
                </div>
                <a href="/interface/record" class="button red">S'enregistrer</a>
              </div>
              <div class="col user-stats">
                <h3>Mots-clés écoutés</h3>
                <div class="stats-container">
                  <span class="icon listen"></span>
                  <span class="number listen">{{ userInfos.nbListen }}</span>
                </div>
                <a href="/interface/listen" class="button green">Écouter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Chargement...</div>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      currentPswd: '',
      currentPswdValid: false,
      currentPswdErrorMsg: '',
      newPswd: '',
      newPswdValid: false,
      newPswdErrorMsg: '',
      newPswdConfirm: '',
      newPswdConfirmValid: false,
      newPswdConfirmErrorMsg: '',
      nativeFrench: false,
      selectedLanguage: '',
      selectedLanguageValid: true,
      selectedLanguageErrorMsg: '',
      dataLoaded: false,
      countriesList: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
      userGenderValid: false,
      userGenderErrorMsg: '',
      userAgeRangeValid: false,
      userAgeRangeErrorMsg: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      userInfos: null
    }
  },
  created () {
    const userCookie = this.getCookie('wmu_user')
    this.$store.dispatch('getUserInfos', userCookie).then((resp) => {}, error => {
      console.error('error:', err)
    })
  },
  computed: {
    userStore () {
      return this.$store.state.userInfos
    }
  },
  watch: {
    userStore: function (data) {
      if (!this.dataLoaded) {
        this.userInfos = data
        this.dataLoaded = true
      }
    },
    userInfos: function (data) {
      this.nativeFrench = data.nativeFrench
      if (this.nativeFrench === false) {
        this.selectedLanguage = data.language
        this.language = this.selectedLanguage
      }
    },
    nativeFrench: function (data) {
      if (data) {
        this.selectedLanguage = 'français'
      } else {
        this.selectedLanguage = ''
      }
    }
  },
  methods: {
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    validateEmail (email) {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    },
    toggleNative () {
      this.nativeFrench = !this.nativeFrench
    },
    setMicrophone (data) {
      this.userInfos.deviceType = data
    },
    checkProfil () {
      let profilValid = true

      // Email address
      if (this.userInfos.email.length === 0) {
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email'
        profilValid = false
      } else if (!this.validateEmail(this.userInfos.email)){
        this.userEmailValid = 'error'
        this.userEmailErrorMsg = 'Veuillez renseigner une adresse email valide'
        profilValid = false
      } else {
        this.userEmailValid = 'valid'
        this.userEmailErrorMsg = ''
      }

      // Gender
      if (this.userInfos.gender === '') {
        this.userGenderValid = 'error'
        this.userGenderErrorMsg = 'Veuillez sélectionner un sexe'
        profilValid = false
      } else {
        this.userGenderValid = 'valid'
        this.userGenderErrorMsg = ''
      }

      // Age range
      if (this.userInfos.ageRange === '') {
        this.userAgeRangeValid = 'error'
        this.userAgeRangeErrorMsg = 'Veuillez sélectionner une tranche d\'âge'
        profilValid = false
      } else {
        this.userAgeRangeValid = 'valid'
        this.userAgeRangeErrorMsg = ''
      }

      // Native Language
      if (this.nativeFrench) {
        this.selectedLanguage = 'français'
        this.language = this.selectedLanguage
        this.selectedLanguageValid = 'valid'
        this.selectedLanguageErrorMsg = ''
      } else if (this.selectedLanguage !== '') {
        this.selectedLanguageValid = 'valid'
        this.language = this.selectedLanguage
        this.selectedLanguageErrorMsg = ''
      } else {
        profilValid = false
        this.selectedLanguage = ''
        this.language = this.selectedLanguage
        this.selectedLanguageValid = 'error'
        this.selectedLanguageErrorMsg = 'Veuillez sélectionner votre langue maternelle'
      }
      return profilValid
    },
    async updateProfil () {
      const profilValid = this.checkProfil()
      if (profilValid) {
        let payload = this.userInfos
        payload.nativeFrench = this.nativeFrench
        payload.language = this.language
        const updateUser = await axios(`${process.env.VUE_APP_URL}/api/user`, {
          method: 'put',
          data: payload
        })
        if (updateUser.data.status === 'success') {
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Vos informations ont été mises à jour',
            redirect: false
          })
          this.$store.dispatch('getUserInfos', this.userInfos.userHash)
        }
      }
    },
    checkPswd () {
      let pswdFormValid = true

      // check current password
      if (this.currentPswd.length === 0) {
        pswdFormValid = false
        this.currentPswdValid = 'error'
        this.currentPswdErrorMsg = 'Veuillez saisir votre mot de passe actuel'
      } else {
        this.currentPswdValid = 'valid'
        this.currentPswdErrorMsg = ''
      }

      // check new password
      if (this.newPswd.length === 0) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Veuillez saisir un nouveau mot de passe'
      } else if (this.newPswd === this.currentPswd) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Le nouveau mot de passe doit être différent de l\'actuel'
      } else if (this.newPswd.length < 8) {
        pswdFormValid = false
        this.newPswdValid = 'error'
        this.newPswdErrorMsg = 'Votre mot de passe doit contenir au moins 8 caractères'
      } else {
        this.newPswdValid = 'valid'
        this.newPswdErrorMsg = ''
      }

      // check new password confirm
      if (this.newPswdConfirm.length === 0) {
        pswdFormValid = false
        this.newPswdConfirmValid = 'error'
        this.newPswdConfirmErrorMsg = 'Veuillez confirmer votre nouveau mot de passe'
      } else if (this.newPswdConfirm !== this.newPswd) {
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
          userHash: this.userInfos.userHash
        }
        const updatePswd = await axios(`${process.env.VUE_APP_URL}/api/user/pswd`, {
          method: 'put',
          data: payload
        })
        if (updatePswd.data.status === 'success') {
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Votre mot de passe a été modifié',
            redirect: false
          })
          this.$store.dispatch('getUserInfos', this.userInfos.userHash)
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
      }
    }
  }
}
</script>
