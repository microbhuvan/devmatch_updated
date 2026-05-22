import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response } from "express";

async function signUp(req:Request , res:Response){

    const { username, email, password, about, skills, age, gender, photoURL } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message: "invalid credentials"});
    }

}

export { signUp };