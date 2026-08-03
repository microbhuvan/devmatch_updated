import { Response } from "express";

export async function setAuthCookie(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //only browser and server can read , XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //CSRF cross site request forgery
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
