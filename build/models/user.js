"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20,
        lowercase: true,
        unique: true,
    },
    id: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
});
exports.Users = mongoose_1.default.model("Users", userSchema);
