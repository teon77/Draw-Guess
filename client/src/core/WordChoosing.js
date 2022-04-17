import React, { useState, useEffect } from "react";
import socket from "../util/socketConnection";
import "../styles/wordChoose.css";
export default function WordChoosing({ setWord }) {
  const [easy, setEasy] = useState("");
  const [medium, setMedium] = useState("");
  const [hard, setHard] = useState("");

  useEffect(() => {
    socket.emit("get_words");
    socket.on("words", ({ easy, medium, hard }) => {
      setEasy(easy);
      setMedium(medium);
      setHard(hard);
    });
  }, []);

  const handleClick = (e) => {
    setWord(e.target.textContent);
  };

  return (
    <div className="word_app">
      <div className="explain">
        <h1>Choose a word to draw</h1>
        <p>
          Remember, an "Easy" word will give you 1 point, <br />
          a "Medium" word will give you 3 points, <br />
          and a "Hard" word will give you 5 points. <br />
          Click on a word to choose it.
        </p>
      </div>
      <div className="word_choosing">
        <div>
          <label>Easy</label>
          <br />
          <button onClick={handleClick}>{easy}</button>
        </div>
        <div>
          <label>Medium</label>
          <br />
          <button onClick={handleClick}>{medium}</button>
        </div>
        <div>
          <label>Hard</label>
          <br />
          <button onClick={handleClick}>{hard}</button>
        </div>
      </div>
    </div>
  );
}
