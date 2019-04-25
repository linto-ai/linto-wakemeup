<template>
  <div>
    <div class="modal" :class="[showPolicyModal ? 'visible' : 'hidden']">
      <div class="modal-container large">
        <div class="modal-header">
          <h3 class="modal-title red">Politique de traitement des données</h3>
        </div>
        <div class="modal-body">
          <h3>Données enregistrées</h3>
          <p>En créant un compte sur wakemeup.linto.ai, nous vous demandons de renseigner un certain nombre de données personnelles, telles que: votre adresse email, votre sexe, votre tranche d'âge, votre langue maternelle et votre type de microphone.</p>
          <p>Ces données nous servirons à apporter des précisions techniques lors de l'études des échanttillons audios ou la création de coprus de mots-clés.</p>
          <p>Nous nous engageons à récolter ces données de manières totalement anonymes, c'est à dire: </p>
          <ul>
            <li>Votre adresse email ne sera jamais rattachée un échantillon audio dans notre model de données</li>
            <li>Votre adresse email servira uniquement à vous transmettre un nouveau mot de passe en cas de perte de ce dernier</li>
            <li>À la création de votre compte, une clé unique d'identifiant sera créée et rattachée aux fichiers audios que vous aurez enregistré. Cette clé ne vous identifie pas personnelement. Dans le cas ou vous souhaitez supprimer vos données personnelle de notre site web, elle nous permettra de <i>supprimer les fichiers audios</i> (<a href="#">Lien vers les conditions de suppressions des fichiers audios</a>) que vous aurez enregisté.</li>
            <li>A compléter ... </li>
          </ul>

          <h3>Utilisation des fichiers audios</h3>
          <p>A compléter ...</p>
        </div>
        <div class="modal-footer">
          <button class="button red" @click="sendAgreement(false)">Refuser</button>
          <button class="button green" @click="sendAgreement(true)">Accpeter</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { bus } from '../main.js'
export default {
  data () {
    return {
      showPolicyModal: false
    }
  },
  mounted () {
    bus.$on('show_policy_agreement', () => {
      this.showPolicyModal = true
    })
  },
  methods: {
    sendAgreement (data) {
      bus.$emit('policy_agreement_response', data)
      this.showPolicyModal = false
    }
  }
}
</script>
