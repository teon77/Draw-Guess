import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../util/socketConnection";
import "../app.css";
export default function Drawing() {
  const location = useLocation();
  const navigate = useNavigate();

  const { roomId, username, action } = location.state;

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [players, setPlayers] = useState([]);

  const copyToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } else {
      setIsCopied(true);
      // for different browsers support
      return document.execCommand("copy", true, text);
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const startGame = () => {
    socket.emit("start_game", { roomId: room });
  };

  useEffect(() => {
    if (action === "create") {
      socket.emit("create_room", { username });
    } else {
      socket.emit("join_room", { roomId, username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  socket.on("created_success", ({ room }) => {
    setRoom(room);
    setSuccess(true);
  });

  socket.on("joined_success", ({ joinedId }) => {
    socket.emit("game_data", { roomId: joinedId });
    socket.on("data", ({ playersArray }) => {
      setRoom(joinedId);
      setSuccess(true);
      setReady(true);
      setPlayers(playersArray);
    });
  });

  socket.on("fail", ({ msg }) => {
    setSuccess(false);
    setMessage(msg);
  });

  socket.on("start_game", () => {
    navigate("/game", { state: { roomId: room } });
  });

  return (
    <div className="waiting_room">
      <div className="information">
        <div className="information_bar">
          {success ? (
            <div className="room_id">
              Room ID: {room}{" "}
              <button
                className="copy_button"
                onClick={(e) => {
                  e.preventDefault();
                  copyToClipboard(room);
                }}
              >
                {isCopied ? <>&#10003;</> : "Copy"}
              </button>
            </div>
          ) : (
            <></>
          )}
          <div>UserName: {username}</div>
        </div>
      </div>
      {ready ? (
        <div className="explain">
          <h2>Looks like everybody is here!</h2>
          <h3>Welcome {players.join(" and ")}!</h3>
          <p>
            You will get to choose between 3 random words. <br />
            One player will draw and the other will guess. an "Easy" word will
            give you 1 point, <br />
            a "Medium" word will give you 3 points, <br />
            and a "Hard" word will give you 5 points. <br />
            Each game lasts 10 minutes, try to score as many points as you can!{" "}
            <br /> when you are ready, click the button below.
          </p>
          <button onClick={startGame}>Lets Go</button>
        </div>
      ) : (
        <>
          {" "}
          {success ? (
            <div className="loader">Waiting for another player to join ...</div>
          ) : (
            <div className="loader">
              {message}{" "}
              <button className="copy_button" onClick={navigateToHome}>
                Go Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
