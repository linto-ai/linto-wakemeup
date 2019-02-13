document.addEventListener("DOMContentLoaded", function (event) {



    console.log("document chargzer")
    var recordButton = document.getElementById("record");
    var replayButton = document.getElementById("replay");
    var stopButton = document.getElementById("stop");


    navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(function (stream) {
            console.log("log")
            recordButton.disabled = false;
            recordButton.addEventListener('click', startRecording);
            stopButton.addEventListener('click', stopRecording);
            replayButton.addEventListener('click', listenRecording);

            recorder = new MediaRecorder(stream);
            recorder.addEventListener('dataavailable', onRecordingReady);
        });

    function listenRecording() {
        console.log("linto, lassistant vocal a votre ecoute")
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
        var audio = document.getElementById('audio');
        audio.src = URL.createObjectURL(e.data);
        audio.play();
    }


});