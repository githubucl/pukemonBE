"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
const roomSchema = new mongoose_1.Schema({
    users: {
        type: [userSchema],
        required: true,
        validate: {
            validator: function (val) {
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
exports.Rooms = (0, mongoose_1.model)("Rooms", roomSchema);
