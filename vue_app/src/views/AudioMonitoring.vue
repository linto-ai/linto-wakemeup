<template>
  <div class="h-100">
    <div id="page-content">
      <div v-if="dataLoaded">
        <h2>Liste des audios enregistés</h2>
        <table class="list">
          <thead>
            <tr>
              <td>Mot-clé</td>
              <td>Options</td>
              <td>Type de microphone</td>
              <td>Sexe</td>
              <td>Tranche d'âge</td>
              <td>Français natif</td>
              <td>Langue maternelle</td>
              <td>Nom du fichier</td>
              <td>Mime type</td>
              <td>Taille</td>
              <td>Sample rate</td>
              <td>Buffer size</td>
              <td>Nb channels</td>
              <td>Nb votes</td>
              <td>Status</td>
              <td>Ecouter</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="audio in audios" :key="audio.fieldname">
              <td>{{ audio.wakeword }}</td>
              <td>{{ audio.options }}</td>
              <td>{{ audio.deviceType }}</td>
              <td>{{ audio.gender }}</td>
              <td>{{ audio.ageRange }}</td>
              <td>{{ audio.nativeFrench }}</td>
              <td>{{ audio.language }}</td>
              <td>{{ audio.fieldname }}</td>
              <td>{{ audio.mimetype }}</td>
              <td>{{ audio.size }}</td>
              <td>{{ audio.sampleRate }}</td>
              <td>{{ audio.buffersize }}</td>
              <td>{{ audio.nbChannels }}</td>
              <td>{{ audio.nbVotes }} (<span class="green">{{ audio.nbValidVote }}</span> / <span class="red">{{ audio.nbInvalidVote}})</span></td>
              <td>{{ audio.status }}</td>
              <td><button :data-url="'/assets/' + audio.fieldname">Play</button></td>
            </tr>
          </tbody>
        </table>
  
      </div>
      <div v-else>
        Loading
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataLoaded: false
      }
    },
    created() {
      this.$store.dispatch('getAudios').then((resp) => {}, error => {
        console.error('error:', err)
      })
    },
    computed: {
      audios() {
        return this.$store.state.audios
      }
    },
    watch: {
      audios: function(data) {
        if (data) {
          this.dataLoaded = true
        }
      }
    },
  
  }
</script>
