"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessage = void 0;
const generateMessage = (text, username) => {
    return {
        text,
        username: username ?? "性感荷官",
        createdAt: new Date().getTime(),
    };
};
exports.generateMessage = generateMessage;
