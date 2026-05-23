import bcrypt from "bcryptjs";
import Session from "../models/session.model";
import { Request } from "express";

export async function createSession(
    req: Request,
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
){
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await Session.create({
        userId,
        refreshToken: hashedRefreshToken,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
}