import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { CustomJwtPayload } from "../types/auth.types";
import User from "../models/user.model";
import Session from "../models/session.model";
import PasswordResetToken from "../models/passwordResetToken.model";
import { generateTokens, verifyToken } from "../services/token.service";
import { createSession } from "../services/session.service";
import { setAuthCookie } from "../utils/cookie.util";

const JWT_SECRET = process.env.JWT_SECRET!;
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
async function signUp(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already taken" });
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
      return res.status(401).json({ message: "invalid credentials" });
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
    await setAuthCookie(res, accessToken, refreshToken);

    // console.log("Incoming refresh token:", !!req.cookies.refreshToken);

    // console.log("Sessions found:", sessions.length);

    // console.log("Matched session:", !!matchedSession);

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

async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.user!.id).select(
      "username email isPremium",
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ message: "server error" });
  }
}

async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }
    //console.log(email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "The user doesnt exist in dematch.",
      });
    }

    //console.log("before delete many");
    // Only one active reset request per user
    await PasswordResetToken.deleteMany({
      userId: user._id,
    });

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    //console.log("before password reset token");

    await PasswordResetToken.create({
      userId: user._id,
      resetTokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

    //console.log("before sending email");
    const resp = await resend?.emails.send({
      from: "DevMatch <noreply@devmatch.co.in>",
      to: email,
      subject: "Reset your DevMatch password",
      html: `
        <h2>Password Reset</h2>

        <p>Click the link below to reset your password.</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>

        <p>If you didn't request this, simply ignore this email.</p>
      `,
    });
    //console.log("we are reaching till here");
    //console.log(resp);

    return res.status(200).json({
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "server error",
    });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await PasswordResetToken.findOne({
      resetTokenHash: hashedToken,
    });

    if (!resetToken) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({
        _id: resetToken._id,
      });

      return res.status(400).json({
        message: "Reset link has expired",
      });
    }

    const user = await User.findById(resetToken.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    // Delete the reset token so it cannot be reused
    await PasswordResetToken.deleteMany({
      _id: resetToken._id,
    });

    // Logout from all devices
    await Session.deleteMany({
      userId: user._id,
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Password reset successful. Please login again.",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await Session.deleteMany({
      userId: user._id,
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Password changed successfully. Please login again.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

export {
  signUp,
  logIn,
  refresh,
  logout,
  logoutAll,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
