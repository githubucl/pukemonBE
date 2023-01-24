"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessage = void 0;
var generateMessage = function (text, username) {
    return {
        text: text,
        username: username !== null && username !== void 0 ? username : "性感荷官",
        createdAt: new Date().getTime(),
    };
};
exports.generateMessage = generateMessage;
