import React, { useState, useEffect, useRef } from "react";

export function RecordingInterface({ audioList, setAudioList }) {
  const [currentAudio, setCurrentAudio] = useState({});
  const [recordActive, setRecordActive] = useState(false);
  const [transcriptChunks, setTranscriptChunks] = useState([]);

  let mediaRecorderRef = useRef(null); // To persist mediaRecorder across renders
  let recognitionRef = useRef(null);

  let nonStateTranscriptChunks;
  let chunks = [];
  let blob;
  let mediaRecorder;

  const handleStart = (e) => {
    mediaRecorderRef.current.start();
    recognitionRef.current.start();
    setRecordActive(true);
  };

  const handleStop = (e) => {
    mediaRecorderRef.current.stop();
    recognitionRef.current.stop();
    setRecordActive(false);
  };

  // * Update the audio list when a complete currentAudio object is formed
  // Each time current audio updates, check if you have a complete audio object
  // if you do, post it to the audio list and reset the recording interface
  useEffect(() => {
    let isAudioURL = false;
    let isBlob = false;
    let isTranscript = false;
    let isTitle = false;

    const currentAudioKeys = Object.keys(currentAudio);
    currentAudioKeys.forEach((key) => {
      if (key == "audioURL") isAudioURL = true;
      if (key == "blob") isBlob = true;
      if (key == "transcript") isTranscript = true;
      if (key == "title") isTitle = true;
    });
    if (isAudioURL && isBlob && isTranscript && isTitle) {
      setAudioList((prev) => {
        return [...prev, currentAudio];
      });
      setCurrentAudio({});
      setRecordActive(false);
    }
  }, [currentAudio]);

  // * Effect to set up the Media Recording
  // * and voice recognition services.
  // * only runs on initial load.

  useEffect(() => {
    //* Media Recorder
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        // Set up the recorder with the stream returned by getUserMedia
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        // Stop event handler
        mediaRecorder.onstop = (e) => {
          console.log("MEDIA STOP");
          blob = new Blob(chunks, { type: "audio/mpeg" });
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          const title = prompt("Enter a title for your audio clip:");
          setCurrentAudio((prev) => {
            return {
              ...prev,
              title,
              blob,
              audioURL,
            };
          });
        };
        mediaRecorderRef.current = mediaRecorder; // Store the current mediaRecorder in reference
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });

    //* Speech Recognition
    // Speech API Settings
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // On each completed interpretation
    recognition.onresult = (e) => {
      console.log("RECONITION RESULT");
      const resultChunk = e.results[e.results.length - 1][0].transcript.trim();
      setTranscriptChunks((prev) => {
        const updatedChunks = [...prev, resultChunk];
        // const newTranscript = updatedChunks.join(". ");
        // setCurrentAudio((prev) => {
        //   return {
        //     ...prev,
        //     transcript: newTranscript,
        //   };
        // });
        console.log(updatedChunks);
        return updatedChunks;
      });
    };

    // When the stop event is fired
    recognition.onaudioend = (e) => {
      console.log("RECONITION END");
      console.log(transcriptChunks);
      setTranscriptChunks((prev) => {
        const transcript = prev.join(". ");
        setCurrentAudio((prev) => {
          return {
            ...prev,
            transcript,
          };
        });
        return [];
      });
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      {transcriptChunks ? (
        transcriptChunks.map((chunk, i) => {
          return <p key={i}>{chunk}</p>;
        })
      ) : (
        <></>
      )}
      <button
        style={recordActive ? { backgroundColor: "red", color: "black" } : {}}
        className="record"
        onClick={handleStart}
      >
        Record
      </button>
      <button className="stop" onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
