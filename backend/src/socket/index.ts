import { socketAuth } from "./socketAuth";
import { registerChatEvents } from "./chat.socket";
import { AppServer } from "../types/socket";

const onlineSocketsByUser = new Map<string, Set<string>>();

function markUserOnline(userId: string, socketId: string) {
  const sockets = onlineSocketsByUser.get(userId) ?? new Set<string>();
  const wasOffline = sockets.size === 0;
  sockets.add(socketId);
  onlineSocketsByUser.set(userId, sockets);
  return wasOffline;
}

function markUserOffline(userId: string, socketId: string) {
  const sockets = onlineSocketsByUser.get(userId);
  if (!sockets) {
    return false;
  }

  sockets.delete(socketId);
  if (sockets.size > 0) {
    return false;
  }

  onlineSocketsByUser.delete(userId);
  return true;
}

export function initializeSocket(io: AppServer) {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;
    if (markUserOnline(userId, socket.id)) {
      io.emit("presence_changed", { userId, isOnline: true });
    }

    registerChatEvents(io, socket);

    socket.on("disconnect", () => {
      if (markUserOffline(userId, socket.id)) {
        io.emit("presence_changed", { userId, isOnline: false });
      }
    });
  });
}
