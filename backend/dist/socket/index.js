"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const socketAuth_1 = require("./socketAuth");
const chat_socket_1 = require("./chat.socket");
function initializeSocket(io) {
    io.use(socketAuth_1.socketAuth);
    io.on("connection", (socket) => {
        // Join a room for the specific user
        socket.join((0, chat_socket_1.userRoom)(socket.data.user.id));
        (0, chat_socket_1.registerChatEvents)(io, socket);
    });
}
