<template>
  <div class="h-100">
    <div id="page-content" class="locked">
      <div class="container-fluid h-100 talk red" id="player-container">
        <div class="row h-100">
          <div class="player-content" :class="[showInfos ? 'col-4 h-100' : 'hidden', mobileView ? 'mobile': '']" >
            <button @click="toggleInfos()" class="closeInfos toggle-infos"></button>
            <h2 class="red">Enregistrez votre voix</h2>
            <div class="notice record">Dans la mesure du possible, l'enregistrement doit se dérouler dans un environnement silencieux afin d'éviter les bruits parasites.</div>
            <div class="content red">
              <p>Bienvenue dans l'interface d'enregistrement de mots-clés.</p>
              <p>L'enregistrement des mots-clés nécessite qu'un <strong>microphone</strong> soit detecté par votre navigateur. Lors de votre inscription, vous avez du sélectionner un type de périphérique. Vous pouvez mettre à jour ces informations en vous rendant dans l'interface utilisateur en cliquant sur <strong class="green">Mon compte</strong> dans l'onglet utilisateur.</p>
              <p>Les données seront enregistrées de façon <strong>anonyme</strong> et renseignerons uniquement le sexe du locuteur et le type de microphone utilisé. </p>

              <p>Chaque mot-clé devra être enregistré 3 fois de suite afin que nous puissions avoir un comparatif des différents échantillons.</p>

              <div class="notice">
                <h3>Pour enregistrer votre voix</h3>
                <ul>
                  <li>La commmande à enregistrer est écrite au-dessus du bouton "enregistrer" sur la partie droite de la page.</li>
                  <li>Cliquez sur le bouton "<strong>enregistrer</strong>" afin de commencer la captation. Un compte à rebourd démarrera pour vous indiquer quand parler.</li>
                  <li><strong>Prononcez la commande</strong>. La captation s'arrêtera automatiquement après avoir détecté un silence.</li>
                  <li>Après avoir enregistré votre voix, vous pourrez <strong>réécouter</strong> votre enregistrement, et le <strong>recommencer</strong> si nécessaire.</li>
                  <li> Si votre enregistrement vous semble valide, cliquez sur le bouton "<strong>valider</strong>" pour le confirmer et passer à un nouvel enregistrement.</li>
                </ul>
              </div>
            </div>
          </div>
          <div :class="[showInfos ? 'col-8 h-100' : 'col-12 h-100', mobileView ? 'col-12 h-100' : '' ]">
            <button @click="toggleInfos()" :class="[!showInfos ? 'visible' : 'hidden']" class="showInfos toggle-infos"></button>
            <div id="player-wrapper" v-if="dataReady && !allComplete">
              <div class="say-word">
                <h3>Mot clé : "<span class="word">{{ wakeword }}</span>" (étape {{step}}/3)</h3>
              </div>
              <div class="btn-container">
                <RecordBtn :wakeword="wakeword"></RecordBtn>
                <span class="label">Enregistrer</span>
              </div>
              <div class="sub-actions-container" v-if="blob !== null && !isRecording">
                <div class="action-container">
                  <button @click="playRecord()" class="btn-player play" :class="isPlaying"></button>
                  <span class="label">Réécouter</span>
                </div>
                <div class="action-container">
                  <button @click="resetRecording()" class="btn-player reset"></button>
                  <span class="label">Recommencer</span>
                </div>
                <div class="action-container">
                  <button @click="validRecord()" class="btn-player validate" :class="recordIsValid"></button>
                  <span class="label">Valider</span>
                </div>
              </div>
            </div>
            <div class="player-visualizer" v-if="dataReady && !allComplete">
              <div id="visualizer">
                <div id="visualizer-top">
                </div>
                <div id="visualizer-bot">
                </div>
              </div>
            </div>
            <div v-if="!dataReady && allComplete" class="record-complete white-container">
              Vous n'avez pas de mot-clé à enregistrer.<br/>
              <a href="/">Retour à l'accueil</a>
            </div>
            <div v-if="!dataReady && !allComplete" class="loading">
              <img src="/assets/img/loading.gif" class="loading-img" />
              <span class="label">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordBtn from '@/components/RecordBtn.vue'
import moment from 'moment'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      allComplete: false,
      analyser: null,
      audioConfig: null,
      avgVolume: 0,
      blob: null,
      buffer: null,
      bufferSize: 4096,
      context: null,
      dataArray: [],
      dataReady: false,
      gainNode: null,
      isRecording: false,
      isPlaying: '',
      leftchannel: [],
      leftBuffer: '',
      mediaRecorder: null,
      mediaRecorderblob: null,
      mediaRecorderChunk: [],
      mediaStream: null,
      mobileView: false,
      nbBar: 0,
      numberOfInputChannels: 2,
      numberOfOutputChannels: 2,
      progressClass: '',
      recorder: null,
      recordingLength: 0,
      recordIsValid: '',
      rightchannel: [],
      rightBufffer: '',
      sampleRate: 44100,
      screenWidth: 0,
      scenariosLoaded: false,
      scenariosReady: false,
      showInfos: true,
      sourceNode: null,
      step: 0,
      userReady: false,
      vad: null,
      vadOptions: {},
      view: null,
      volume: null,
      volumeBarContainer: null,
      vizualizerTop: null,
      vizualizerBot: null,
      wakeword: ''
    }
  },
  created () {
    this.$store.dispatch('getScenarios').then((resp) => {
      this.scenariosLoaded = true
    }, error => {
      console.error('error:', error)
    })
  },
  computed: {
    scenarios () {
      return this.$store.state.scenarios
    },
    userInfos () {
      return this.$store.state.userInfos
    },
    VAD () {
      return new VAD()
    }
  },
  mounted () {
    setTimeout(() => {
      this.volumeBarContainer = document.getElementById('visualizer')
      this.vizualizerTop = document.getElementById('visualizer-top')
      this.vizualizerBot = document.getElementById('visualizer-bot')
    }, 300)

    bus.$on('start_recording', () => {
      this.isRecording = false
      this.startRecording()
    })
    bus.$on('reset_recording', () => {
      this.resetRecording()
    })

    bus.$on('stop_recording', () => {
      this.stopRecording()
    })

    if (this.getCookie('wmu_recinfos') !== 'undefined') {
      if (this.getCookie('wmu_recinfos') === 'false') {
        this.showInfos = false
      } else if (this.getCookie('wmu_recinfos') === 'true') {
        this.showInfos = true
      }
    }
    this.screenWidth = this.getScreenWidth()
    if (this.screenWidth <= 1280) {
      this.showInfos = false
    }
    window.addEventListener('resize', () => {
      this.screenWidth = this.getScreenWidth()
    })
  },
  watch: {
    screenWidth: function (data) {
      if (data <= 1280) {
        this.mobileView = true
      } else {
        this.mobileView = false
      }
    },
    userInfos: function (data) {
      this.userReady = true
    },
    scenarios: function (data) {
      this.scenariosReady = true
    },
    userReady: function (data) {
      if (data === true && this.scenariosReady === true) {
        this.setScenario()
      }
    },
    scenariosReady: function (data) {
      if (data === true && this.userReady === true) {
        this.setScenario()
      }
    },
    avgVolume: function (data) {
      this.nbBar++
      this.vizualizerTop.innerHTML += '<span class="visualizer-bar" style="height: ' + (data + 5 >= 40 ? 40 : data + 5) + 'px; left: ' + this.nbBar * 6 + 'px;"></span>'
      this.vizualizerBot.innerHTML += '<span class="visualizer-bar" style="height: ' + (data + 5 >= 40 ? 40 : data + 5) + 'px; left: ' + this.nbBar * 6 + 'px;"></span>'
    }
  },
  methods: {
    getScreenWidth () {
      return window.innerWidth
    },
    setScenario () {
      if (!!this.userInfos.recordList && this.userInfos.recordList.length > 0) {
        this.userInfos.recordList.map(rec => {
          if (!rec.complete) {
            this.wakeword = rec.wakeword
            this.step = parseInt(rec.step) + 1
            this.scenarios.map(s => {
              if (s.wakeword === rec.wakeword) {
                for (let key in s.scenario) {
                  if (s.scenario[key].step === this.step) {
                    this.audioConfig = {
                      label: key,
                      echoCancellation: s.scenario[key].echoCancellation,
                      noiseSuppression: s.scenario[key].noiseSuppression
                    }
                  }
                }
              }
            })
          } else {
            this.scenarios.map(s => {
              let ww = s.wakeword
              let wwfound = false
              this.userInfos.recordList.map(rec => {
                if (rec.wakeword === ww) {
                  wwfound = true
                }
              })
              if (!wwfound) {
                this.wakeword = s.wakeword
                this.step = 1
                this.audioConfig = {
                  label: 'noOpt',
                  echoCancellation: s.scenario.noOpt.echoCancellation,
                  noiseSuppression: s.scenario.noOpt.noiseSuppression
                }
              }
            })
          }
        })
      } else {
        const scene = this.scenarios[0]
        this.step = 1
        this.wakeword = scene.wakeword
        this.audioConfig = {
          label: 'noOpt',
          echoCancellation: scene.scenario.noOpt.echoCancellation,
          noiseSuppression: scene.scenario.noOpt.noiseSuppression
        }
      }
      this.progressClass = 'step-' + this.step

      if (this.audioConfig === null) {
        this.allComplete = true
        this.dataReady = false
      } else {
        this.dataReady = true
        this.allComplete = false
        this.initRecorder(this.audioConfig)
      }
    },
    startRecordTimeout () {
      this.rencordEnded = false
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording()
          bus.$emit('notify_app', {
            status: 'warning',
            msg: 'Temps d\'enregistrement dépassé',
            redirect: false
          })
        }
      }, 3500)
    },
    startRecording () {
      if(!this.isRecording){
        this.leftchannel = []
        this.rightchannel = []
        this.isRecording = true
        this.mediaRecorder.start()
        this.mediaStream.connect(this.analyser)
        this.analyser.connect(this.recorder)
        this.recorder.connect(this.context.destination)
        this.startRecordTimeout()
      }
    },
    resetRecording () {
      this.nbBar = 0
      this.recordingLength = 0
      this.volumeBarContainer.setAttribute('style', 'width: 100%;')
      this.vizualizerTop.innerHTML = ''
      this.vizualizerBot.innerHTML = ''
      bus.$emit('before_recording', {})
    },
    stopRecording () {
      const volumeBarWidth = this.nbBar * 6 + 20
      this.volumeBarContainer.setAttribute('style', 'width:' + parseInt(volumeBarWidth + 40) + 'px; ')
      var audio = new Audio()
      this.isRecording = false
      this.recorder.disconnect(this.context.destination)
      this.analyser.disconnect(this.recorder)
      this.mediaStream.disconnect(this.analyser)
      this.mediaRecorder.stop()
      this.sourceNode = this.context.createMediaElementSource(audio)
      this.sourceNode.connect(this.context.destination)

      // we flat the left and right channels down
      // Float32Array[] => Float32Array
      this.leftBuffer = this.flattenArray(this.leftchannel, this.recordingLength)
      this.rightBuffer = this.flattenArray(this.rightchannel, this.recordingLength)
      // we interleave both channels together
      // [left[0],right[0],left[1],right[1],...]
      var interleaved = this.interleave(this.leftBuffer, this.rightBuffer)

      // we create our wav file
      this.buffer = new ArrayBuffer(44 + interleaved.length * 2)
      this.view = new DataView(this.buffer)

      // RIFF chunk descriptor
      this.writeUTFBytes(this.view, 0, 'RIFF')
      this.view.setUint32(4, 44 + interleaved.length * 2, true)
      this.writeUTFBytes(this.view, 8, 'WAVE')
      // FMT sub-chunk

      this.writeUTFBytes(this.view, 12, 'fmt ')
      this.view.setUint32(16, 16, true) // chunkSize
      this.view.setUint16(20, 1, true) // wFormatTag
      this.view.setUint16(22, 2, true) // wChannels: stereo (2 channels)
      this.view.setUint32(24, this.sampleRate, true) // dwSamplesPerSec
      this.view.setUint32(28, this.sampleRate * 4, true) // dwAvgBytesPerSec
      this.view.setUint16(32, 4, true) // wBlockAlign
      this.view.setUint16(34, 16, true) // wBitsPerSample
      // data sub-chunk
      this.writeUTFBytes(this.view, 36, 'data')
      this.view.setUint32(40, interleaved.length * 2, true)

      // write the PCM samples
      var index = 44
      var volume = 1
      for (var i = 0; i < interleaved.length; i++) {
        this.view.setInt16(index, interleaved[i] * (0x7FFF * volume), true)
        index += 2
      }

      // our final blob
      this.blob = new Blob([this.view], {
        type: 'audio/wav'
      })

      // Format datas to send
      const nbChannels = this.analyser.channelCount
      const nbInputs = this.analyser.numberOfInputs
      const nbOutputs = this.analyser.numberOfOutputs
      const bufferSize = this.recorder.bufferSize
      this.webAudioInfos = {
        contextSampleRate: this.sampleRate,
        bufferSize: bufferSize,
        nbChannels: nbChannels,
        nbInputs: nbInputs,
        nbOutputs: nbOutputs,
        options: this.audioConfig.label
      }
      bus.$emit('btn_stop_recording', {})
    },
    playRecord () {
      if (this.blob === null || this.isPlaying === 'active') {
        return
      }
      this.isPlaying = 'active'
      var url = window.URL.createObjectURL(this.blob)
      var audio = new Audio(url)
      audio.play()
      audio.addEventListener('ended', () => {
        this.isPlaying = ''
      })
    },
    flattenArray (channelBuffer, recordingLength) {
      var result = new Float32Array(recordingLength)
      var offset = 0
      for (var i = 0; i < channelBuffer.length; i++) {
        var buffer = channelBuffer[i]
        result.set(buffer, offset)
        offset += buffer.length
      }
      return result
    },
    interleave (leftChannel, rightChannel) {
      var length = leftChannel.length + rightChannel.length
      var result = new Float32Array(length)
      var inputIndex = 0
      for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex]
        result[index++] = rightChannel[inputIndex]
        inputIndex++
      }
      return result
    },
    writeUTFBytes (view, offset, string) {
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    },
    async sendDatas (audioBlob, webAudioInfos, name) {
      const userPayload = {
        userHash: this.userInfos.userHash,
        wakeword: this.wakeword,
        deviceType: this.userInfos.deviceType,
        step: this.step,
        gender: this.userInfos.gender
      }
      let formData = new FormData()
      formData.append('webAudioInfos', JSON.stringify(webAudioInfos))
      formData.append('userInfos', JSON.stringify(userPayload))
      formData.append(name, audioBlob, name)

      const saveAudios = axios(`${process.env.VUE_APP_URL}/api/audios/save`, {
        method: 'post',
        data: formData
      })
      return saveAudios
    },
    async validRecord () {
      const date = moment().format('YYYYDDMmmhhmmss')
      const wakeWord = this.wakeword
      const opt = this.audioConfig.label
      let gender
      if (this.userInfos.gender === 'male') {
        gender = 'M'
      } else if (this.userInfos.gender === 'female') {
        gender = 'F'
      }
      const fileName = `${wakeWord}-${opt}-${gender}-${date}`

      let sendRaw, sendWebm
      if (this.step === 1) {
        sendRaw = await this.sendDatas(this.blob, this.webAudioInfos, fileName + '.wav')
        sendWebm = await this.sendDatas(this.mediaRecorderblob, this.webAudioInfos, fileName + '.webm')
        if (sendRaw.data.status === 'success' && sendWebm.data.status === 'success') {
          this.recordIsValid = 'active'
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Enregistrement validé',
            redirect: '/interface/record'
          })
        } else {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Erreur lors de l\'enregistrement',
            redirect: false
          })
        }
      } else {
        sendRaw = await this.sendDatas(this.blob, this.webAudioInfos, fileName + '.wav')
        if (sendRaw.data.status === 'success') {
          this.recordIsValid = 'active'
          bus.$emit('notify_app', {
            status: 'success',
            msg: 'Enregistrement validé',
            redirect: '/interface/record'
          })
        } else {
          bus.$emit('notify_app', {
            status: 'error',
            msg: 'Erreur lors de l\'enregistrement',
            redirect: false
          })
        }
      }
    },
    getAvg (values) {
      var value = 0
      values.forEach(function (v) {
        value += v
      })
      return value / values.length
    },
    initRecorder (config) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: {
              min: 1,
              ideal: 2
            },
            echoCancellation: config.echoCancellation,
            noiseSuppression: config.noiseSuppression
          }
        }).then((e) => {
          window.AudioContext = window.AudioContext || window.webkitAudioContext
          this.mediaRecorder = new MediaRecorder(e)
          this.context = new AudioContext()
          this.mediaStream = this.context.createMediaStreamSource(e)
          this.analyser = this.context.createAnalyser()
          this.analyser.fftSize = 1024
          this.analyser.smoothingTimeConstant = 0.3
          this.gainNode = this.context.createGain()
          this.gainNode.connect(this.analyser)
          this.sampleRate = this.analyser.context.sampleRate

          // Set Recorder (script processor)
          if (this.context.createScriptProcessor) {
            this.recorder = this.context.createScriptProcessor(this.bufferSize, this.numberOfInputChannels, this.numberOfOutputChannels)
          } else {
            this.recorder = this.context.createJavaScriptNode(this.bufferSize, this.numberOfInputChannels, this.numberOfOutputChannels)
          }

          // MediaRecorder data
          this.mediaRecorderChunk = []
          this.mediaRecorder.ondataavailable = (e) => {
            this.mediaRecorderChunk.push(e.data)
            this.mediaRecorderblob = new Blob(this.mediaRecorderChunk, {
              'type': 'audio/webm; codecs=opus'
            })
          }

          // Recorder (script processor) raw data
          this.recorder.onaudioprocess = (e) => {
            this.leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)))
            this.rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)))
            this.recordingLength += this.bufferSize

            const tempArray = new Uint8Array(this.analyser.frequencyBinCount)
            this.analyser.getByteFrequencyData(tempArray)
            this.avgVolume = this.getAverageVolume(tempArray)
          }
          // Voice activity detection
          this.vadOptions = {
            source: this.mediaStream,
            voice_start: () => {},
            voice_stop: () => {
              if (this.isRecording) {
                this.stopRecording()
              }
            },
            context: this.audioContext
          }
          this.vad = new VAD(this.vadOptions)
        }).catch(err => {
          console.error(err)
        })
      }
    },
    getAverageVolume (array) {
      const length = array.length
      let values = 0
      for (let i = 0; i < length; i++) {
        values += array[i]
      }
      return values / length
    },
    toggleInfos () {
      this.showInfos = !this.showInfos
      this.setCookie('wmu_recinfos', this.showInfos, 31)
    },
    getCookie (cname) {
      const name = cname + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length)
        }
      }
      return ''
    },
    setCookie (cname, cvalue, exdays) {
      const d = new Date()
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60))
      const expires = 'expires=' + d.toUTCString()
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
    }
  },
  components: {
    RecordBtn
  }
}
</script>
