import { RecordingInterface } from "./RecordingInterface";

import { Audio } from "./Audio";
import { useState, useEffect } from "react";

// audio objects in audioList
// {
//   id
//   audio url
//   blob
//   name of file
//   transcription
// }

function App() {
  const [audioList, setAudioList] = useState([]);

  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? (
    <>
      <h1>AI Audio Journal</h1>
      <RecordingInterface audioList={audioList} setAudioList={setAudioList} />

      <article className="sound-clips">
        {audioList?.map((audio, i) => {
          return <Audio key={i} audio={audio} setAudioList={setAudioList} />;
        })}
      </article>
    </>
  ) : (
    <h1>Media not supported</h1>
  );
}

export default App;
