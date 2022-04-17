import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../game.css";
import socket from "../util/socketConnection";
import Board from "./Board";
import WordChoosing from "./WordChoosing";

export default function Drawing() {
  const location = useLocation();

  const { roomId } = location.state;
  const [score, setScore] = useState();
  const [room, setRoom] = useState(0);
  const [players, setPlayers] = useState([]);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const [turn, setTurn] = useState(false);

  const [drawing, setDrawing] = useState("");
  const [picture, setPicture] = useState("");

  const [wait, setWait] = useState(true);
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState("");
  const [wrong, setWrong] = useState(false);
  const [endGame, setEndGame] = useState(false);

  useEffect(() => {
    if (roomId) {
      socket.emit("game_data", { roomId });
      socket.on("data", ({ roomId, playersArray, score }) => {
        setScore(score);
        setRoom(roomId);
        setPlayers(playersArray);
      });

      socket.emit("turn", { roomId });

      socket.on("turn", ({ first }) => {
        setTurn(first);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (drawing) {
      socket.emit("submit_draw", { roomId, drawing });
    }
    if (word) {
      socket.emit("submit_word", { roomId, word });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing, word]);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          setEndGame(true);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  socket.on("submit_draw", ({ drawing }) => {
    setWait(false);
    setPicture(drawing);
  });

  socket.on("correct", ({ newScore }) => {
    // setting up new turn and change rules between players
    setScore(newScore);
    setWait(true);
    setWord("");
    setAnswer("");
    setDrawing("");
    setPicture("");
    setWrong(false);
    setTurn(!turn);
  });

  socket.on("wrong", () => {
    setWrong(true);
  });

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("submit_answer", { roomId, answer });
  };

  return (
    <div className="game_app">
      <div className="game_information">
        <span>Room Id: {room} </span> <br />
        <span>Players: {players.join(" & ")} </span> <br />
        <span>Score: {score}</span> <br />
        <span>
          Time:{" "}
          {minutes === 0 && seconds === 0 ? null : (
            <>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </>
          )}{" "}
        </span>
      </div>
      {endGame ? (
        <div className="end_game">
          <h1>The game has ended, Great job!</h1>
          <p>You achieved {score} points in 10 minutes!</p>
        </div>
      ) : (
        <div className="game_container">
          {turn ? (
            word ? (
              <div className="drawing_area">
                <h2>Drawing: {word}</h2>
                {picture ? (
                  <span>Waiting for the other Player to guess...</span>
                ) : (
                  <div className="drawing">
                    <Board setDrawing={setDrawing} />
                  </div>
                )}
              </div>
            ) : (
              <WordChoosing setWord={setWord} />
            )
          ) : (
            <div className="guessing_area">
              {wait ? (
                <div className="waiting">
                  Wait for the other player to draw...
                </div>
              ) : (
                <div className="guessing">
                  <div className="answer">
                    <h2>What is it ?</h2>
                    <input onChange={handleInputChange} type="text" />
                    <button onClick={handleSubmit}>Submit</button>
                    {wrong ? <span>Wrong answer</span> : <></>}
                  </div>
                  <img src={picture} alt="drawing" width={250} height={250} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
