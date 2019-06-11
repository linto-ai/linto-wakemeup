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
                      v-model="userPrivateDatas.email"
                      :class="{error: $v.userPrivateDatas.email.$error, valid: !$v.userPrivateDatas.email.$invalid}"
                      @blur="$v.userPrivateDatas.email.$touch()"
                      @keyup.13="updateProfil($v)"
                    >
                    <span class="error-field" v-if="!$v.userPrivateDatas.email.required">Ce champ est obligatoire</span>
                    <span class="error-field" v-if="!$v.userPrivateDatas.email.email">Le format de l'adresse email est invalide</span>

                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Sexe :</td>
                  <td class="tab-input">
                    <select
                      class="select"
                      v-model="userPrivateDatas.gender"
                      @change="$v.userPrivateDatas.gender.$touch()"
                      :class="{error: $v.userPrivateDatas.gender.$error, valid:!$v.userPrivateDatas.gender.$invalid}"
                      v-on:keyup.13="updateProfil($v)"
                    >
                      <option value="" hidden>Sélectionner un sexe</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                    <span class="error-field" v-if="$v.userPrivateDatas.gender.$error">Veuillez sélectionner un sexe</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Type de microphone :</td>
                  <td class="tab-input">
                    <div class="micro-type-container">
                      <div class="micro-type-item" @click="setMicrophone('default')" :class="[userPrivateDatas.deviceType === 'default' ? 'active' : '']">
                        <span class="icon default"></span>
                        <span class="label">Micro par défaut</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('casque')" :class="[userPrivateDatas.deviceType === 'casque' ? 'active' : '']">
                        <span class="icon casque"></span>
                        <span class="label">Micro-casque</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('pied')" :class="[userPrivateDatas.deviceType === 'pied' ? 'active' : '']">
                        <span class="icon pied"></span>
                        <span class="label">Micro à pied</span>
                      </div>
                      <div class="micro-type-item" @click="setMicrophone('smartphone')" :class="[userPrivateDatas.deviceType === 'smartphone' ? 'active' : '']">
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
                      v-model="userPrivateDatas.ageRange"
                      :class="{error: $v.userPrivateDatas.ageRange.$error, valid:!$v.userPrivateDatas.ageRange.$invalid}"
                      v-on:keyup.13="updateProfil($v)"
                    >
                      <option value="" hidden>Sélectionner une tranche d'âge</option>
                      <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 10)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+10)}} ans</option>
                      <option value="90+">90+ ans</option>
                    </select>
                    <span class="error-field" v-if="$v.userPrivateDatas.ageRange.$error">Veuillez sélectionner une tranche d'âge</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Je suis français natif :</td>
                  <td class="tab-input">
                    <button class="custom-toggle-btn userpanel" @click="toggleNative()" :class="[userPrivateDatas.nativeFrench ? 'on': 'off']">
                        <span class="cursor" ></span>
                    </button>
                  </td>
                </tr>
                <tr v-if="!userPrivateDatas.nativeFrench">
                  <td class="tab-label">Langue maternelle :</td>
                  <td class="tab-input">
                    <select
                      class="select"
                      ref="languageSelectInput"
                      v-model="userPrivateDatas.language"
                      :class="{error: $v.userPrivateDatas.language.$error, valid:!$v.userPrivateDatas.language.$invalid}"
                      @keyup.13="updateProfil($v)"
                      @change="$v.userPrivateDatas.language.$touch()"
                    >
                      <option value="" hidden>Sélectionner une langue maternelle</option>
                      <option v-for="country in countriesList" :key="country" :value="country" :selected="country === userPrivateDatas.language" >{{country}}</option>
                    </select>
                    <span class="error-field" v-if="$v.userPrivateDatas.language.$error">Veuillez sélectionner une langue maternelle</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;">
                    <button class="button green large" @click.prevent="updateProfil($v)">Mettre mes informations à jour</button>
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
                      v-model="userPassword.oldPswd"
                      :class="{error: $v.userPassword.oldPswd.$error, valid: !$v.userPassword.oldPswd.$invalid}"
                      @blur="$v.userPassword.oldPswd.$touch()"
                      @:keyup.13="updatePswd($v)"
                    />
                    <span class="error-field" v-if="!$v.userPassword.oldPswd.required">Ce champ est obligatoire</span>
                    <span class="error-field" v-if="userPassword.oldPswd.length > 0 && !$v.userPassword.oldPswd.isValid">Le mot de passe saisi est incorrect</span>

                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input
                      class="input"
                      type="password"
                      v-model="userPassword.newPswd"
                      :class="{error: $v.userPassword.newPswd.$error, valid: !$v.userPassword.newPswd.$invalid}"
                      @blur="$v.userPassword.newPswd.$touch()"
                      @:keyup.13="updatePswd($v)"
                    />
                    <span class="error-field" v-if="!$v.userPassword.newPswd.required">Ce champ est obligatoire</span>
                  </td>
                </tr>
                <tr>
                  <td class="tab-label">Confirmation du nouveau mot de passe :</td>
                  <td class="tab-input">
                    <input
                      type="password"
                      class="input"
                      v-model="userPassword.newPswdConfirm"
                      :class="{error: $v.userPassword.newPswdConfirm.$error, valid: !$v.userPassword.newPswdConfirm.$error && userPassword.newPswdConfirm.length > 0}"
                      @blur="$v.userPassword.newPswdConfirm.$touch()"
                      @keyup.13="updatePswd($v)"
                    >
                    <span class="error-field" v-if="userPassword.newPswdConfirm.length > 0 && !$v.userPassword.newPswdConfirm.sameAsNewPswd">Le mot de passe de confirmation est différent du mot de passe saisi.</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:10px;">
                    <button class="button red large" @click.prevent="updatePswd($v)">Modifier le mot de passe</button>
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
                  <span class="number talk">{{ userStore.nbRecord }}</span>
                </div>
                <a href="/interface/record" class="button red">S'enregistrer</a>
              </div>
              <div class="col user-stats">
                <h3>Mots-clés écoutés</h3>
                <div class="stats-container">
                  <span class="icon listen"></span>
                  <span class="number listen">{{ userStore.nbListen }}</span>
                </div>
                <a href="/interface/listen" class="button green">Écouter</a>
              </div>
            </div>
          </div>
          <h2 v-if="!isAdmin">Supprimer mon compte</h2>
          <div v-if="!isAdmin" class="white-container">
            <button @click="deleteAccount(userPrivateDatas.userHash)" class="button red">Supprimer mon compte</button>
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
      userPrivateDatas : {
        email: '',
        gender: '',
        ageRange: '',
        nativeFrench: '',
        language: '',
        deviceType: '',
        userHash: ''
      },
      userPassword: {
        oldPswd: '',
        newPswd: '',
        newPswdConfirm: '',
        userHash: ''
      },
      selectedLanguage: '',
      dataLoaded: false,
      countriesList: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
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
  validations: {
    userPrivateDatas: {
      email: {
        required,
        email
      },
      gender: {
        required
      },
      ageRange: {
        required
      },
      language: {
        required
      }
    },
    userPassword: {
      oldPswd: {
        required,
        isValid: async (val, observer) => {
          const pswdUser = await axios(`${process.env.VUE_APP_URL}/api/user/pswdcheck`, {
            method: 'post',
            data: {
              pswd: val,
              userHash: observer.userHash
            }
          })
          if (pswdUser.data.status === 'success') {
            return true
          }
          return false
        }
      },
      newPswd: {
        required,
        minLength: minLength(6)
      },
      newPswdConfirm: {
        sameAsNewPswd: sameAs(vm => {
          return vm.newPswd
        })
      }
    }
  },
  watch: {
    userStore: function (data) {
      this.selectedLanguage = data.language
      this.userPrivateDatas = {
        email: data.email,
        gender: data.gender,
        ageRange: data.ageRange,
        nativeFrench: data.nativeFrench,
        language: this.selectedLanguage,
        deviceType: data.deviceType,
        userHash: data.userHash
      }
      this.userPassword.userHash = data.userHash
      if (data.role === 'administrator') {
        this.isAdmin = true
      }
      if (!this.dataLoaded) {
        this.dataLoaded = true
      }
    },
    'userPrivateDatas.nativeFrench': function (data) {
      if (data) {
        this.selectedLanguage = 'français'
      } else {
        this.selectedLanguage = ''
      }
    },
    selectedLanguage: function (data) {
      this.userPrivateDatas.language = data
    },
    'userPrivateDatas.email': function (data) {
      this.userPrivateDatas.email = data.toLowerCase()
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
    toggleNative () {
      this.userPrivateDatas.nativeFrench = !this.userPrivateDatas.nativeFrench
    },
    setMicrophone (data) {
      this.userPrivateDatas.deviceType = data
    },
    async updateProfil (validator) {
      validator.userPrivateDatas.$touch()
      if (!validator.userPrivateDatas.$error) {
        let payload = this.userPrivateDatas
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
          this.$store.dispatch('getUserInfos', this.userPrivateDatas.userHash)
        }
      }
    },
    async updatePswd (validator) {
      validator.userPassword.$touch()
      if (!validator.userPassword.$error) {
        const payload = {
          currentPswd: this.userPassword.oldPswd,
          newPswd: this.userPassword.newPswd,
          userHash: this.userPrivateDatas.userHash
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
          this.$store.dispatch('getUserInfos', this.userPrivateDatas.userHash)
        }
      }
    },
    async deleteAccount(userHash) {
      bus.$emit('toggle_deleteAccount_modal', { userHash })
    }
  },
  components: {
    DeleteAccountModal
  }
}
</script>
