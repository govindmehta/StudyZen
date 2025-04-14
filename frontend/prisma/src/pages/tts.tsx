import { useState } from "react";

const tts: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const extractTextFromPage = (): string => {
    return document.body.innerText || ""; // Get all visible text from the page
  };

  const convertTextToSpeech = async () => {
    const text = extractTextFromPage().trim();
    if (!text) return alert("No readable text on the page!");

    try {
      const response = await fetch("http://127.0.0.1:8000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: "en" }),
      });

      if (response.ok) {
        const blob = await response.blob();
        setAudioSrc(URL.createObjectURL(blob));
      } else {
        alert("Error generating speech!");
      }
    } catch (error) {
      console.error("TTS API error:", error);
      alert("Failed to connect to TTS service!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Text to Speech (React + FastAPI)</h2>
      <p>Click the button to read the text from this page aloud.</p>
      <button onClick={convertTextToSpeech}>Read Page Aloud</button>
      {audioSrc && <audio controls autoPlay src={audioSrc}></audio>}
    </div>
  );
};

export default tts;
