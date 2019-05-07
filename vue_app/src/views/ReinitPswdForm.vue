<template>
  <div class="h-100">
    <div id="page-content">
      <div v-if="tokenValid" class="col-6 white-container reinit-password-container">
        <h1 class="green"> Réinitialiser votre mot de passe</h1>
        <ReinitPasswordFrom :userHash="userHash"></ReinitPasswordFrom>
      </div>
      <div v-else class="col-6 white-container reinit-password-container expired">
        <h1 class="green"> Réinitialiser votre mot de passe</h1>
        <span>Le lien à expiré ou n'est plus valide, veuillez cliquez sur le bouton suivant pour vous renvoyer un mail avec un lien à jour: </span>
        <a class="button green" href="/reinit-password">Renvoyer un lien</a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import ReinitPasswordFrom from '@/components/ReinitPasswordFrom.vue'
export default {
  data () {
    return {
      urlToken: '',
      urlUser: '',
      tokenValid: false,
      userHash: ''
    }
  },
  async mounted () {
    this.urlToken = this.$route.params.token
    this.urlUser = this.$route.params.user
    const checkToken = await axios(`${process.env.VUE_APP_URL}/api/user/checkToken`, {
      method: 'post',
      data: {
        token: this.urlToken,
        user: this.urlUser
      }
    })
    if (checkToken.data.status === 'success') {
      this.tokenValid = true
      this.userHash = checkToken.data.userHash
    } else {
      this.tokenValid = false
      if (checkToken.data.msg === 'tokenInvalid' || checkToken.data.msg === 'tokenExpired') {
        // Renvoyer un mail
      }
    }
  },
  components: {
    ReinitPasswordFrom
  }
}
</script>
