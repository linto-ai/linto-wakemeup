<template>
  <div id="page-content">
    <div class="container-fluid h-100 talk" id="player-container" >
      <div class="row h-100">
        <div class="col-3 h-100 player-content">
          <h2 class="red">Enregistrez votre voix</h2>
          <span class="content">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
          </span>
        </div>
        <div class="col-9 h-100">
          <div id="player-wrapper">
              <div class="say-word">
                <h3>Dites : "<span class="word">Linto</span>"</h3>
              </div>
              <div class="record-btn-container">
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
              <div class="record-actions-container" v-if="blob !== null && !isRecording">
                <div class="action-container">
                  <button @click="playRecord()" class="btn-player play"></button>
                  <span class="label">Réécouter</span>
                </div>
                <div class="action-container">
                  <button @click="restartRecord()" class="btn-player reset"></button>
                  <span class="label">Recommencer</span>
                </div>
                <div class="action-container">
                  <button @click="validRecord()" class="btn-player validate"></button>
                  <span class="label">Valider</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    
    
    
  </div>
</template>
<script>
export default {
  data () {
    return {
      isRecording: false,
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
      volume: null
    }
  }, 
  mounted () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: {
            min: 1,
            ideal: 2
          }
        }
      }).then((e) => {
        const startBtn = document.getElementById('start')
        const stopBtn = document.getElementById('stop')

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        // creates an audio node from the microphone incoming stream
        this.mediaStream = this.context.createMediaStreamSource(e);
        this.analyser = this.context.createAnalyser();
        this.mediaRecorder = new MediaRecorder(e);

        // Set Recorder (script processor)
        if (this.context.createScriptProcessor) {
          this.recorder = this.context.createScriptProcessor(this.bufferSize, this.numberOfInputChannels, this.numberOfOutputChannels);
        } else {
          this.recorder = this.context.createJavaScriptNode(this.bufferSize, this.numberOfInputChannels, this.numberOfOutputChannels);
        }
        
        // MediaRecorder data
        this.mediaRecorderChunk = [];
        this.mediaRecorder.ondataavailable = (e) => {
          this.mediaRecorderChunk.push(e.data);
          this.mediaRecorderblob = new Blob(this.mediaRecorderChunk, {
            'type': 'audio/webm; codecs=opus'
          });
        }

        // Recorder (script processor) raw data
        this.recorder.onaudioprocess = (e) => {
          this.leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
          this.rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
          this.recordingLength += this.bufferSize;
        }
      }).catch(err => {
      console.error(err)
    })
    }
    else {
      console.log('no userMEdia')
    }
  },
  methods: {
    startRecording () {
      this.isRecording = true
      this.mediaRecorder.start()
      this.mediaStream.connect(this.recorder)
      this.recorder.connect(this.context.destination);
    },
    stopRecording () {
      this.isRecording = false
      var audio = new Audio(url);
      this.recorder.disconnect(this.context.destination);
      this.mediaStream.disconnect(this.recorder);
      this.mediaRecorder.stop()
      this.sourceNode = this.context.createMediaElementSource(audio);
      this.sourceNode.connect(this.context.destination);

      // we flat the left and right channels down
      // Float32Array[] => Float32Array
      this.leftBuffer = this.flattenArray(this.leftchannel, this.recordingLength);
      this.rightBuffer = this.flattenArray(this.rightchannel, this.recordingLength);
      // we interleave both channels together
      // [left[0],right[0],left[1],right[1],...]
      var interleaved = this.interleave(this.leftBuffer, this.rightBuffer);

      // we create our wav file
      this.buffer = new ArrayBuffer(44 + interleaved.length * 2);
      this.view = new DataView(this.buffer);

      // RIFF chunk descriptor
      this.writeUTFBytes(this.view, 0, 'RIFF');
      this.view.setUint32(4, 44 + interleaved.length * 2, true);
      this.writeUTFBytes(this.view, 8, 'WAVE');
      // FMT sub-chunk
      this.writeUTFBytes(this.view, 12, 'fmt ');
      this.view.setUint32(16, 16, true); // chunkSize
      this.view.setUint16(20, 1, true); // wFormatTag
      this.view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
      this.view.setUint32(24, this.sampleRate, true); // dwSamplesPerSec
      this.view.setUint32(28, this.sampleRate * 4, true); // dwAvgBytesPerSec
      this.view.setUint16(32, 4, true); // wBlockAlign
      this.view.setUint16(34, 16, true); // wBitsPerSample
      // data sub-chunk
      this.writeUTFBytes(this.view, 36, 'data');
      this.view.setUint32(40, interleaved.length * 2, true);

      // write the PCM samples
      var index = 44;
      var volume = 1;
      for (var i = 0; i < interleaved.length; i++) {
        this.view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
      }

      // our final blob
      this.blob = new Blob([this.view], {
        type: 'audio/wav'
      });

      // Format datas to send
      const contextSampleRate = this.analyser.context.sampleRate
      const nbChannels = this.analyser.channelCount
      const nbInputs = this.analyser.numberOfInputs
      const nbOutputs = this.analyser.numberOfOutputs
      const bufferSize = this.recorder.bufferSize
      const webAudioInfos = {
        contextSampleRate: contextSampleRate,
        bufferSize: bufferSize,
        nbChannels: nbChannels,
        nbInputs: nbInputs,
        nbOutputs: nbOutputs
      }

      var url = window.URL.createObjectURL(this.blob);
      audio.play();
      console.log('Blob: ', this.blob)
      //sendDatas(blob, webAudioInfos, "01")
    },
    playRecord () {
      if (this.blob == null) {
        return;
      }
      var url = window.URL.createObjectURL(this.blob);
      var audio = new Audio(url);
      audio.play();
    },
    flattenArray(channelBuffer, recordingLength) {
      var result = new Float32Array(recordingLength);
      var offset = 0;
      for (var i = 0; i < channelBuffer.length; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
      }
      return result;
    },

    interleave(leftChannel, rightChannel) {
      var length = leftChannel.length + rightChannel.length;
      var result = new Float32Array(length);
      var inputIndex = 0;
      for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
      }
      return result;
    },

    writeUTFBytes(view, offset, string) {
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    },
    sendDatas(audioBlob, webAudioInfos, name) {
      let formData = new FormData();
      formData.append("webAudioInfos", JSON.stringify(webAudioInfos));
      formData.append(name, audioBlob, name);
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:3003/saveaudio");
      request.send(formData)
    },
  }
 
}
</script>
