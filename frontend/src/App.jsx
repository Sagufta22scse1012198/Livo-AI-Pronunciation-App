import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [score, setScore] = useState(null);
  const [expected, setExpected] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [feedback, setFeedback] = useState("");

  const uploadAudio = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);

    
    setTranscription(data.transcription);
    setScore(data.score);
    setExpected(data.expected);
    setMistakes(data.mistakes);
    setFeedback(data.feedback);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Livo AI Pronunciation Assessment</h1>

      <p>Upload an English audio file (30–45 seconds)</p>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadAudio}>
        Analyze Pronunciation
      </button>
      {transcription && (
  <div style={{ marginTop: "20px" }}>
    <h3>Transcription</h3>
    <textarea
      value={transcription}
      readOnly
      rows="10"
      cols="70"
    />
  </div>
)}
{score !== null && (
  <div style={{ marginTop: "20px" }}>
    <h2>Pronunciation Score</h2>

<div
  style={{
    width: "400px",
    height: "20px",
    background: "#ddd",
    margin: "20px auto",
    borderRadius: "10px",
  }}
>
  <div
    style={{
      width: `${score}%`,
      height: "100%",
      background:
        score >= 80 ? "green" : score >= 50 ? "orange" : "red",
      borderRadius: "10px",
    }}
  ></div>
</div>

<h1>{score}%</h1>

    <h3>Expected Sentence</h3>

<textarea
  value={expected}
  readOnly
  rows="4"
  cols="70"
/>

<h3>Mistakes</h3>

<ul style={{ textAlign: "left", display: "inline-block" }}>
  {mistakes.map((m, index) => (
    <li key={index}>
      ❌ You said <b>{m.spoken}</b> instead of <b>{m.expected}</b>
    </li>
  ))}
</ul>

{feedback && (
  <div style={{ marginTop: "20px" }}>
    <h2>Feedback</h2>
    <p>{feedback}</p>
  </div>
)}

</div>

)}
    </div>
  );
}

export default App;