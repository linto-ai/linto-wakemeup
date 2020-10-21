<template>
  <div class="h-100 ">
    <div id="page-content">
      <div v-if="dataLoaded" class="container-fluid" id="audio-monitoring">
        <h2>Liste des fichiers audio enregistrés</h2>
        <table class="list">
          <thead>
            <tr>
              <td @click="filterTab({key:'wakeword',order:'asc'})" :class="[filterParams.key === 'wakeword' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Mot-clé</td>
              <td @click="filterTab({key:'options',order:'asc'})" :class="[filterParams.key === 'options' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Options</td>
              <td @click="filterTab({key:'deviceType',order:'asc'})" :class="[filterParams.key === 'deviceType' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Type de microphone</td>
              <td @click="filterTab({key:'gender',order:'asc'})" :class="[filterParams.key === 'gender' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Sexe</td>
              <td @click="filterTab({key:'ageRange',order:'asc'})" :class="[filterParams.key === 'ageRange' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Tranche d'âge</td>
              <td @click="filterTab({key:'nativeFrench',order:'asc'})" :class="[filterParams.key === 'nativeFrench' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Français natif</td>
              <td @click="filterTab({key:'language',order:'asc'})" :class="[filterParams.key === 'language' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Langue maternelle</td>
              <td @click="filterTab({key:'fieldname',order:'asc'})" :class="[filterParams.key === 'fieldname' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Nom du fichier</td>
              <td @click="filterTab({key:'mimetype',order:'asc'})" :class="[filterParams.key === 'mimetype' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Mime type</td>
              <td @click="filterTab({key:'size',order:'asc'})" :class="[filterParams.key === 'size' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Taille</td>
              <td @click="filterTab({key:'sampleRate',order:'asc'})" :class="[filterParams.key === 'sampleRate' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Sample rate</td>
              <td @click="filterTab({key:'buffersize',order:'asc'})" :class="[filterParams.key === 'buffersize' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Buffer size</td>
              <td @click="filterTab({key:'nbChannels',order:'asc'})" :class="[filterParams.key === 'nbChannels' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Nb channels</td>
              <td @click="filterTab({key:'nbVotes',order:'asc'})" :class="[filterParams.key === 'nbVotes' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Nb votes</td>
              <td @click="filterTab({key:'status',order:'asc'})" :class="[filterParams.key === 'status' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Status</td>
              <td @click="filterTab({key:'recordDate',order:'asc'})" :class="[filterParams.key === 'recordDate' ? 'active' : '', filterParams.order === 'asc' ? 'asc' : 'desc']">Date d'enregistrement</td>
              <td>Ecouter</td>
              <td>Supprimer</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="audio in audioList" :key="audio.fieldname">
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
              <td>{{ audio.nbVotes }} (<span class="green">{{ audio.nbValidVote }}</span> / <span class="red">{{ audio.nbInvalidVote }})</span></td>
              <td>{{ audio.status }}</td>
              <td>{{ audio.recordDate }}</td>
              <td class="action"><button @click="playSound($event)" :data-url="audio.path | formatAudioUrl" class="action-button play"></button></td>
              <td class="action"><button @click="deleteAudio(audio)" class="action-button delete"></button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        Chargement...
      </div>
      <DeleteAudioModal></DeleteAudioModal>
    </div>
  </div>
</template>

<script>
import DeleteAudioModal from '@/components/DeleteAudioModal.vue'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      dataLoaded: false,
      audioList: [],
      audioPlayer: null,
      isPlaying: false,
      filterParams: {
        key: 'recordDate',
        order: 'desc'
      }
    }
  },
  created () {
    this.$store.dispatch('getAudios').then((resp) => {
      // Error handler
      if (!!resp.error) {
        bus.$emit('notify_app', {
          status: 'error',
          msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
          redirect: false
        })
      }
    })
  },
  computed: {
    audios () {
      return this.$store.state.audios
    }
  },
  watch: {
    audios: function (data) {
      this.audioList = data
      this.dataLoaded = true
    }
  },
  methods: {
    deleteAudio (audio) {
      bus.$emit('toggle_delete_audio', audio)
    },
    async playSound (event) {
      const audioNode = event.srcElement
      const url = audioNode.getAttribute('data-url')
      try {
        const testAudio = await axios.get(url)
        if(testAudio.status === 200) {
          if (!this.isPlaying) {
            audioNode.classList.add('isplaying')
            this.audioPlayer = new Audio(url)
            this.audioPlayer.play(url)
            this.isPlaying = true
            this.audioPlayer.addEventListener('ended', () => {
              this.isPlaying = false
              audioNode.classList.remove('isplaying')
            })
          }  
        } else {
          throw 'Audio no found'
        }
      } catch (error) {
          const audioNode = event.srcElement
          audioNode.classList.add('broken')
          console.error(error)
      }
      
    },
    filterTab (options) {
      
      if (this.filterParams.key === options.key) {
        this.filterParams.order === 'asc' ? this.filterParams.order = 'desc' : this.filterParams.order = 'asc'
      } else {
        this.filterParams.order = options.order
        this.filterParams.key = options.key
      }
      this.$store.dispatch('sortAudios', this.filterParams).then((resp) => {
        if (!!resp.error) {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Une erreur est survenue en voulant contacter la base de données. Si le problème persiste veuillez contacter un administrateur.',
            redirect: false
          })
        }
      })
    }
  },
  components: {
    DeleteAudioModal
  }
}
</script>
