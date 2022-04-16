import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../game.css";
import socket from "../util/socketConnection";
import Board from "./Board";
import WordChoosing from "./WordChoosing";


export default function Drawing() {
  const location = useLocation();
  const navigate = useNavigate();

  const { roomId } = location.state;
  const [score, setScore] = useState();
  const [room, setRoom] = useState(0);
  const [players, setPlayers] = useState([]);
  
  const [turn, setTurn] = useState(false);

  const [drawing, setDrawing] = useState("");
  const [picture, setPicture] = useState("");

  const [wait, setWait] = useState(true);
  const [answer, setAnswer] = useState("");
  const [word, setWord] = useState("");

  useEffect(() => { 
    if (roomId) {
      socket.emit("game_data", { roomId });
      socket.on("data", ({ roomId, playersArray, score }) => {
        setScore(score);
        setRoom(roomId);
        setPlayers(playersArray);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => { 
    socket.emit("turn", { roomId });

    socket.on("turn", ({ first }) => { 
      setTurn(first);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
  useEffect(() => {
    if (drawing) {
      socket.emit("submit_draw", { roomId, drawing });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing]);

  useEffect(() => { 
    if (word) {
      socket.emit("submit_word", { roomId, word });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[word]);


  socket.on("submit_draw", ({ drawing }) => {
        setWait(false);
        setPicture(drawing);
  });

  socket.on("correct", ({ newScore, socId }) => { 
    setScore(newScore);
    setWait(true);
    setWord("");
    setAnswer("");
    setDrawing("");
    setPicture("");
    setTurn(!turn)
  });
  

  const handleInputChange = (e) => { 
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {  
    e.preventDefault();
    socket.emit("submit_answer", { roomId, answer });
   }
  
  return (
    <div className="game_app">
      <div className="game_information">
        <span>Room Id: {room} </span> <br />
        <span>Score: {score }</span> <br />
        <span>Players: {players.map((player) => player + " ")} </span>
      </div>
      {turn ?
        (word ? (
          <div className="drawing_area">
            <h2>Drawing: {word}</h2>
            {picture ? ( <span>Waiting for the other Player to guess...</span> ):(<div className="drawing">
            <Board setDrawing={setDrawing}/>
            </div>)}
            
          </div>) : (<WordChoosing setWord={setWord} />)
      
      ) : (
          <div className="guessing_area">
            {wait ? (<div className="waiting">Wait for the other player to draw...</div>) : (
              <div className="guessing">
                <div className="answer">
                  <h2>What is it ?</h2>
                  <input onChange={handleInputChange} type="text" />
                  <button onClick={handleSubmit}>Submit</button>
                </div>
                
                <img src={picture} alt="drawing" width={350} height={350} />
              </div>)}
        </div> )}
      
    </div>
  );
}
