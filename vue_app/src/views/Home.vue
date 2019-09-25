<template>
  <div id="home">
    <div id="highlight" class="container-fluid">
      <div class="row">
        <div class="col talk">
          <h2>Enregistrez votre voix</h2>
          <div class="title-icon">
            <img src="/assets/img/talk.svg" alt="Parler">
          </div>
          <div
            class="highlight-content"
          >Participez à l'enregistrement de campagnes de mots-clés. Enregistrez votre voix de façon anonyme et créez des échantillons audio qui nous permettront d'enrichir et d'entraîner notre modèle de données.</div>
          <div class="highlight-action">
            <button data-url="/interface/record" @click="navigate($event)" class="button red">Enregistrez votre voix</button>
          </div>
        </div>
        <div class="col listen">
          <h2>Écoutez et participez à la validation</h2>
          <div class="title-icon">
            <img src="/assets/img/listen.svg" alt="Ecouter">
          </div>
          <div
            class="highlight-content"
          >Aidez-nous à confirmer la validité des échantillons audio créés par les utilisateurs. Écoutez ces échantillons et donnez-nous votre avis en nous indiquant si les mots-clés prononcés sont audibles et conformes aux consignes.</div>
          <div class="highlight-action">
            <button data-url="/interface/listen" @click="navigate($event)" class="button green">Écouter des enregistrements</button>
          </div>
        </div>
      </div>
    </div>
    <div class="divider red shadowTop"></div>
    <div class="container-fluid">
      <div class="row goal-container">
        <goalProgressBar></goalProgressBar>
      </div>
    </div>
    <div class="container home-infos">
      <div>
        <h3>A quoi servent les mots enregistrés ?</h3>
        <p>Les échantillons enregistrés servent à entraîner un modèle de détection de mots-clefs. Ce modèle est utilisé dans le cadre d’interfaces de commande vocales comme l’assistant LinTO.
        C’est le cas par exemple pour le mot-clef de réveil “LinTO”.</p>
      </div>

      <div>
        <h3>Pourquoi enregistrer des mots-clefs ?</h3>
        <p>Afin d’entraîner un système de détection des mots-clefs robuste qui fonctionne pour tout le monde avec des microphones différents dans des environnements sonores différents, il faut collecter un maximum d’échantillons dans des contextes variés.</p>
      </div>

      <div>
        <h3>Que deviennent les mots-clefs collectés ?</h3>
        <p>Les échantillons collectés une fois validés seront traités et normalisés. Une fois l’objectif de collecte atteint, ils seront regroupés dans un corpus qui sera publié sous licence libre pour en faire profiter la communauté OpenSource.</p>
      </div>

      <div>
        <h3>Mes informations personnelles sont-elles reliées aux échantillons ?</h3>
        <p>Les données sont anonymisées. Associés aux échantillons sont les informations de capture (microphone) et les caractéristiques du locuteurs (âge, sexe, origine) si elles sont renseignées. L’adresse email fournie n’est pas associée aux échantillons.</p>
      </div>

      <div>
        <h3>Puis-je changer d’avis et retirer mes enregistrements ?</h3>
        <p>Conformément au RGPD vous disposez d’un droit sur vos données et pouvez solliciter le retrait de celles-ci.</p>
      </div>
    </div>
  </div>
</template>
<script>
import goalProgressBar from '@/components/goalProgressBar.vue'
import { bus } from '../main.js'
export default {
  props: ['userConnected'],
  data () {
    return {}
  },
  methods: {
    navigate (e) {
      if (!this.userConnected.status) {
        bus.$emit('toggle_connection_modal', {})
      } else {
        const url = e.target.getAttribute('data-url')
        window.location.href = url
      }
    }
  },
  components: {
    goalProgressBar
  }
}
</script>
