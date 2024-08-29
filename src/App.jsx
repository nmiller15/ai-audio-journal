import { useState } from "react";
// import Audio2TextJS from "audio2textjs";

function App() {
  // const soundClips = document.querySelector(".sound-clips");
  // const recordBtn = document.querySelector(".record");
  // const stopBtn = document.querySelector(".stop");
  const [audioSrcList, setAudioSrcList] = useState([]);

  let mediaRecorder = {};
  let chunks = [];

  // Set constraints for getting media
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    // Success async callback
    .then((stream) => {
      console.log("getUserMedia call completed successfully");
      // Set up the recorder with the stream returned by getUserMedia
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorder.onstop = (e) => {
        console.log("recorder stopped");

        const blob = new Blob(chunks, { type: "audio/mpeg" });
        console.log(blob);
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        console.log(audioURL);
        setAudioSrcList([...audioSrcList, audioURL]);
      };
    })
    // Error callback
    .catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });

  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? (
    <>
      <h1>AI Audio Journal</h1>
      <button
        className="record"
        onClick={(e) => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          console.log("recorder started");
          e.target.style.background = "red";
          e.target.style.color = "black";
        }}
      >
        Record
      </button>
      <button
        className="stop"
        onClick={(e) => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          console.log("stop button clicked");
          document.querySelector(".record").style.background = "";
          document.querySelector(".record").style.color = "";
        }}
      >
        Stop
      </button>
      <article className="sound-clips">
        {audioSrcList?.map((src, i) => {
          return (
            <>
              <audio key={i} src={src} controls />
              <button
                onClick={() => {
                  setAudioSrcList(
                    audioSrcList.filter((listing) => listing != src)
                  );
                }}
              >
                Delete
              </button>
            </>
          );
        })}
      </article>
    </>
  ) : (
    <h1>Media not supported</h1>
  );
}

export default App;
