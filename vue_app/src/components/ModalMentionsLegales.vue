<template>
  <div>
    <div class="modal">
      <div class="modal-header flex row">
        <h2 class="flex1 modal-title">Mentions légales</h2>
        <button class="modal-close" @click="close()"></button>
      </div>
      <div class="modal-body">
          <h3>Hébergement</h3>
          <p>Le site web wakemeup.linto.ai est publié et hébergé par LINAGORA SAS, une société par actions simplifiée au capital de 1 552 980 €</p>
          <p>Siège social: Tour Franklin, 100 Terrasse Boieldieu, 92800 Puteaux, France</p>
          <p>SIRET: 431 473 669 00114</p>
          <p>Code APE: 6202 A</p>
          <p>Téléphone: +33 810 251 251</p>
          <h3>Directeur de la publication</h3>
          <p>M. Alexandre ZAPOLSKY, Président de LINAGORA</p>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main-onepage.js'
export default {
  data () {
    return {}
  },
  methods: {
    close () {
      bus.$emit('close_modal_legals', {})
    }
  }
}
</script>