<template>
  <div class="h-100">
    <div id="page-content" >
      <div class="container-fluid" id="user-panel" v-if="isAdmin && scenariosLoaded" >
        <div class="row justify-content-around">
          <div class="col-xl-5 col-lg-6 col-md-12">
            <h2>Limite du nombre de votes</h2>
            <div class="white-container">
              <table class="user-panel-tab">
                <tbody>
                  <tr>
                    <td class="tab-label">Nombre de votes requis pour validation:</td>
                    <td class="tab-input">
                      <input class="input" type="number" id="voteLimit" :value="voteLimit" />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;">
                      <button class="button green large" @click="updateVoteLimit()">Confirmer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2>Ajouter un mot-clé</h2>
            <div class="white-container">
              <table class="user-panel-tab">
                  <tbody>
                    <tr>
                      <td class="tab-label">Mot-clé :</td>
                      <td class="tab-input">
                        <input class="input" type="text" v-model="wakeword" :class="[wakewordValid === 'error' ? 'error' : '', wakewordValid === 'valid' ? 'valid' : '']" v-on:keyup.13="addWakeword(wakeword, validationGoal)"/>
                        <span class="error-field" :class="[wakewordErrorMsg.length > 0 ? 'visible' : 'hidden']" >{{ wakewordErrorMsg }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="tab-label">Objectif (nombre de validations souhaitées) :</td>
                      <td class="tab-input">
                        <input
                          type="number"
                          class="input"
                          :class="[validationGoalError.length > 0 ? 'error': '']"
                          v-model="validationGoal"
                          v-on:keyup.13="addWakeword(wakeword, validationGoal)"
                          min="100"
                          step="100"
                        />
                        <span class="error-field" :class="[validationGoalError.length > 0 ? 'visible' : 'hidden']" >{{ validationGoalError }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top:10px;">
                        <button class="button green large" @click="addWakeword(wakeword, validationGoal)">Ajouter un mot-clé</button>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>
          <div class="col-xl-5 col-lg-6 col-md-12">
            <h2>Mots-clés existants</h2>
            <div class="white-container">
              <div v-for="ww in scenarios" :key="ww._id" class="ww-container">
                <span class="wakeword">{{ ww.wakeword }}</span>
                <div class="wakeword-info">
                  <span class="label listen">Ecoutes</span>
                  <span class="number listen">{{ww.nbListen}}</span>
                </div>
                <div class="wakeword-info">
                  <span class="label record">Enreg.</span>
                  <span class="number record">{{ww.nbRecord}}</span>
                </div>
                <div class="wakeword-info">
                  <updateGoalBtn :ww="ww"></updateGoalBtn>
                </div>
                <button class="delete-btn" @click="deleteWakeword(ww.wakeword)"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        Vous n'êtes pas autorisé à accéder à cette page <br/>
        <a href="/">Retour à la page d'accueil</a>
      </div>
    </div>
    <DeleteWakewordModal></DeleteWakewordModal>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
import updateGoalBtn from '@/components/updateGoalBtn.vue'
import DeleteWakewordModal from '@/components/DeleteWakewordModal.vue'
export default {
  data () {
    return {
      isAdmin: false,
      scenariosLoaded: false,
      wakeword: '',
      wakewordValid: false,
      wakewordErrorMsg: '',
      validationGoal: 100,
      validationGoalError: ''
    }
  },
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    },
    scenarios () {
      return this.$store.state.scenarios
    },
    voteLimit () {
      return this.$store.state.voteLimit
    }
  },
  created () {
    this.$store.dispatch('getScenarios').then((resp) => {
      // Error handler
      if (!!resp.error) {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
          redirect: false
        })
      } else {
        this.userConnected = true
      }
    })

  },
  mounted () {
    this.dispatchScenarios()
    this.dispatchVoteLimit()

    bus.$on('wakeword_deleted', () => {
      this.dispatchScenarios()
    })
    bus.$on('wakeword_updated', () => {
      this.dispatchScenarios()
    })

  },
  watch: {
    userInfos: function (data) {
      if (data.role === 'administrator') {
        this.isAdmin = true
      } else {
        this.isAdmin = false
      }
    },
    scenarios: function (data) {
      this.scenariosLoaded = true
    },
    validationGoal: function (data) {
      const regex = /^[0-9]*$/g
      if(regex.test(data)){
        this.validationGoal = parseInt(data)
      }
    }
  },
  methods: {
    validWakeword (wakeword, validationGoal) {
      let unused = true
      let valid = true

      // Test wakeword (unique ?)
      this.scenarios.map(s => {
        if (s.wakeword === wakeword) {
          unused = false
        }
      })
      if (!unused) {
        valid = false
        this.wakewordValid = 'error'
        this.wakewordErrorMsg = 'Ce mot-clé fait déjà parti du scénario d\'enregistrement'
        return false
      } else {
        this.wakewordValid = 'valid'
        this.wakewordErrorMsg = ''
      }

      // Test validationGoal
      if(typeof(validationGoal) !== 'number') {
        valid = false
        this.validationGoalError = 'Veuillez rentrer une valeur numérique.'
      }
      return valid
    },
    async addWakeword (wakeword, validationGoal) {
      if (this.validWakeword(wakeword, validationGoal)) {
        const addww = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
          method: 'post',
          data: {
            wakeword,
            validationGoal
           }
        })
        if (addww.data.addWakeword === 'success') {
          this.$store.dispatch('getScenarios').then((resp) => {
            // Error handler
            if (!!resp.error) {
              bus.$emit('notify_app', {
                status: 'error',
                msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
                redirect: false
              })
            } else {
              this.userConnected = true
            }
          })
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Mot-clé ajouté avec succès.',
            redirect: false
          })
        } else {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Erreur lors de l\'ajout du wakeword.',
            redirect: false
          })
        }
      }
    },
    deleteWakeword (data) {
      bus.$emit('show_deleteWakeWord_modal', { wakeword: data })
    },
    async updateVoteLimit () {
      const field = document.getElementById('voteLimit')
      const value = field.value
      const updateVoteLimit = await axios(`${process.env.VUE_APP_URL}/api/audios/vote/limit`, {
        method: 'put',
        data: { value }
      })
      bus.$emit('notify_app', {
        status: updateVoteLimit.data.status,
        msg: updateVoteLimit.data.msg,
        redirect: false
      })
      if (updateVoteLimit.data.status == 'success') {
        this.dispatchVoteLimit()
      }
    },
    dispatchVoteLimit () {
      this.$store.dispatch('getVoteLimit').then((resp) => {
        // Error handler
        if (!!resp.error) {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
            redirect: false
          })
        }
      })
    },
    dispatchScenarios () {
      this.$store.dispatch('getScenarios').then((resp) => {
        // Error handler
        if (!!resp.error) {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
            redirect: false
          })
        } else {
          this.userConnected = true
        }
      })
    }
  },
  components: {
    DeleteWakewordModal,
    updateGoalBtn
  }
}
</script>
