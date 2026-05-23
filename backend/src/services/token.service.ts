import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function generateAccessToken(userId: string){
    return jwt.sign(
        { id: userId }, 
        JWT_SECRET, 
        { expiresIn: "15m" }
    );
};

export async function generateRefreshToken(userId: string){
    return jwt.sign(
        { id: userId },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export async function generateTokens(userId: string){
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    return { accessToken, refreshToken };
}

//dont know what to do with verify
export async function verifyToken(token: string){
    return jwt.verify(token, JWT_SECRET);
    
}


