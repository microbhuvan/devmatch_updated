import { socketAuth } from "./socketAuth";
import { registerChatEvents, userRoom } from "./chat.socket";
import { AppServer } from "../types/socket";

export function initializeSocket(io: AppServer) {
  io.use(socketAuth);
  io.on("connection", (socket) => {
    // Join a room for the specific user
    socket.join(userRoom(socket.data.user.id));

    registerChatEvents(io, socket);
  });
}
