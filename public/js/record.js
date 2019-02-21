document.addEventListener("DOMContentLoaded", function (event) {



    var audio = document.getElementById('audio');
    var recordButton = document.getElementById("record");
    var replayButton = document.getElementById("replay");
    var stopButton = document.getElementById("stop");
    var submitButton = document.getElementById("submit");
    var audioRecord = undefined;

    navigator.mediaDevices.getUserMedia({
            audio: {
                mimeType: "audio/wav;codecs=0"
            }
        })
        .then(function (stream) {
            console.log("log");
            recordButton.disabled = false;
            recordButton.addEventListener('click', startRecording);
            stopButton.addEventListener('click', stopRecording);
            replayButton.addEventListener('click', listenRecording);
            submitButton.addEventListener('click', sendAudio);
            recorder = new MediaRecorder(stream);
            recorder.addEventListener('dataavailable', onRecordingReady);
        });

    function listenRecording() {

        audio.play();
    }

    function startRecording() {
        console.log("start recording");
        recordButton.disabled = true;
        stopButton.disabled = false;

        recorder.start();
    }

    function stopRecording() {
        console.log("stop recording");
        recordButton.disabled = false;
        stopButton.disabled = true;
        replayButton.disabled = false;
        recorder.stop();
    }

    function onRecordingReady(e) {

        console.log(e);
        audioRecord = URL.createObjectURL(e.data);
        audio.src = audioRecord;
        audio.play();
    }
    async function sendAudio() {
        if (!!audioRecord) {
            console.log(audio.src)
            var fd = new FormData();
            var request = new XMLHttpRequest();
            fd.append('upl', audio.src, 'blob.wav');
            request.open("POST", "/sendaudio");
            request.send(fd);
            console.log("wav envoye")
            audioRecord = undefined;
            audio.src = "";

        } else {
            console.log("Veuillez tout de même vous enregistrer en premier")
        }


    }

});