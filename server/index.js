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
  const user = { username: username, id };
  rooms[roomId]["users"].push(user);
};

const createRoom = (roomId, socketId) => {
  rooms[roomId] = {
    users: [],
    word: null,
    score: 0,
    firstDrawer: socketId,
  };
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("game_data", ({ roomId }) => {
    let playersArray = [];
    if (rooms[roomId]) {
      for (user of rooms[roomId]["users"]) {
        playersArray.push(user["username"]);
      }
      io.in(roomId).emit("data", {
        roomId,
        playersArray,
        score: rooms[roomId]["score"],
      });
    }
  });

  // sending only the first player an event to take turns
  socket.on("turn", ({ roomId }) => {
    if (rooms[roomId]) {
      let artistId = rooms[roomId]["firstDrawer"];
      io.to(artistId).emit("turn", { first: true });
    }
  });

  socket.on("start_game", ({ roomId }) => {
    if (rooms[roomId]) {
      io.in(roomId).emit("start_game");
    }
  });

  socket.on("submit_draw", ({ roomId, drawing }) => {
    if (rooms[roomId]) {
      io.to(roomId).emit("submit_draw", { drawing });
    }
  });

  socket.on("submit_word", ({ roomId, word }) => {
    if (rooms[roomId]) {
      rooms[roomId]["word"] = word;
    }
  });

  socket.on("submit_answer", ({ roomId, answer }) => {
    if (rooms[roomId]) {
      if (rooms[roomId]["word"].toLowerCase() === answer.toLowerCase()) {
        len = answer.length;
        if (len <= 4) {
          rooms[roomId]["score"] += 1;
        } else if (len === 5) {
          rooms[roomId]["score"] += 3;
        } else {
          rooms[roomId]["score"] += 5;
        }
        io.in(roomId).emit("correct", { newScore: rooms[roomId]["score"] });
      } else {
        io.in(roomId).emit("wrong");
      }
    } else {
      return;
    }
  });

  socket.on("get_words", ({ roomId }) => {
    if (rooms[roomId]) {
      io.in(roomId).emit("words", {
        easy: words.easy[Math.floor(Math.random() * words.easy.length)],
        medium: words.medium[Math.floor(Math.random() * words.medium.length)],
        hard: words.hard[Math.floor(Math.random() * words.hard.length)],
      });
    }
  });

  socket.on("create_room", ({ username }) => {
    let randomId = uuidv4();
    createRoom(randomId, socket.id);
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
      socket.emit("fail", {
        msg: "Room is full, The game is made for 2 Players ",
      });
    }
  });

  socket.on("disconnect", () => {
    if (!rooms) {
      return;
    }
    for (roomId in rooms) {
      let user = rooms[roomId]["users"].find(
        (user) => user["id"] === socket.id
      );
      if (user) {
        delete rooms[roomId];
        continue;
      }
    }
  });
});

server.listen(port, () => {
  console.log("Server is running on port 8181");
});
