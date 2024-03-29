import { model, Schema } from "mongoose";
import { TUser } from "../type/types.js";
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
  stake: {
    type: Number,
    required: true,
  },
  roundBet: {
    type: Number,
    required: true,
  },
  totalBuyIn: { type: Number, required: true },
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
  pot: {
    type: Number,
  },
  room: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  highestBet: {
    type: Number,
    required: true,
  },
});

export const Rooms = model("Rooms", roomSchema);
