<template>
  <div class="h-100">
    <div id="page-content">
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
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['userConnected'],
  methods: {
    navigate (e) {
      if (!this.userConnected.status) {
        bus.$emit('toggle_connection_modal', {})
      } else {
        const url = e.target.getAttribute('data-url')
        window.location.href = url
      }
    }
  }
}
</script>
