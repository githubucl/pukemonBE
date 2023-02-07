"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getRoomFromSocketId = exports.getRoomFromRoomName = exports.removeUser = exports.disconnectUser = exports.addUserToRoom = void 0;
const mongoose_1 = require("mongoose");
const user_js_1 = require("../models/user.js");
const room_js_1 = require("../models/room.js");
const addUserToRoom = async ({ id, username, room, }) => {
    if (!username || !room) {
        return {
            error: "username and room are must",
        };
    }
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    try {
        const existingRoom = await room_js_1.Rooms.findOne({ room });
        const user = { id, username, onLine: true, stake: 1000, totalBuyIn: 1000 };
        //if there is NO exsiting room then we need to create a new room
        if (!existingRoom) {
            const newRoom = new room_js_1.Rooms({ room, users: [user], pot: 0, smallBlind: 5 });
            await newRoom.save();
            return;
        }
        //User previously in the room but might have lost internet connection
        const exsitingUser = existingRoom.users.find((user) => user.username === username);
        //if theres no exsiting users in the room we create one
        if (!exsitingUser) {
            existingRoom.users.push(user);
            await existingRoom.save();
            return;
        }
        //if user is already in the room and he's status is online then we want to return error message
        // if (exsitingUser.onLine) {
        //   return {
        //     error: `User ${username} is still online!`,
        //   };
        // }
        //if user is already in the room but his status is offline then we want to update his status to online
        await room_js_1.Rooms.findOneAndUpdate(
        // { room, "users.username": username },
        {
            users: {
                $elemMatch: { username },
            },
            room,
        }, { $set: { "users.$.onLine": true, "users.$.id": id } });
    }
    catch (err) {
        if (err instanceof mongoose_1.Error.ValidationError) {
            const messages = Object.values(err.errors).map((err) => err.message);
            return { error: messages };
        }
    }
};
exports.addUserToRoom = addUserToRoom;
const disconnectUser = async (id) => {
    try {
        return await room_js_1.Rooms.findOneAndUpdate({
            users: {
                $elemMatch: { id },
            },
        }, { $set: { "users.$.onLine": false } });
    }
    catch (error) {
        console.log(error);
    }
};
exports.disconnectUser = disconnectUser;
const removeUser = async (id) => {
    return await room_js_1.Rooms.findOneAndDelete({ users: { $elemMatch: { id } } });
};
exports.removeUser = removeUser;
const getRoomFromRoomName = async (roomName) => {
    return await room_js_1.Rooms.findOne({ room: roomName });
};
exports.getRoomFromRoomName = getRoomFromRoomName;
const getRoomFromSocketId = async (id) => {
    return await room_js_1.Rooms.findOne({
        users: {
            $elemMatch: { id },
        },
    });
};
exports.getRoomFromSocketId = getRoomFromSocketId;
const getUsersInRoom = async (room) => {
    const usersInRoom = await user_js_1.Users.find({ room });
    return usersInRoom;
};
exports.getUsersInRoom = getUsersInRoom;
