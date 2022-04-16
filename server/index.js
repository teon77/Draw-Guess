require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { Server } = require("socket.io");
const { words } = require("./data/words");
const port = process.env.PORT || 8181;

const app = express();
app.use(cors());

let rooms = {};

const createUser = (id, username, roomId) => {
  const user = { username: username, id, turns: 0 };
  rooms[roomId]["users"].push(user);
  return user;
};

const createRoom = (roomId) => {
  rooms[roomId] = {
    users: [],
    word: null,
    artistId: null,
    score: 0,
  };
};

const getArtistId = (roomId) => {
  // Get the user with the least turns
  const users = rooms[roomId]["users"];
  let turns = users[0]["turns"];
  let index = 0;
  for (let i = 1; i < users.length; i++) {
    if (users[i]["turns"] < turns) {
      turns = users[i]["turns"];
      index = i;
    }
  }
  rooms[roomId]["users"][index]["turns"] += 1;
  return rooms[roomId]["users"][index]["id"];
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("game_data", ({ roomId }) => {
    let playersArray = [];
    for (user of rooms[roomId]["users"]) {
      playersArray.push(user["username"]);
    }
    io.in(roomId).emit("data", {
      roomId,
      playersArray,
      score: rooms[roomId]["score"],
    });
  });

  socket.on("turn", ({ roomId }) => {
    const artistId = getArtistId(roomId);
    io.in(roomId).emit("turn", { artistId });
  });

  socket.on("GUESS", ({ roomId, guess }) => {
    // Can also be moved to client as the client is aware of the word
    const index = rooms[roomId]["users"].findIndex(
      (user) => user.id === socket.id
    );
    if (guess.toLowerCase() === rooms[roomId]["word"].toLowerCase()) {
      rooms[roomId]["users"][index]["score"] += 1;
      socket.emit("GUESS", "Correct", {
        score: rooms[roomId]["users"][index]["score"],
      });
    } else {
      socket.emit("GUESS", "Wrong", {
        score: rooms[roomId]["users"][index]["score"],
      });
    }
  });

  socket.on("create_room", ({ username }) => {
    let randomId = uuidv4();
    createRoom(randomId);
    createUser(socket.id, username, randomId);
    socket.join(randomId);
    socket.emit("created_success", { room: randomId });
  });

  socket.on("join_room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("fail", { msg: "Room does not exist" });
    }
    if (rooms[roomId]["users"].length < 2) {
      createUser(socket.id, username, roomId);
      socket.join(roomId);
      io.in(roomId).emit("joined_success", { joinedId: roomId, username });
    } else {
      socket.emit("fail", { msg: "Room is full" });
    }
  });

  socket.on("disconnect", () => {
    if (!rooms) {
      return;
    }
    for (roomId in rooms) {
      if (rooms[roomId]["users"].length === 0) {
        delete rooms[roomId];
        continue;
      }
    }
    console.log(`Client disconnected, socketId: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log("Server is running on port 8181");
});
