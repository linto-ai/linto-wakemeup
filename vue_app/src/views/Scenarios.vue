<template>
  <div id="page-content" >
    <div class="container-fluid" id="user-panel" v-if="isAdmin && scenariosLoaded" >
      <div class="row justify-content-around">
        <div class="col-5">
          <h2>Ajouter un wakeword</h2>
          <div class="white-container">
            <table class="user-panel-tab">
                <tbody>
                  <tr>
                    <td class="tab-label">Wakeword :</td>
                    <td class="tab-input">
                      <input class="input" v-model="wakeword" :class="[wakewordValid === 'error' ? 'error' : '', wakewordValid === 'valid' ? 'valid' : '']"/>
                      <span class="error-field" :class="[wakewordErrorMsg.length > 0 ? 'visible' : 'hidden']">{{ wakewordErrorMsg }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top:10px;">
                      <button class="button green large" @click="addWakeword(wakeword)">Ajouter un wakeword</button>
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
        <div class="col-5">
          <h2>Wakewords existants</h2>
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
    <DeleteWakewordModal></DeleteWakewordModal>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
import DeleteWakewordModal from '@/components/DeleteWakewordModal.vue'
export default {
  data () {
    return {
      isAdmin: false,
      scenariosLoaded: false,
      wakeword: '',
      wakewordValid: false,
      wakewordErrorMsg : ''
    }
  }, 
  computed: {
    userInfos () {
      return this.$store.state.userInfos
    }, 
    appStats () {
      return this.$store.state.appStats
    },
    scenarios () {
      return this.$store.state.scenarios
    }
  },
  created () {
    this.$store.dispatch('getScenarios').then((resp) => {}, error => {
      console.error('error:', err)
    })
  },
  mounted () {
      bus.$on('wakeword_deleted', () => {
        this.$store.dispatch('getScenarios')
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
      if (data.length > 0) {
        this.scenariosLoaded = true
      }
    }
  },
  methods: {
    validWakeword (wakeword) {
      let unused = true
      this.scenarios.map(s => {
        if (s.wakeword === wakeword) {
          unused = false
        }
      })
      if (!unused) {
        this.wakewordValid = 'error'
        this.wakewordErrorMsg = 'Ce wakeword fais déjà parti du scénario d\'enregistrement'
        return false
      } else {
        this.wakewordValid = 'valid'
        this.wakewordErrorMsg = ''
        return true
      }
    },
    async addWakeword (data) {
      if (this.validWakeword(data)) {
        const addww = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
          method: 'post', 
          data: { wakeword: data }
        })
        if (addww.data.addWakeword === 'success') {
          this.$store.dispatch('getScenarios')
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Wakeword ajouté avec succès.',
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
      bus.$emit('show_deleteWakeWord_modal', {wakeword: data})
    }
  },
  components: {
    DeleteWakewordModal
  }
}
</script>
