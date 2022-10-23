import { model, Schema } from "mongoose";
import { TUser } from "../type/types";
const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
    lowercase: true,
  },
  id: {
    type: String,
    required: true,
  },
  onLine: {
    type: Boolean,
    required: true,
  },
});
const roomSchema: Schema = new Schema({
  users: {
    type: [userSchema],
    required: true,
    validate: {
      validator: function (val: TUser[]) {
        return val.length <= 8;
      },
      message: function () {
        return "Maximum number of a player in a room is 8";
      },
    },
  },
  poolAmount: {
    type: Number,
  },
  room: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

export const Rooms = model("Rooms", roomSchema);
