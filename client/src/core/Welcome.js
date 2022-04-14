import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joinRoom, setJoinRoom] = useState(false);

  const navigate = useNavigate();
  const handleChange = () => {
    setJoinRoom(!joinRoom);
  };

  const handleStart = () => {
    if (username !== "") {
      if (roomId !== "") {
        navigate("/game", { state: { roomId, username, action: "join" } });
      } else {
        navigate("/game", {
          state: { username, action: "create" },
        });
      }
    }
  };

  return (
    <div className="app">
      <div className="login">
        <h1>Draw & Guess!</h1>
        <input
          type="text"
          placeholder="Nickname..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required={true}
        />

        {!joinRoom ? (
          <button onClick={handleStart}>Create Room</button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Room Id..."
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
              required={true}
            />
            <button onClick={handleStart}>Enter Room</button>
          </>
        )}
        <span>I already have room Id</span>
        <input
          placeholder="I already have room Id"
          type="checkbox"
          checked={joinRoom}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
