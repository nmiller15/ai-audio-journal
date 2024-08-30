import React from "react";
export function Audio({ audio, setAudioList }) {
  const { audioURL, transcript, title } = audio;
  return (
    <>
      <h2>{title}</h2>
      <audio src={audioURL} controls />
      <button
        onClick={() => {
          setAudioList((prev) => {
            return prev.filter((listing) => listing.audioURL != audio.audioURL);
          });
        }}
      >
        Delete
      </button>
      <p>{audio.transcript}</p>
    </>
  );
}
