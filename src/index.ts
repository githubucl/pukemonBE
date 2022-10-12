import express from "express";

import http from "http";
const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
import { Server } from "socket.io";
import cors from "cors";
import { generateMessage } from "./utils/message";
import { addUser, getUser, getUsersInRoom, removeUser } from "./utils/users";
import "./db/mongoose";
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.on("join", async (options, callback) => {
    const { error, user } = await addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    if (user) {
      socket.join(user.room);
      socket.emit("message", generateMessage(`welcome ${user.username}`));
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage(`${user.username} has join the table`)
        );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      callback();
    }
  });

  socket.on("message", async (message, callback) => {
    const user = await getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(message, user.username));
      callback();
    }
  });

  socket.on("disconnect", async () => {
    const user = await removeUser(socket.id);
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

  socket.on("send-location", async (coordinates, callback) => {
    const user = await getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "location-message",
        generateMessage(
          `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`,
          user.username
        )
      );
      callback();
    }
  });
});
server.listen(port, () => {
  console.log("app is successfully running on port", port);
});
