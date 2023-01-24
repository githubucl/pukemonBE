"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var connectionURL = "mongodb+srv://".concat(process.env.MONGODB_CREDENTIALS, "@pukemon.bgib8be.mongodb.net/?retryWrites=true&w=majority");
mongoose_1.default
    .connect(connectionURL, {
    useNewUrlParser: true,
})
    .then(function () {
    console.log("Connected to the database ");
})
    .catch(function (err) {
    console.error("Error connecting to the database. n".concat(err));
});
