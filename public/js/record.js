document.addEventListener("DOMContentLoaded", function (event) {



    console.log("document chargzer")
    var recordButton = document.getElementById("record");
    var replayButton = document.getElementById("replay");
    var stopButton = document.getElementById("stop");


    // get audio stream from user's mic
    navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(function (stream) {
            console.log("log")
            recordButton.disabled = false;
            recordButton.addEventListener('click', startRecording);
            stopButton.addEventListener('click', stopRecording);
            recorder = new MediaRecorder(stream);

            // listen to dataavailable, which gets triggered whenever we have
            // an audio blob available
            recorder.addEventListener('dataavailable', onRecordingReady);
        });


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

        // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
        recorder.stop();
    }

    function onRecordingReady(e) {
        var audio = document.getElementById('audio');
        // e.data contains a blob representing the recording
        audio.src = URL.createObjectURL(e.data);
        audio.play();
    }


});