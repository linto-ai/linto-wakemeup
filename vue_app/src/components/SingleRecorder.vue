<template>
  <div>
    <div id="recorder-ui" class="flex col" 
    :class="[
      showRecorder ? 'opened' : 'closed', 
      isVerticalDesign || isRecording || blob !== null ? 'recording' : ''
    ]"
    >
      <span class="recorder-wakeword">Mot-réveil: "<strong>{{wakeword}}</strong>"</span>
      <RecordBtn :wakeword="wakeword" :recordAllowed="recordAllowed"></RecordBtn>
      <div class="player-visualizer">
        <div id="visualizer" :class="showVizualizer ? 'visible' : 'hidden'">
          <div id="visualizer-top">
          </div>
          <div id="visualizer-bot">
          </div>
        </div>
      </div>
    </div>
    <div class="recorder-actions flex row" v-if="audioPlayable && !isRecording" :class="showRecorder ? '' : 'hidden'">
      <div class="flex col recorder-action-item">
        <button class="recorder-action-btn play" @click="playRecord()" :class="isPlaying ? 'playing' : ''"></button>
        <span class="recorder-action-label play">Réécouter</span>
      </div>
      <div class="flex col recorder-action-item">
        <button class="recorder-action-btn reset" @click="resetRecording()"></button>
        <span class="recorder-action-label reset">Recommencer</span>
      </div>
      <div class="flex col recorder-action-item">
        <button class="recorder-action-btn validate" :class="sending ? 'sending' : ''" @click="validateRecord()"></button>
        <span class="recorder-action-label validate">Valider</span>
      </div>
    </div>
    <div class="flex row" id="notification" :class="showNotification ? 'visible': 'hidden'" >
      <span class="notif-icon" :class="notificationStatus"></span>
      <p class="flex1 notif-label" :class="notificationStatus" v-html="notificationMsg"></p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import RecordBtn from '@/components/RecordBtn.vue'
import { bus } from '../main-onepage.js'
export default {
  props: ['recordAllowed', 'user', 'showRecorder', 'isVerticalDesign'],
  data () {
    return {
      isRecording: false,
      isPlaying: false,
      analyser: null,
      audioConfig: {
        step: 1,
        label: 'echoCancelAndNoiseSupp',
        echoCancellation: true,
        noiseSuppression: true
      },
      currentStep: 1,
      maxStep: 3,
      audioConfigSteps: [
        {
          step: 1,
          label: 'echoCancelAndNoiseSupp',
          echoCancellation: true,
          noiseSuppression: true
        },
        {
          step: 2,
          label: 'echoCancelOnly',
          echoCancellation: true,
          noiseSuppression: false
        },
        {
          step: 3,
          label: 'noiseSuppOnly',
          echoCancellation: false,
          noiseSuppression: true
        },
      ],
      avgVolume: 0,
      blob: null,
      buffer: null,
      bufferSize: 4096,
      context: null,
      dataArray: [],
      gainNode: null,
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
      rightchannel: [],
      rightBuffer: '',
      sampleRate: 44100,
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
      wakeword: process.env.VUE_APP_WAKEWORD || 'wakeword not found',
      recordSettings: {
        channelCount: {
          min: 1,
          ideal: 2
        },
        echoCancellation: true,
        noiseSuppression: true
      },
      showVizualizer: false,
      showNotification: false,
      notificationMsg: '',
      notificationStatus: '',
      reseting: false,
      audioPlayer: null,
      sending: false
    }
  },
  mounted () {
    if (this.isVerticalDesign) {
      this.showVizualizer = true
    }
    bus.$on('start_recording', () => {
      this.reseting = false
      this.isRecording = false
      this.startRecording()
    })

    bus.$on('reset_recording', () => {
      this.resetRecording()
      
    })

    bus.$on('stop_recording', () => {
      this.stopRecording()
    })

    this.initRecorder(this.audioConfig)
  },
  watch: {
    avgVolume: function (data) {
      this.nbBar++
      this.vizualizerTop.innerHTML += '<span class="visualizer-bar" style="height: ' + (data + 5 >= 40 ? 40 : data + 5) + 'px; left: ' + this.nbBar * 6 + 'px;"></span>'
      this.vizualizerBot.innerHTML += '<span class="visualizer-bar" style="height: ' + (data + 5 >= 40 ? 40 : data + 5) + 'px; left: ' + this.nbBar * 6 + 'px;"></span>'
    },
    showRecorder (data) {
      if(!data) {
        this.showNotification = false
      }
    }
  },
  computed:{
     VAD () {
      return new VAD()
    },
    audioPlayable () {
      return this.blob !== null
    }
  },
  methods: {
    async resetContext () {
      try {
        this.blob = null
        setTimeout(() => {
          if(this.isVerticalDesign) {
            this.showVizualizer = true
          } else {
            this.showVizualizer = false
          }
          bus.$emit('reset_record_btn', {})
        }, 500)
      } catch (error) {
        console.error(error)
      }
    },
    generateFileName () {
      const date = moment().format('YYYYDDMMhhmmss')
      const user = this.user
      const wakeword = this.wakeword.trim().replace(/\s/g, '')
      let gender = null
      let nativeFrench = 'FR'
      if (user.gender.value === 'homme') {
        gender = 'M'
      } else if (user.gender.value === 'femme') { 
        gender = 'F'
      }
      if (!user.nativeFrench.value) {
        nativeFrench = 'notFR'
      } 
      return `${wakeword}-${user.mic.value}-${gender}-age${user.age.value}-${nativeFrench}-${this.audioConfig.label}-${date}`

    },
    async validateRecord () {
      try {
        if (!this.reseting && !this.isPlaying) {
          const fileName = this.generateFileName()
          const send = await this.sendDatas(this.blob, fileName + '.wav')
          if (send.data.status === 'success') {
            this.sending = false
            /*let nextStep = this.currentStep === this.maxStep ? 1 : (this.currentStep + 1)
            this.audioConfig = this.audioConfigSteps[this.audioConfigSteps.findIndex(acs => acs.step === nextStep)]*/
            this.resetContext()
            this.notificationMsg = `Enregistrement validé ! Merci de votre contribution. Vous pouvez continuer en cliquant sur le bouton <span class="icon-record"></span>`
            this.notificationStatus = 'success'
          } else {
            this.sending = false
            this.notificationMsg = `Une erreur est survenue lors de la validation. Veuillez rééssayer ulterieurement.`
            this.notificationStatus = 'error'
          }
          this.showNotification = true
          bus.$emit('scrolldown', {})
        }
      } catch (error) {
        console.error(error)
      }
    },
    async sendDatas (audioBlob, name) {
      this.sending = true
      let formData = new FormData()
      formData.append('userInfos', JSON.stringify(this.user))
      formData.append('audioConfig',JSON.stringify(this.audioConfig))
      formData.append(name, audioBlob, name)
      let saveAudios = null
      return await axios(`${process.env.VUE_APP_URL}/api/audios/save/single`, {
        method: 'post',
        data: formData
      })
    },
    initRecorder (config) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
            audio: {
              channelCount: {
                min: 1,
                ideal: 2
              },
              echoCancellation: this.audioConfig.echoCancellation,
              noiseSuppression: this.audioConfig.noiseSuppression
            }
          }).then((e) => {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            
            this.volumeBarContainer = document.getElementById('visualizer')
            this.vizualizerTop = document.getElementById('visualizer-top')
            this.vizualizerBot = document.getElementById('visualizer-bot')
            this.mediaRecorder = new MediaRecorder(e)
            this.context = new AudioContext() 
            this.mediaStream = this.context.createMediaStreamSource(e)
            this.analyser = this.context.createAnalyser()
            this.analyser.fftSize = 1024
            this.analyser.smoothingTimeConstant = 0.3
            this.gainNode = this.context.createGain()
            this.gainNode.connect(this.analyser)
            this.sampleRate = this.analyser.context.sampleRate

            this.mediaRecorder.onerror = function(e) {
              alert('An error has occured with the media recorder, please refresh the webpage.')
            }

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
              context: this.context
            }
            this.vad = new VAD(this.vadOptions)
            
          }).catch(err => {
            console.error(err)
          })
        }
      } catch (err){
        console.error(error) 
      }
    },
    startRecording () {
      try {
        this.showNotification = false
        if (!this.isRecording) {
          this.nbBar = 0
          this.recordingLength = 0
          this.blob = null
          this.mediaRecorderblob = null
          this.mediaRecorderChunk = []
          this.leftchannel = []
          this.rightchannel = []
          this.isRecording = true
          this.view = null
          this.buffer = null
          this.mediaRecorder.start()
          this.mediaStream.connect(this.analyser)
          this.analyser.connect(this.recorder)
          this.recorder.connect(this.context.destination)
          this.startRecordTimeout()
          this.showVizualizer = true
        }  
      } catch (error) {
        console.error(error)
      }
    },
    resetRecording () {
      if(this.isPlaying) {
        this.audioPlayer.pause()
        this.isPlaying = false
      }
      this.reseting = true
      this.volumeBarContainer.setAttribute('style', 'width: 100%;')
      this.vizualizerTop.innerHTML = ''
      this.vizualizerBot.innerHTML = ''
      bus.$emit('before_recording', {})
      bus.$emit('scrolldown', {})
    },
    stopRecording () {
      try {
        const volumeBarWidth = this.nbBar * 6 + 20
        let audio = new Audio()
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
          options: this.audioConfig.label,
          recordDate: new Date()
        }

        if(this.blob === null || !this.blob.size || this.blob.size === 0) {
          alert('une erreur est survenue, si le problème persiste, veuillez recharger la page.')
        }

        bus.$emit('btn_stop_recording', {})
        bus.$emit('scrolldown', {})
      } catch (error) {
        console.error(error) 
      }
    },
    startRecordTimeout () {
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording()
        }
      }, 3500)
    },
    playRecord () {
      if (this.blob === null || this.isPlaying === 'active' || this.reseting) {
        return
      }
      this.isPlaying = 'active'
      var url = window.URL.createObjectURL(this.blob)
      this.audioPlayer = new Audio(url)
      this.audioPlayer.play()
      this.audioPlayer.addEventListener('ended', () => {
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
    getAverageVolume (array) {
      const length = array.length
      let values = 0
      for (let i = 0; i < length; i++) {
        values += array[i]
      }
      return values / length
    },
  },
  components: {
    RecordBtn
  }
  
}
</script>