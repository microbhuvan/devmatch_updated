import jwt from "jsonwebtoken";
import { AppSocket, CustomJwtPayload } from "../types/socket";

export function socketAuth(socket: AppSocket, next: (error?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;

    if (typeof token !== "string") {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
    socket.data.user = decoded;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
