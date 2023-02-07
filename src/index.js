"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const routers_1 = require("./handlers/routers");
const port = process.env.PORT || 3001;
const server = http_1.default.createServer(app);
app.use(routers_1.router);
const message_js_1 = require("./utils/message.js");
const users_js_1 = require("./utils/users.js");
require("./db/mongoose");
/* eslint-disable @typescript-eslint/no-var-requires */
const io = require("socket.io")(server, {
    cors: { origin: "*" },
});
io.on("connection", (socket) => {
    console.log("new websocket connection");
    socket.on("join", async (joinOption, callback) => {
        const error = await (0, users_js_1.addUserToRoom)({ id: socket.id, ...joinOption });
        if (error) {
            return callback(error.error);
        }
        const roomInfo = await (0, users_js_1.getRoomFromRoomName)(joinOption.room);
        const usersInRoom = roomInfo?.users;
        const room = roomInfo?.room;
        const user = usersInRoom.find((user) => user.id === socket.id);
        if (!user || !room) {
            return;
        }
        socket.join(room);
        socket.emit("message", (0, message_js_1.generateMessage)(`welcome ${user.username}`));
        socket.broadcast
            .to(room)
            .emit("message", (0, message_js_1.generateMessage)(`${user.username} has join the table`));
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
        const roomInfo = await (0, users_js_1.getRoomFromSocketId)(socket.id);
        if (!roomInfo)
            return callback("room not found");
        const user = roomInfo.users.find((user) => user.id === socket.id);
        user.stake = Number(user.stake) - Number(value);
        user.roundBet = Number(user.roundBet) + Number(value);
        roomInfo.pot += Number(value);
        roomInfo.highestBet = roomInfo.users.reduce((a, b) => a.roundBet > b.roundBet ? a : b).roundBet;
        roomInfo.save();
        io.to(roomInfo.room).emit("message", (0, message_js_1.generateMessage)(`${user.username} ${value > 0 ? "betted" : "took"} ${Math.abs(value)} dollars`));
        io.to(roomInfo.room).emit("potUpdate", {
            pot: roomInfo.pot,
            users: roomInfo.users,
            highestBet: roomInfo.highestBet,
        });
        callback();
    });
    socket.on("disconnect", async () => {
        const room = await (0, users_js_1.disconnectUser)(socket.id);
        const user = room?.users.find((user) => user.id === socket.id);
        if (room && user) {
            io.to(room.room).emit("message", (0, message_js_1.generateMessage)(`${user.username} has left us`));
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
