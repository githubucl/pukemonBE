import { Users } from "../models/user";

export const addUser = async ({
  id,
  username,
  room,
}: {
  id: string;
  username: string;
  room: string;
}) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "username and room are a must",
    };
  }

  const existingUser = await Users.findOne({ username });

  if (existingUser) {
    return {
      error: "Usrename is in use!",
    };
  }
  const user = new Users({ id, username, room });
  await user.save();
  return { user };
};

export const removeUser = async (id: string) => {
  const user = await Users.findOneAndDelete({ id });
  return user;
};

export const getUser = async (id: string) => {
  const existingUser = await Users.findOne({ id });
  return existingUser;
};

export const getUsersInRoom = async (room: string) => {
  const usersInRoom = await Users.find({ room });
  return usersInRoom;
};
