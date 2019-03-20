<template>
  <div id="page-content">
    <button @click="startRecording()" class="button" id="start">Start recording</button>
    <button @click="stopRecording()" class="button" id="stop">Stop recording</button>
    <button @click="playRecord()" class="button">Play</button>
    <button @click="test()" class="button">TEST</button>

  </div>
</template>
<script>
export default {
  data () {
    return {
      context: null,
      analyser: null,
      blob: null,
      leftchannel: [],
      rightchannel: [],
      leftBuffer: '',
      rightBufffer: '',
      recorder: null,
      recordingLength: 0,
      volume: null,
      mediaStream: null,
      sampleRate: 44100,
      mediaRecorder: null,
      mediaRecorderblob: null,
      mediaRecorderChunk: [],
      bufferSize: 4096,
      numberOfInputChannels: 2,
      numberOfOutputChannels: 2,
      buffer: null,
      view: null,
      sourceNode: null
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
          this.mediaRecorderblob = new Blob(mediaRecorderChunk, {
            'type': 'audio/webm; codecs=opus'
          });
          //sendDatas(mediaRecorderblob, {})
          console.log('MR Blob :',this.mediaRecorderblob)
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
      //this.mediaRecorder.start()
      this.mediaStream.connect(this.recorder)
      this.recorder.connect(this.context.destination);
    },
    stopRecording () {
      var audio = new Audio(url);
      this.recorder.disconnect(this.context.destination);
      this.mediaStream.disconnect(this.recorder);
      //this.mediaRecorder.stop()
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
     test () {
      console.log(this.leftchannel, this.rightchannel)
    }
  }
 
}
</script>
