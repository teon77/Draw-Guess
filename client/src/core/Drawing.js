import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:8181/");

export default function Drawing() {
  const location = useLocation();
  const { roomId, username, action } = location.state;
  const [room, setRoom] = useState("");

  const handleSend = () => {
    socket.emit("send_word", { word: "hey", username, room: room });
  };

  useEffect(() => {
    socket.emit("join_or_create", { username, id: roomId, action });
  }, []);

  socket.on("created_success", ({ room }) => {
    console.log("wow: " + room);
    setRoom(room);
  });

  socket.on("joined_success", ({ joinedId }) => {
    setRoom(joinedId);
  });

  socket.on("receive", ({ word, username }) => {
    console.log(`${username} sent ${word}`);
  });

  return (
    <div>
      room: {room}, username: {username}, action: {action}
      <button onClick={handleSend}>send</button>
    </div>
  );
}
