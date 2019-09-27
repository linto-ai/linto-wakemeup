<template>
  <div class="container" v-if="validAudiosLoaded">
    <h3>Aidez-nous à atteindre les objectifs d'enregistrement</h3>
    <span class="content">Nous souhaitons atteindre des objectifs d'enregistrements validés par mot-clé :</span><br/>

    <div class="goal-wrapper" v-for="audio in valid_audios.validAudios" :key="audio.wakeword">
      <span class="label">{{ audio.wakeword }} :</span>
      <div class="goal">
        <span class="goal-value" :style="`width: ${ Math.ceil((parseInt(audio.nbValid) * 100) / parseInt(audio.validationGoal)) }%;`" :data-infos="audio.nbValid + ' validation(s)'" ></span>
        <span class="recorded-value" :style="`width: ${ Math.ceil((parseInt(audio.nbRecord) * 100) / parseInt(audio.validationGoal)) }%;`" :data-infos="`${audio.nbRecord} enregistrement(s)`"></span>
      </div>
      <span class="validation-goal">/ {{ audio.validationGoal }}</span>
    </div>
  </div>
</template>

<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      validAudiosLoaded: false
    }
  },
  created () {
    this.dispatchValidAudios()
  },
  computed: {
    valid_audios () {
      return this.$store.state.validAudios
    },
  },
  watch: {
    valid_audios (data) {
      if (data.validAudios.length > 0) {
        this.validAudiosLoaded = true
        console.log(data)
      }
    },
  },
  methods: {
    dispatchValidAudios () {
      this.$store.dispatch('getvalidAudios').then((resp) => {
        // Error handler
        if (!!resp.error) {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
            redirect: false
          })
        }
      })
    }
  }
}
</script>
