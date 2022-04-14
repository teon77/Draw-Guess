require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const { words } = require("./data/words");
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join_or_create", ({ username, id, action }) => {
    if (username !== "" && action !== "") {
      if (action === "create") {
        const createRoom = uuidv4();
        socket.join(createRoom);
        socket.emit("created_success", { room: createRoom });
      } else if (action === "join") {
        console.log("join: " + id);
        socket.join(id);
        socket.emit("joined_success", { joinedId: id });
      }
    }
  });

  socket.on("send_word", ({ word, username, room }) => {
    console.log(
      "User: " + username + " sent word: " + word + " to room: " + room
    );
    socket.to(room).emit("receive", { word, username });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected, socketId: ${socket.id}`);
  });
});

server.listen(8181, () => {
  console.log("Server is running on port 8181");
});
