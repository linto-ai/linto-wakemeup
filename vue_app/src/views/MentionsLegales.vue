<template>
  <div class="h-100">
    <div id="page-content">
      <div class="mentions-legales-container">
        <h1>Mentions légales - wakemeup.linto.ai</h1>
        <div class="white-container">
          <h2>Hébergement</h2>
          <p>Le site web <strong>wakemeup.linto.ai</strong> est publié et hébergé par: <br/><br/>
            <strong>LINAGORA SAS</strong>, une société par actions simplifiée au capital de 1 552 980 €<br/>
            Siège social: Tour Franklin, 100 Terrasse Boieldieu, 92800 Puteaux, France<br/>
            SIRET: 431 473 669 00114<br/>
            Code APE: 6202 A<br/>
            Téléphone: +33 810 251 251
          </p>

          <h2>Directeur de la publication</h2>
          <p><strong>M. Alexandre ZAPOLSKY</strong>, Président de LINAGORA</p>
          </div>
      </div>
      
    </div>
    <ConnectionModal></ConnectionModal>
    <CreateAccountModal></CreateAccountModal>
    <PolicyAgreementModal></PolicyAgreementModal>
  </div>
</template>
<script>
import ConnectionModal from '@/components/ConnectionModal.vue'
import CreateAccountModal from '@/components/CreateAccountModal.vue'
import PolicyAgreementModal from '@/components/PolicyAgreementModal.vue'
export default {
  data () {
    return {}
  }, 
  components: {
    ConnectionModal,
    CreateAccountModal,
    PolicyAgreementModal
  }
}
</script>
