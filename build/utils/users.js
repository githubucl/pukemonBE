"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getRoomFromSocketId = exports.getRoomFromRoomName = exports.removeUser = exports.disconnectUser = exports.addUserToRoom = void 0;
var mongoose_1 = require("mongoose");
var user_js_1 = require("../models/user.js");
var room_js_1 = require("../models/room.js");
var addUserToRoom = function (_a) {
    var id = _a.id, username = _a.username, room = _a.room;
    return __awaiter(void 0, void 0, void 0, function () {
        var existingRoom, user, newRoom, exsitingUser, err_1, messages;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!username || !room) {
                        return [2 /*return*/, {
                                error: "username and room are must",
                            }];
                    }
                    username = username.trim().toLowerCase();
                    room = room.trim().toLowerCase();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, room_js_1.Rooms.findOne({ room: room })];
                case 2:
                    existingRoom = _b.sent();
                    user = { id: id, username: username, onLine: true, stake: 1000, totalBuyIn: 1000 };
                    if (!!existingRoom) return [3 /*break*/, 4];
                    newRoom = new room_js_1.Rooms({ room: room, users: [user], pot: 0, smallBlind: 5 });
                    return [4 /*yield*/, newRoom.save()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
                case 4:
                    exsitingUser = existingRoom.users.find(function (user) { return user.username === username; });
                    if (!!exsitingUser) return [3 /*break*/, 6];
                    existingRoom.users.push(user);
                    return [4 /*yield*/, existingRoom.save()];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
                case 6:
                    //if user is already in the room and he's status is online then we want to return error message
                    if (exsitingUser.onLine) {
                        return [2 /*return*/, {
                                error: "User ".concat(username, " is still online!"),
                            }];
                    }
                    //if user is already in the room but his status is offline then we want to update his status to online
                    return [4 /*yield*/, room_js_1.Rooms.findOneAndUpdate(
                        // { room, "users.username": username },
                        {
                            users: {
                                $elemMatch: { username: username },
                            },
                            room: room,
                        }, { $set: { "users.$.onLine": true, "users.$.id": id } })];
                case 7:
                    //if user is already in the room but his status is offline then we want to update his status to online
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    if (err_1 instanceof mongoose_1.Error.ValidationError) {
                        messages = Object.values(err_1.errors).map(function (err) { return err.message; });
                        return [2 /*return*/, { error: messages }];
                    }
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
exports.addUserToRoom = addUserToRoom;
var disconnectUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, room_js_1.Rooms.findOneAndUpdate({
                        users: {
                            $elemMatch: { id: id },
                        },
                    }, { $set: { "users.$.onLine": false } })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.disconnectUser = disconnectUser;
var removeUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, room_js_1.Rooms.findOneAndDelete({ users: { $elemMatch: { id: id } } })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.removeUser = removeUser;
var getRoomFromRoomName = function (roomName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, room_js_1.Rooms.findOne({ room: roomName })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getRoomFromRoomName = getRoomFromRoomName;
var getRoomFromSocketId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, room_js_1.Rooms.findOne({
                    users: {
                        $elemMatch: { id: id },
                    },
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getRoomFromSocketId = getRoomFromSocketId;
var getUsersInRoom = function (room) { return __awaiter(void 0, void 0, void 0, function () {
    var usersInRoom;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_js_1.Users.find({ room: room })];
            case 1:
                usersInRoom = _a.sent();
                return [2 /*return*/, usersInRoom];
        }
    });
}); };
exports.getUsersInRoom = getUsersInRoom;
