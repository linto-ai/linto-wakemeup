<template>
  <div class="h-100">
    <div id="page-content">
      <div class="row">
        <div class="white-container reinit-password-container" v-if="!mailSend">
          <h1 class="red">Mot de passe oublié ?</h1>
          <span class="content">
            Si vous ne trouvez plus vos identifiants de connexion, veuillez remplir le formulaire suivant afin que nous vous envoyons un lien de réinitialisation du mot de passe.
          </span>
          <SendReinitPswdForm></SendReinitPswdForm>
        </div>
        <div class="white-container reinit-password-container" v-else>
          <span class="green">Un email contenant le lien de réinitialisation de votre mot de passe vient d'être envoyé.</span>
          <span>Veuillez suivre les instructions contenues dans cet email pour génerer un nouveau mot de passe.</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SendReinitPswdForm from '@/components/SendReinitPswdForm.vue'
import { bus } from '../main.js'
export default {
  data () {
    return {
      mailSend: false
    }
  },
  mounted () {
    bus.$on('reinit_mail_send', () => {
      this.mailSend = true
    })
  },
  components: {
    SendReinitPswdForm
  }
}
</script>
