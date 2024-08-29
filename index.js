const soundClips = document.querySelector(".sound-clips");
const recordBtn = document.querySelector(".record");
console.log(recordBtn);
const stopBtn = document.querySelector(".stop");

// make sure that mediaDevices and the getUserMedia method are available
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  // Set constraints for getting media
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    // Success async callback
    .then((stream) => {
      console.log("getUserMedia call completed successfully");

      // Set up the recorder with the stream returned by getUserMedia
      const mediaRecorder = new MediaRecorder(stream);

      // Add event listeners
      // Start recording
      recordBtn.onclick = () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        recordBtn.style.background = "red";
        recordBtn.style.color = "black";
      };

      // Capture audio on mediaRecorder when "ondataavailable" event is fired
      let chunks = []; // chunks is data that will be joined together into a "blob"
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      // Stop recording
      stopBtn.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        recordBtn.style.background = "";
        recordBtn.style.color = "";
      };

      // Grab and use the blob
      // mediaRecorder fires an "onstop" event when stopped
      mediaRecorder.onstop = (e) => {
        console.log("recorder stopped");

        const clipName = prompt("Enter a name for your sound clip");

        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");

        audio.setAttribute("controls", "");
        deleteButton.textContent = "Delete";
        clipLabel.textContent = clipName;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        const blob = new Blob(chunks, { type: "audio/mpeg" });
        console.log(blob);
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        console.log(audioURL);
        audio.src = audioURL;

        deleteButton.onclick = (e) => {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        };
      };
    })

    // Error callback
    .catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
  console.log("getUserMedia not supported on your browser");
}
