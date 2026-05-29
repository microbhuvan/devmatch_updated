import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;
import User from "../models/user.model";
import Session from "../models/session.model";
import { generateTokens, verifyToken } from "../services/token.service";
import { createSession } from "../services/session.service";
import { setAuthCookie } from "../utils/cookie.util";

async function signUp(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const usernameMatched = await User.findOne({ username });
    const emailMatched = await User.findOne({ email });

    if (usernameMatched) {
      return res.status(409).json({ message: "username already taken" });
    }
    if (emailMatched) {
      return res.status(409).json({ message: "email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error("error saving data");
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    await createSession(req, user.id, refreshToken);

    await setAuthCookie(res, accessToken, refreshToken);

    res.status(201).json({
      message: "user added successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ message: "server error" });
  }
}

async function logIn(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "user doesnt exist try again" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    await createSession(req, user.id, refreshToken);

    await setAuthCookie(res, accessToken, refreshToken);

    res.status(201).json({
      message: "user logged in successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function refresh(req: Request, res: Response) {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const payload = jwt.verify(
      incomingRefreshToken,
      JWT_SECRET,
    ) as CustomJwtPayload;

    //finding all tokens of same user of multiple devices
    const sessions = await Session.find({
      userId: payload.id,
    });

    if (!sessions.length) {
      return res.status(401).json({ message: "invalid session" });
    }

    let matchedSession = null;

    for (const session of sessions) {
      const isMatched = await bcrypt.compare(
        incomingRefreshToken,
        session.refreshToken,
      );

      if (isMatched) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      return res.status(403).json({ message: "invalid token" });
    }

    //deleting old token
    await matchedSession.deleteOne();

    const { accessToken, refreshToken } = await generateTokens(payload.id);

    await createSession(req, payload.id, refreshToken);

    return res.status(200).json({
      message: "tokens refreshed successfully",
    });
  } catch (err: any) {
    return res.status(401).json({ message: "refresh unsuccessfull" });
  }
}

async function logout(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "unautorized" });
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET) as CustomJwtPayload;
    const sessions = await Session.find({ userId: payload.id });

    let matchedSession = null;
    for (const session of sessions) {
      const isMatched = await bcrypt.compare(
        refreshToken,
        session.refreshToken,
      );

      if (isMatched) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(401).json({
        message: "session not found",
      });
    }

    await matchedSession.deleteOne();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "logout successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function logoutAll(req: Request, res: Response) {
  try {
    await Session.deleteMany({
      userId: req.user!.id,
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "logout from all devices" });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

export { signUp, logIn, refresh, logout, logoutAll };
