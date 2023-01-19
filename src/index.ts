import express from "express";
import http from "http";

const app = express();

const port = process.env.PORT || 3001;
const server = http.createServer(app);
import { Server } from "socket.io";
import cors from "cors";
import { generateMessage } from "./utils/message";
import {
  addUserToRoom,
  getRoomFromRoomName,
  getRoomFromSocketId,
  disconnectUser,
} from "./utils/users";
import "./db/mongoose";
import { TUser, TRoomOptions } from "./type/types";
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new websocket connection");

  socket.on("join", async (joinOption: TRoomOptions, callback) => {
    const error = await addUserToRoom({ id: socket.id, ...joinOption });
    if (error) {
      return callback(error.error);
    }
    const roomInfo = await getRoomFromRoomName(joinOption.room);
    const usersInRoom = roomInfo?.users;
    const room = roomInfo?.room;
    const user: TUser = usersInRoom.find(
      (user: TUser) => user.id === socket.id
    );
    if (!user || !room) {
      return;
    }
    socket.join(room);
    socket.emit("message", generateMessage(`welcome ${user.username}`));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${user.username} has join the table`));

    // io.to(room).emit("roomData", {
    //   room,
    //   users: getUsersInRoom(user.room),
    // });

    io.to(room).emit("potUpdate", {
      pot: roomInfo.pot,
      users: roomInfo.users,
    });
    callback();
  });

  socket.on("chipAction", async (value, callback) => {
    const roomInfo = await getRoomFromSocketId(socket.id);
    if (!roomInfo) return callback("room not found");
    const user = roomInfo.users.find((user: TUser) => user.id === socket.id);
    user.stake = Number(user.stake) - Number(value);
    roomInfo.pot += Number(value);
    roomInfo.save();

    io.to(roomInfo.room).emit(
      "message",
      generateMessage(
        `${user.username} ${value > 0 ? "betted" : "took"} ${Math.abs(
          value
        )} dollars`
      )
    );

    io.to(roomInfo.room).emit("potUpdate", {
      pot: roomInfo.pot,
      users: roomInfo.users,
    });
    callback();
  });

  socket.on("disconnect", async () => {
    const room = await disconnectUser(socket.id);
    const user = room?.users.find((user: TUser) => user.id === socket.id);

    if (room && user) {
      io.to(room.room).emit(
        "message",
        generateMessage(`${user.username} has left us`)
      );
      // io.to(room.room).emit("roomData", {
      //   room: user.room,
      //   users: getUsersInRoom(user.room),
      // });
    }
  });
});
server.listen(port, () => {
  console.log("app is successfully running on port", port);
});
