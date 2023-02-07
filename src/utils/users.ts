import { Error } from "mongoose";
import { Users } from "../models/user.js";
import { Rooms } from "../models/room.js";

export const addUserToRoom = async ({
  id,
  username,
  room,
}: {
  id: string;
  username: string;
  room: string;
}) => {
  if (!username || !room) {
    return {
      error: "username and room are must",
    };
  }
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  try {
    const existingRoom = await Rooms.findOne({ room });
    const user = { id, username, onLine: true, stake: 1000, totalBuyIn: 1000 };

    //if there is NO exsiting room then we need to create a new room
    if (!existingRoom) {
      const newRoom = new Rooms({ room, users: [user], pot: 0, smallBlind: 5 });

      await newRoom.save();

      return;
    }

    //User previously in the room but might have lost internet connection
    const exsitingUser = existingRoom.users.find(
      (user: { username: string }) => user.username === username
    );

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
    await Rooms.findOneAndUpdate(
      // { room, "users.username": username },
      {
        users: {
          $elemMatch: { username },
        },
        room,
      },
      { $set: { "users.$.onLine": true, "users.$.id": id } }
    );
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return { error: messages };
    }
  }
};

export const disconnectUser = async (id: string) => {
  try {
    return await Rooms.findOneAndUpdate(
      {
        users: {
          $elemMatch: { id },
        },
      },
      { $set: { "users.$.onLine": false } }
    );
  } catch (error) {
    console.log(error);
  }
};

export const removeUser = async (id: string) => {
  return await Rooms.findOneAndDelete({ users: { $elemMatch: { id } } });
};

export const getRoomFromRoomName = async (roomName: string) => {
  return await Rooms.findOne({ room: roomName });
};

export const getRoomFromSocketId = async (id: string) => {
  return await Rooms.findOne({
    users: {
      $elemMatch: { id },
    },
  });
};

export const getUsersInRoom = async (room: string) => {
  const usersInRoom = await Users.find({ room });
  return usersInRoom;
};
