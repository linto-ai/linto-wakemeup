<template>
  <div class="h-100">
    <div id="page-content" class="locked" >
      <div class="container-fluid h-100 talk red" id="player-container" >
        <div class="row h-100">
          <div class="col-4 h-100 player-content">
            <h2 class="red">Enregistrez votre voix</h2>
            <div class="content red">
              <p>Bienvenue dans l'interface d'enregistrement des wakewords.</p>
              <p>L'enregistrement des wakeword nécessite qu'un <strong>microphone</strong> soit detecté par votre navigateur. Lors de votre inscription, vous avez du sélectionner un type de périphérique. Vous pouvez mettre à jour ces informations en vous rendant dans l'interface utilisateur.</p>

              <p>Les données seront enregistrées de façon <strong>anonymes</strong> et renseignerons uniquement le sexe du locuteur. </p>

              <p>Chaque "Wakeword" devra être enregistré 3 fois de suite afin que nous puissions avoir un comparatif des différents échantillons.</p>

              <div class="notice"><h3>Pour enregistrer votre voix</h3>
                <ul>
                  <li>La commmande à enregistrer est écrites au-dessus du bouton "enregistrer" sur la partie droite de la page.</li>
                  <li>Cliquez sur le bouton "<strong>enregistrer</strong>" afin de commencer la captation. Le bouton se mettra à clignoter pour vous indiquer que la captation est en cours.</li>
                  <li><strong>Prononcez la commande</strong> et appuyez une nouvelle fois sur le bouton "<strong>enregistrer</strong>" afin d'arrêter la captation.</li>
                  <li>Après avoir enregistré votre voix, vous pourrez <strong>réécouter</strong> votre enregistrement, et le <strong>recommencer</strong> si nécessaire.</li>
                  <li> Si votre enregistrement vous semble valide, cliquez sur le bouton "<strong>valider</strong>" pour le confirmer et passer à un nouvel enregistrement.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-8 h-100">
            <div id="player-wrapper" v-if="dataReady && !allComplete">
              <div class="say-word">
                <h3>Dites : "<span class="word">{{ wakeword }}</span>"</h3>
              </div>
              <div class="btn-container">
                <div class="player-anim">
                  <span class="sound-bar bsmall" :class="[isRecording ? 'animate' : '']"></span>
                  <span class="sound-bar bmed" :class="[isRecording ? 'animate' : '']"></span>
                  <span class="sound-bar bbig" :class="[isRecording ? 'animate' : '']"></span>
                </div>
                <button @click="startRecording()" class="button-record" id="start" v-if="!isRecording"><span class="icon"></span></button>
                <button v-if="isRecording" @click="stopRecording()" class="button-record isRecording" id="stop"><span class="icon isRecording"></span></button>
                <div class="player-anim">
                  <span class="sound-bar bbig" :class="[isRecording ? 'animate' : '']"></span>
                  <span class="sound-bar bmed" :class="[isRecording ? 'animate' : '']"></span>
                  <span class="sound-bar bsmall" :class="[isRecording ? 'animate' : '']"></span>
                </div>
                <span class="label">Enregistrer</span>
              </div>
              <div class="sub-actions-container" v-if="blob !== null && !isRecording">
                <div class="action-container">
                  <button @click="playRecord()" class="btn-player play" :class="isPlaying"></button>
                  <span class="label">Réécouter</span>
                </div>
                <div class="action-container">
                  <button @click="startRecording()" class="btn-player reset"></button>
                  <span class="label">Recommencer</span>
                </div>
                <div class="action-container">
                  <button @click="validRecord()" class="btn-player validate" :class="recordIsValid"></button>
                  <span class="label">Valider</span>
                </div>
              </div>
            </div>
            <div class="player-timeline" v-if="dataReady && !allComplete">
              <div class="timeline">
                <div class="progress" :class="progressClass">
                  <span class="progress-info">{{ step }}/3</span>
                </div>
              </div>
            </div>
            <div v-if="!dataReady && allComplete" class="record-complete white-container">
                Vous n'avez pas de "wake-word" à enregistrer.<br/>
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
import moment from 'moment'
import axios from 'axios'
import { bus } from '../main.js'
export default {
  data () {
    return {
      analyser: null,
      blob: null,
      buffer: null,
      bufferSize: 4096,
      context: null,
      leftchannel: [],
      leftBuffer: '',
      mediaRecorder: null,
      mediaRecorderblob: null,
      mediaRecorderChunk: [],
      mediaStream: null,
      numberOfInputChannels: 2,
      numberOfOutputChannels: 2,
      recorder: null,
      recordingLength: 0,
      rightchannel: [],
      rightBufffer: '',
      sampleRate: 44100,
      sourceNode: null,
      view: null,
      volume: null,
      wakeword: '',
      audioConfig: null,
      step: 0,
      scenariosLoaded: false,
      dataReady: false,
      allComplete: false,
      progressClass: '',
      isRecording: false,
      isPlaying: '',
      recordIsValid: '',
      userReady: false,
      scenariosReady: false
    }
  }, 
  created () {
    this.$store.dispatch('getScenarios').then((resp) => {
      this.scenariosLoaded = true
    }, error => {
      console.error('error:', err)
    })
  },
  computed: {
    scenarios () { 
      return this.$store.state.scenarios
    },
    userInfos () {
      return this.$store.state.userInfos
    }
  },
  watch: {
    userInfos: function (data) {
      console.log(data)
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
    }
  },
  methods: {
    setScenario () {
      if (!!this.userInfos.recordList && this.userInfos.recordList.length > 0) {
        this.userInfos.recordList.map(rec => {
          if (!rec.complete) {
            this.wakeword = rec.wakeword
            this.step = parseInt(rec.step) + 1
            this.scenarios.map(s => {
              if (s.wakeword === rec.wakeword) {
                for(let key in s.scenario) {
                  if (s.scenario[key].step == this.step) {
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
                if (rec.wakeword == ww) {
                  wwfound = true
                }
              })
              if (!wwfound) {
                this.wakeword = s.wakeword
                this.step = 1
                this.audioConfig = {
                  label : 'noOpt',
                  echoCancellation : s.scenario.noOpt.echoCancellation,
                  noiseSuppression : s.scenario.noOpt.noiseSuppression,
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
          noiseSuppression: scene.scenario.noOpt.noiseSuppression,
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
    startRecording () {
      this.leftchannel = []
      this.rightchannel = []
      this.isRecording = true
      this.mediaRecorder.start()
      this.mediaStream.connect(this.recorder)
      this.recorder.connect(this.context.destination)
    },
    stopRecording () {
      const audio = new Audio()
      this.isRecording = false
      this.recorder.disconnect(this.context.destination)
      this.mediaStream.disconnect(this.recorder)
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
      const contextSampleRate = this.analyser.context.sampleRate
      const nbChannels = this.analyser.channelCount
      const nbInputs = this.analyser.numberOfInputs
      const nbOutputs = this.analyser.numberOfOutputs
      const bufferSize = this.recorder.bufferSize
      this.webAudioInfos = {
        contextSampleRate: contextSampleRate,
        bufferSize: bufferSize,
        nbChannels: nbChannels,
        nbInputs: nbInputs,
        nbOutputs: nbOutputs,
        options: this.audioConfig.label
      }
    },
    playRecord () {
      if (this.blob == null) {
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
    interleave(leftChannel, rightChannel) {
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
      formData.append("webAudioInfos", JSON.stringify(webAudioInfos))
      formData.append("userInfos", JSON.stringify(userPayload))
      formData.append(name, audioBlob, name)
      
      return await axios(`${process.env.VUE_APP_URL}/api/audios/save`, {
        method: 'post', data: formData
      })
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
        sendWebm = await this.sendDatas(this.mediaRecorderblob,  this.webAudioInfos, fileName + '.webm')
        if (sendRaw.data.status === 'success' && sendWebm.data.status === 'success') {
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
      else {
        sendRaw = await this.sendDatas(this.blob, this.webAudioInfos, fileName + '.wav')
        if (sendRaw.data.status === 'success') {
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
          const startBtn = document.getElementById('start')
          const stopBtn = document.getElementById('stop')

          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          this.context = new AudioContext()
          // creates an audio node from the microphone incoming stream
          this.mediaStream = this.context.createMediaStreamSource(e)
          this.analyser = this.context.createAnalyser()
          this.mediaRecorder = new MediaRecorder(e)

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
          }
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
}
</script>
