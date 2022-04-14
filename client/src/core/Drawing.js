import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../util/socketConnection";

export default function Drawing() {
  const location = useLocation();
  const navigate = useNavigate();

  const { room, username, action } = location.state;

  const handleSend = () => {
    socket.emit("send_word", { word: "hey", username, room: room });
  };

  socket.on("receive", ({ word, username }) => {
    console.log(`${username} sent ${word}`);
  });

  return (
    <div>
      <button onClick={handleSend}>send</button>
    </div>
  );
}
