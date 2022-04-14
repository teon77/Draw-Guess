import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../util/socketConnection";

export default function Drawing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, username, action } = location.state;
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  useEffect(() => {
    socket.emit("join_or_create", { username, id: roomId, action });
  }, []);

  socket.on("created_success", ({ room }) => {
    setRoom(room);
    setSuccess(true);
  });

  socket.on("joined_success", ({ joinedId }) => {
    setRoom(joinedId);
    // navigate to game route
    navigate("/game", { state: { room: joinedId, username, action } });
  });

  socket.on("fail", ({ joinedId, msg }) => {
    setSuccess(false);
    setMessage(msg);
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
    </div>
  );
}
