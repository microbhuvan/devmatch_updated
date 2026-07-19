import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import { AppSocket, CustomJwtPayload } from "../types/socket";

export function socketAuth(socket: AppSocket, next: (error?: Error) => void) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const cookies = parseCookie(cookieHeader);

    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;

    socket.data.user = decoded;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
 