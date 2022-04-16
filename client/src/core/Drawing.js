import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../game.css";
import socket from "../util/socketConnection";
import Board from "./Board";

export default function Drawing() {
  const location = useLocation();
  const { roomId } = location.state;
  const [score, setScore] = useState();
  const [room, setRoom] = useState(0);
  const [players, setPlayers] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => { 
    if (roomId) {
      socket.emit("game_data", { roomId });
      socket.on("data", ({ roomId, playersArray, score }) => {
        setScore(score);
        setRoom(roomId);
        setPlayers(playersArray);
      });
    }
  }, []);
  
  useEffect(() => { 
    if (roomId) {
      socket.emit("turn", { roomId });
    }
    socket.on("turn", ({ artistId }) => { 
      setDrawing(artistId === socket.id);
    });
  }, [score])
 
  return (
    <div className="game_app">
      <div className="game_information">
        <span>Room Id: {room} </span> <br />
        <span>Score: {score }</span> <br />
        <span>Players: {players.map((player) => player + " ")} </span>
      </div>
      <div className="drawing_area">
      <div className="drawing">
        <Board />
        </div>
        </div>
      <div className="options">
        {drawing ? ( <span>Its Your turn to draw</span> ):( <span>The other player is drawing now...</span> )}
      </div>
    </div>
  );
}
