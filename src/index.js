const express = require("express");

const http = require("http");
const Filter = require("bad-words");
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const { generateMessage } = require("./utils/message");
const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require("./utils/users");

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage(`welcome ${user.username}`));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has join the chat room`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("message", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed ");
    }
    const user = getUser(socket.id);

    io.to(user.room).emit("message", generateMessage(message, user.username));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left us`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("send-location", (coordinates, callback) => {
    const user = getUser(socket.id);
    console.log(user);
    io.to(user.room).emit(
      "location-message",
      generateMessage(
        `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`,
        user.username
      )
    );
    callback();
  });
});
server.listen(port, () => {
  console.log("app is successfully running on port", port);
});
