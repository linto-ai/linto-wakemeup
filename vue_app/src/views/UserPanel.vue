<template>
  <div>
    <div id="page-content">
      <div class="container-fluid">
        <div clas="row">
          <div class="col-5">
            <h3>Informations utilisateur</h3>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      userEmail: '',
      userEmailValid: false,
      userEmailErrorMsg: '',
      lastNameValid: false,
      lastNameErrorMsg: '',
      firstNameValid: false,
      firstNameErrorMsg: ''
    }
  },
  computed : {
    userInfos () {
      this.userEmail = this.$store.state.userInfos.email
      return this.$store.state.userInfos

    }
  },
  methods: {
    setMicrophone (data) {
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
      if(this.validateEmail(this.userEmail)){
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
      if (this.validateNames(this.userInfos.lastName) || this.userInfos.lastName.length === 0) {
        this.lastNameValid = 'valid'
        this.lastNameErrorMsg = ''
      } else {
        profilValid = false
        this.lastNameValid = 'error'
        this.lastNameErrorMsg = 'Veuillez saisir un Nom valide'
      }

      // check firstanme
       if (this.validateNames(this.userInfos.firstName) || this.userInfos.firstName.length === 0) {
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
      if(profilValid) {
        const updateUser = await axios(`${process.env.VUE_APP_URL}/api/updateUser`, {
          method: 'post',
          data: this.userInfos
        })

        console.log(updateUser)
      }
      else {
        return
      }
    }
  }

}
</script>