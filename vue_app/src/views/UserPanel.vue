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
                    <input
                      type="text"
                      class="input"
                      v-model="userDatas.email.value"
                      :class="[
                        userDatas.email.error !== null ? 'error' : '',
                        userDatas.email.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleUpdateAccount()"

                    >
                    <span class="error-field" v-if="userDatas.email.error !== null">{{ userDatas.email.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Sexe :</td>
                  <td class="tab-input">
                    <select
                      class="select"
                       v-model="userDatas.gender.value"
                      :class="[
                        userDatas.gender.error !== null ? 'error' : '',
                        userDatas.gender.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleUpdateAccount()"
                    >
                      <option value="" hidden>Sélectionner un sexe</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                      <span class="error-field" v-if="userDatas.gender.error !== null">{{ userDatas.gender.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Type de microphone :</td>
                  <td class="tab-input">
                    <div class="micro-type-container">
                      <div class="micro-type-item" @click="setMicrophone('default')" :class="[userDatas.deviceType.value === 'default' ? 'active' : '']">
                        <span class="icon default"></span>
                        <span class="label">Micro par défaut</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('casque')" :class="[userDatas.deviceType.value === 'casque' ? 'active' : '']">
                        <span class="icon casque"></span>
                        <span class="label">Micro-casque</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('pied')" :class="[userDatas.deviceType.value === 'pied' ? 'active' : '']">
                        <span class="icon pied"></span>
                        <span class="label">Micro à pied</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('smartphone')" :class="[userDatas.deviceType.value === 'smartphone' ? 'active' : '']">
                        <span class="icon smartphone"></span>
                        <span class="label">Smartphone</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Tranche d'âge :</td>
                  <td class="tab-input">
                    <select
                      class="select"
                      v-model=" userDatas.ageRange.value"
                      :class="[
                        userDatas.ageRange.error !== null ? 'error' : '',
                        userDatas.ageRange.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleCreateAccount()"
                    >
                      <option value="" hidden>Sélectionner une tranche d'âge</option>
                      <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 10)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+10)}} ans</option>
                      <option value="90+">90+ ans</option>
                    </select>
                   <span class="error-field" v-if="userDatas.ageRange.error !== null">{{ userDatas.ageRange.error }}</span>
                  </td>
                </tr>

                <tr>
                  <td class="tab-label">Je suis français natif :</td>
                  <td class="tab-input">
                    <button class="custom-toggle-btn userpanel" @click="toggleNative()" :class="[userDatas.nativeFrench.value ? 'on': 'off']">
                        <span class="cursor" ></span>
                    </button>
                  </td>
                </tr>
                <tr v-if="!userDatas.nativeFrench.value">
                  <td class="tab-label">Langue maternelle :</td>
                  <td class="tab-input">
                    <select
                      class="select"
                      ref="languageSelectInput"
                      v-model="userDatas.language.value"
                      :class="[
                        userDatas.language.error !== null ? 'error' : '',
                        userDatas.language.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleCreateAccount()"
                    >
                      <option value="" hidden>Sélectionner une langue maternelle</option>
                      <option v-for="country in countriesList" :key="country" :value="country" :selected="country === userDatas.language" >{{country}}</option>
                    </select>
                     <span class="error-field" v-if="userDatas.language.error !== null">{{ userDatas.language.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;">
                    <button class="button green large" @click.prevent="handleUpdateAccount()">Mettre mes informations à jour</button>
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
                    <input
                      class="input"
                      type="password"
                      v-model="userPassword.oldPswd.value"
                      :class="[
                        userPassword.oldPswd.error !== null ? 'error' : '',
                        userPassword.oldPswd.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleUpdatePassword()"
                    />
                    <span class="error-field" v-if="userPassword.oldPswd.error !== null">{{ userPassword.oldPswd.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input
                      class="input"
                      type="password"
                      v-model="userPassword.newPswd.value"
                      :class="[
                        userPassword.newPswd.error !== null ? 'error' : '',
                        userPassword.newPswd.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleUpdatePassword()"
                    />
                    <span class="error-field" v-if="userPassword.newPswd.error !== null">{{ userPassword.newPswd.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Confirmation du nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input
                      type="password"
                      class="input"
                      v-model="userPassword.newPswdConfirm.value"
                      :class="[
                        userPassword.newPswdConfirm.error !== null ? 'error' : '',
                        userPassword.newPswdConfirm.valid ? 'valid' : ''
                      ]"
                      @keyup.13="handleUpdatePassword()"
                    />
                    <span class="error-field" v-if="userPassword.newPswdConfirm.error !== null">{{ userPassword.newPswdConfirm.error }}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;">
                    <button class="button red large" @click.prevent="handleUpdatePassword()">Modifier le mot de passe</button>
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
          <h2 v-if="!isAdmin">Supprimer mon compte</h2>
          <div v-if="!isAdmin" class="white-container">
            <button @click="deleteAccount(userInfos.userHash)" class="button red">Supprimer mon compte</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Chargement...</div>
    <DeleteAccountModal></DeleteAccountModal>
  </div>
</template>
<script>
import DeleteAccountModal from '@/components/DeleteAccountModal.vue'
import { required, email, minLength, alphaNum, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      isAdmin: false,
      dataLoaded: false,
      userDatas : {
        email: {
          value: '',
          error: null,
          valid: false
        },
        gender: {
          value: '',
          error: null,
          valid: false
        },
        ageRange: {
          value: '',
          error: null,
          valid: false
        },
        nativeFrench: {
          value: '',
          error: null,
          valid: false
        },
        language: {
          value: '',
          error: null,
          valid: false
        },
        deviceType: {
          value: '',
          error: null,
          valid: false
        },
        userHash: {
          value: '',
          error: null,
          valid: false
        }
      },
      userPassword: {
        oldPswd: {
          value: '',
          error: null,
          valid: false
        },
        newPswd: {
          value: '',
          error: null,
          valid: false
        },
        newPswdConfirm: {
          value: '',
          error: null,
          valid: false
        }
      },
      countriesList: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D\'Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
    }
  },
  created () {
    this.dispatchUser()
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    }
  },
  watch: {
    userInfos: function (data) {
      this.userDatas.email.value = data.email
      this.userDatas.gender.value = data.gender
      this.userDatas.ageRange.value = data.ageRange
      this.userDatas.nativeFrench.value = data.nativeFrench
      this.userDatas.language.value = data.language
      this.userDatas.deviceType.value = data.deviceType
      this.userDatas.userHash.value = data.userHash
      if (data.role === 'administrator') {
        this.isAdmin = true
      }
      this.dataLoaded = true
    },
    'userDatas.nativeFrench.value': function (data) {
      if (data) {
        this.userDatas.language.value = 'français'
      } else {
        this.userDatas.language.value = ''
      }
    },
    'userDatas.email.value': function (data) {
      this.userDatas.email.value = data.toLowerCase()
    }
  },
  methods: {
    toggleNative () {
      this.userDatas.nativeFrench.value = !this.userDatas.nativeFrench.value
    },
    setMicrophone (data) {
      this.userDatas.deviceType.value = data
    },
    resetError (obj) {
      for(let index in obj) {
        obj[index].error = null
        obj[index].valid = false
      }
      return obj
    },
    getPayload (obj) {
      let payload = {}
      for (let index in obj) {
        payload[index] = obj[index].value
      }
      return payload
    },
    /*** UPDATE USER INFOS  ***/
    async handleUpdateAccount () {
      let valid = true
      this.userDatas = this.resetError(this.userDatas)

      // Email
      if(!this.$options.filters.isRequired(this.userDatas.email)) {
        valid = false
        this.userDatas.email.error = 'Ce champ est requis'
      } else {
        const emailExist = await this.$options.filters.emailExist(this.userDatas.email.value)
        if(!this.$options.filters.isEmail(this.userDatas.email.value)) {
          valid = false
          this.userDatas.email.error = 'Le format de l\'adressse email saisie est invalide'
        } else if(emailExist.data.status === 'success' && this.userInfos.email !== this.userDatas.email.value) {
          valid = false
          this.userDatas.email.error = 'Cette adresse email est déjà utilisée'
        } else {
          this.userDatas.email.valid = true
        }
      }

      // Gender
      this.userDatas.gender = this.$options.filters.validateRequired(this.userDatas.gender)
      if(!this.userDatas.gender.valid ) {
        valid = false
      }
      // Age range
      this.userDatas.ageRange = this.$options.filters.validateRequired(this.userDatas.ageRange)
      if(!this.userDatas.ageRange.valid ) {
        valid = false
      }
      // Language
      this.userDatas.language = this.$options.filters.validateRequired(this.userDatas.language)
      if(!this.userDatas.language.valid ) {
        valid = false
      }

      // Send Form
      if (valid) {
        const payload = this.getPayload(this.userDatas)
        this.updateProfil(payload)
      }
    },
    async updateProfil (payload) {
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
        this.dispatchUser()
      }
    },
    /*** UPDATE USER PASSWORD  ***/
    async handleUpdatePassword () {
      this.userPassword = this.resetError(this.userPassword)
      let valid = true

      // Current password
      if (this.userPassword.oldPswd.value.length < 0) {
        valid = false
        this.userPassword.oldPSwd.error = "Ce champ est requis"
      } else {
        this.userPassword.oldPswd.valid = true
      }

      // New password
      if (this.userPassword.newPswd.length < 0) {
        valid = false
        this.userPassword.newPswd.error = "Ce champ est requis"
      } else if (this.userPassword.newPswd.value.length < 6) {
        valid = false
        this.userPassword.newPswd.error = "Le mot de passe doit contenu au moins 6 caractères"
      } else if (this.userPassword.newPswd.value === this.userPassword.oldPswd.value) {
        valid = false
        this.userPassword.newPswd.error = "Le nouveau mot de passe doit être différent de l'actuel"
      } else {
        this.userPassword.newPswd.valid = true
      }

      // New password Confirmation
      if (this.userPassword.newPswdConfirm.value.length === 0) {
        valid = false
        this.userPassword.newPswdConfirm.error = "Ce champ est requis"
      } else if (this.userPassword.newPswdConfirm.value !== this.userPassword.newPswd.value) {
        valid = true
        this.userPassword.newPswdConfirm.error = "Les deux mots de passes doivent être identiques"
      } else {
        this.userPassword.newPswdConfirm.valid = true
      }

      if (valid) {
        const payload = this.getPayload(this.userPassword)
        this.updatePswd(payload)
      }
    },
    async updatePswd (data) {
      const payload = {
        currentPswd: data.oldPswd,
        newPswd: data.newPswd,
        userHash: this.$session.get('cnxusr')
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
        this.dispatchUser()
        this.userPassword.oldPswd.value = ''
        this.userPassword.newPswd.value = ''
        this.userPassword.newPswdConfirm.value = ''
      } else {
        if(!!updatePswd.data.field) {
          if(updatePswd.data.field === 'currentPswd') {
            this.userPassword.oldPswd.error = updatePswd.data.msg
            this.userPassword.oldPswd.valid = false
          }
        } else {
          bus.$emit('notify_app', {
            status: 'error',
            msg: updatePswd.data.msg,
            redirect: false
          })
        }
      }
    },
    dispatchUser () {
      this.$store.dispatch('getUserInfos', this.$session.get('cnxusr')).then((resp) => {
        if(!!resp.error) {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
            redirect: false
          })
        }
      })
    },
    async deleteAccount (userHash) {
      bus.$emit('toggle_deleteAccount_modal', { userHash })
    }
  },
  components: {
    DeleteAccountModal
  }
}
</script>
