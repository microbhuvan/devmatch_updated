import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({message: "unauthorized"});
        }

        const decoded = jwt.verify(accessToken, JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch(err: any){
        console.log(err.message);
        return res.status(401).json({message: "invalid token"});
    }
}