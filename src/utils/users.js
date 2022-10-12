const Users = require("../models/user");

const addUser = async ({ id, username, room }) => {
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

const removeUser = async (id) => {
  await Users.deleteOne({ id });
};

const getUser = async (id) => {
  const existingUser = await Users.findOne({ id });
  return existingUser;
};

const getUsersInRoom = async (room) => {
  const usersInRoom = await Users.find({ room });
  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
