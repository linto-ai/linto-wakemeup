<template>
  <div>
    <div class="flex col" id="wakemeup-infos">
      <div class="logo-container flex row">
          <img src="/assets/img/wakemeup-logo-white.svg" alt="logo wakemeup.linto.ai">
      </div>
      <div class="content">
        <h1>Enregistrez des échantillons audio</h1>
        <div class="important">
          <h3>Assurez-vous d’être dans un environnement calme</h3>
          <ul class="flex col">
            <li>Il peut il y avoir du bruit de fond (Bruit statique, ventilation, conversations lointaines, ...) si celui-ci est constant sur l’enregistrement et ne recouvre pas votre voix.</li>
            <li>Seule votre voix doit être audible.</li>
            <li>Seul les mots à enregistrer doivent être audibles.</li>
          </ul>
        </div>
      </div>
       <div class="important">
          <h3>Pour enregistrer votre voix</h3>
          <ul class="flex col">
            <li><strong>Remplissez le formulaire</strong> et renseignez votre sexe, votre tranche d'âge, et votre type de microphone pour pouvoir commencer les enregistrement</li>
            <li>Cliquez sur le bouton <span class="icon-record"></span> afin de commencer la captation. Un compte à rebours démarrera pour vous indiquer quand parler.</li>
            <li><strong>Prononcez la commande</strong>. La captation s'arrêtera automatiquement après avoir détecté un silence.</li>
            <li>Après avoir enregistré votre voix, vous pourrez <strong>réécouter</strong> votre enregistrement, et le recommencer si nécessaire.</li>
            <li>Si votre enregistrement vous semble pas valide, cliquez sur le bouton "<strong>valider</strong>" pour le confirmer et passer à un nouvel enregistrement.</li>
          </ul>
        </div>
        <div class="flex col btn-container">
          <button  class="flex1 flex row" id="userdata-btn" @click="showInfosModal=true">
            <span class="btn-icon"></span>
            <span class="btn-label">En savoir plus sur le traitement des données</span>
          </button>
          <a href="#recorder" class="flex1 goto-recorder"> 
            <span class="btn-icon"></span>
            <span class="btn-label">Commencer à enregistrer</span>
          </a>
        </div>
    </div>
    <div class="flex col" id="recorder">
      <div id="user-infos" class="flex col">
        <div id="user-infos-form" class="opened">
          <div class="flex col">
            <button class="toggle-user-infos" :class="recordAllowed ? '' : 'hidden'" @click="toggleUserInfos($event)"></button>
            <h2>Votre profil</h2>
          </div>
          <!-- Sexe -->
          <div class="flex col form-field">
            <span 
              class="form__label"
              :class="[user.gender.error !== null ? 'error' : '', user.gender.valid === true ? 'valid' : '']"
            >Sexe : {{user.gender.error !== null ? user.gender.error : ''}}</span>
            <div class="flex row radio">
              <input type="radio" v-model="user.gender.value" id="homme" value="homme" class="form__radio" @change="testField(user.gender)">
              <label for="homme" class="form__radio-label">Homme</label>
            </div>
            <div class="flex row radio">
              <input type="radio" v-model="user.gender.value" id="femme" value="femme" class="form__radio">
              <label for="femme" class="form__radio-label" @change="testField(user.gender)">Femme</label>
            </div>
          </div>
          <!-- Age -->
          <div class="flex col form-field">
            <span 
              class="form__label"
              :class="[user.age.error !== null ? 'error' : '', user.age.valid === true ? 'valid' : '']"
            >Tranche d'âge : {{user.age.error !== null ? user.age.error : ''}}</span> 
            <select class="form__select" v-model="user.age.value" @change="testField(user.age)">
              <option v-for="i in 8" :key="i" :value="parseInt(i*10) + '-' + parseInt((i*10) + 9)">{{parseInt(i*10) + ' - ' + parseInt((i*10)+9)}} ans</option>
              <option value="90+">90+ ans</option>
            </select>
          </div>
          <!-- Native french -->
          <div class="flex col form-field">
            <span 
              class="form__label"
              :class="[user.nativeFrench.error !== null ? 'error' : '', user.nativeFrench.valid === true ? 'valid' : '']"
            >Français (langue maternelle) : {{user.nativeFrench.error !== null ? user.nativeFrench.error : ''}}</span>
            <div class="flex row radio">
              <input type="radio" v-model="user.nativeFrench.value" id="native" :value="true" class="form__radio" @change="testField(user.nativeFrench)">
              <label for="native" class="form__radio-label">Oui</label>
            </div>
            <div class="flex row radio">
              <input type="radio" v-model="user.nativeFrench.value" id="notnative" :value="false" class="form__radio" @change="testField(user.nativeFrench)">
              <label for="notnative" class="form__radio-label">Non</label>
            </div>
          </div>
          <!-- Microphone -->
          <div class="flex col form-field">
            <span 
              class="form__label"
              :class="[user.mic.error !== null ? 'error' : '', user.mic.valid === true ? 'valid' : '']"
            >Type de microphone : {{user.mic.error !== null ? user.mic.error : ''}}</span>
            <div class="flex row radio">
              <input type="radio" v-model="user.mic.value" id="defaultmic" value="micDefault" class="form__radio" @change="testField(user.mic)">
              <label for="defaultmic" class="form__radio-label">Micro intégré (ordinateur portable)</label>
            </div>
            <div class="flex row radio">
              <input type="radio" v-model="user.mic.value" id="microcasque" value="micCasque" class="form__radio" @change="testField(user.mic)">
              <label for="microcasque" class="form__radio-label">Micro-casque</label>
            </div>
            <div class="flex row radio">
              <input type="radio" v-model="user.mic.value" id="micropied" value="micExterne" class="form__radio" @change="testField(user.mic)">
              <label for="micropied" class="form__radio-label">Micro externe (filaire, micro à pied...)</label>
            </div>
            <div class="flex row radio">
              <input type="radio" v-model="user.mic.value" id="micmobile" value="micSmartphone" class="form__radio" @change="testField(user.mic)">
              <label for="micmobile" class="form__radio-label">Smartphone</label>
            </div>
          </div>
          <!-- Submit -->
          <div class="flex row form-field">
            <button class="form__submit" @click="handleForm()">Enregistrer</button>
          </div>
        </div>
      </div>
      <div class="flex col recorder-container" >
        <Recorder :user="user" :recordAllowed="recordAllowed" :showRecorder="showRecorder" :isVerticalDesign="isVerticalDesign"></Recorder>
      </div>
    </div>
    <!-- Modal informations données peronnelles -->
    <div id="modal-infos" class="modal-wrapper flex row" :class="showInfosModal ? 'visible': 'hidden'">
      <div class="modal">
        <div class="modal-header flex row">
          <h2 class="flex1 modal-title">Traitement des données</h2>
          <button @click="showInfosModal=false" class="modal-close"></button>
        </div>
        <div class="modal-body">
            <p>Participez à l'enregistrement de campagnes de mots-clés. Enregistrez votre voix de façon anonyme et créez des échantillons audios qui nous permettront d'enrichir et d'entraîner notre modèle de données.</p>

            <h3>A quoi servent les mots enregistrés ?</h3>
            <p>Les échantillons enregistrés servent à entraîner un modèle de détection de mots-clefs. Ce modèle est utilisé dans le cadre d’interfaces de commandes vocales comme l’assistant LinTO. C’est le cas par exemple pour le mot-clef de réveil “LinTO”.</p>

            <h3>Pourquoi enregistrer des mots-clefs ?</h3>
            <p>Afin d’entraîner un système de détection des mots-clefs robuste qui fonctionne pour tout le monde avec des microphones différents dans des environnements sonores différents. Il nous faut collecter un maximum d’échantillons dans des contextes variés.</p>

            <h3>Que deviennent les mots-clefs collectés ?</h3>
            <p>Les échantillons collectés une fois validés seront traités et normalisés. Une fois l’objectif de collecte atteint, ils seront regroupés dans un corpus qui sera publié sous licence libre pour en faire profiter la communauté OpenSource.</p>

            <h3>Mes informations personnelles sont-elles reliées aux échantillons ?</h3>
            <p>Les données sont anonymisées. Sont associés aux échantillons les informations de capture (type de microphone) et les caractéristiques du locuteur (tranche d'âge, sexe, origine).</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Recorder from '@/components/SingleRecorder.vue'
import { bus } from '../main-onepage.js'
export default {
  data(){
    return {
        showRecorder: false,
       user :{
         gender: {
           value: '',
           error: null,
           valid: false
         },
         age: {
           value: '',
           error: null,
           valid: false
         }, 
         mic: {
           value: '',
           error: null,
           valid: false
         }, 
        nativeFrench: {
          value: true,
           error: null,
           valid: true
        }
      },
      recordAllowed: false,
      showInfosModal: false,
      showLegalsModal: false,
      screenWidth: 0
      
    }
  },
  mounted () {
    this.screenWidth = window.innerWidth
    window.onresize = () => {
      this.screenWidth = window.innerWidth
    },
    bus.$on('scrolldown', () => {
      this.scrollToRecorder()
    })
  },
  computed: {
    isVerticalDesign () {
      return this.screenWidth <= 1024
    },
    formValid () {
      return (this.user.gender.valid && this.user.age.valid && this.user.mic.valid && this.user.nativeFrench.valid)
    }
  },
  methods: {
    handleForm () {
      this.testField(this.user.gender)
      this.testField(this.user.age)
      this.testField(this.user.mic)
      this.testField(this.user.nativeFrench)

      if (this.formValid) {
        this.recordAllowed = true
        const userForm = document.getElementById('user-infos-form')
        userForm.classList.remove('opened')
        userForm.classList.add('closed')
        this.openRecorder()
         
      } 
    },
    testField (obj) {
      //test age range
      if(obj.value === null || obj.value.length === 0) {
        obj.error = 'Ce champ est requis'
        obj.valid = false
      } else {
        obj.valid = true
        obj.error = null
      }
    },
    toggleUserInfos (e) {
      const btn = e.srcElement
      const userForm = document.getElementById('user-infos-form')
      if(userForm.classList.contains('opened')) {
        userForm.classList.remove('opened')
        userForm.classList.add('closed')
        btn.classList.remove('opened')
        btn.classList.add('closed')
        this.openRecorder()
      } else {
        this.closeRecorder()
        setTimeout(() => {
          userForm.classList.add('opened')
          userForm.classList.remove('closed')
          btn.classList.add('opened')
          btn.classList.remove('closed')
        }, 300)
      }
      if(this.isVerticalDesign) {
        setTimeout(()=> {
          window.location.hash = '#recorder'
        }, 500)
      }
    },
    openRecorder () {
      setTimeout(()=>{
        this.showRecorder = true
      }, 300)
      if(this.isVerticalDesign) {
          this.scrollToRecorder()
      }
    },
    closeRecorder () {
      this.showRecorder = false
      if(this.isVerticalDesign) {
          this.scrollToRecorder()
      }
    },
    scrollToRecorder () {
      setTimeout(()=> {
        const appwrapper = document.getElementById('app-wrapper')
        const offset = document.getElementById('wakemeup-infos').offsetHeight + document.getElementById('recorder').offsetHeight + 200
/*        appwrapper.scroll(0, offset)*/

          appwrapper.scrollTo({
            top: offset,
            behavior: 'smooth' // smooth scroll
          });
      }, 500)
    }
  },
  components: {
    Recorder
  }
}
</script>