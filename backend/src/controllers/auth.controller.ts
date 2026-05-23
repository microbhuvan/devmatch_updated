import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Session from "../models/session.model";
import User from "../models/user.model";
const JWT_SECRET = process.env.JWT_SECRET;

async function signUp(req:Request , res:Response){
    try{
        const { username, email, password, isPremium } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "invalid credentials"});
        }

        const usernameMatched = await User.findOne({username});
        const emailMatched = await User.findOne({email});

        if(usernameMatched){
            return res.status(409).json({message: "username already taken"});
        }
        if(emailMatched){
            return res.status(409).json({message: "email already taken"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isPremium
        })

        if(!user){
            throw new Error("error saving data");
        }

        const accessToken = await jwt.sign({id:user.id}, JWT_SECRET, {
            expiresIn: "15m"
        });

        const refreshToken = await jwt.sign({id:user.id}, JWT_SECRET, {
            expiresIn: "7d"
        });

        const hashedRefrehToken = await bcrypt.hash(refreshToken, 10);

        await Session.create({
            userId: user.id,
            refreshToken: hashedRefrehToken,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.status(201)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .json({message: "user added successfully", user: {
            id: user.id,
            username: user.username,
            email: user.email,
        }});
        
    }
    catch(err: any){
        console.log(err.message);
        return res.status(500).json({message: "server error",});
    }
}

export { signUp };