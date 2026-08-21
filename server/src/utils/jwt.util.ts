import jwt  from "jsonwebtoken";

export interface TokenPayload{
    userId : string;
    role : string;
}

export function signAccessToken(payload:TokenPayload): string{
    
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET! as string;
    return jwt.sign(payload,ACCESS_SECRET,{expiresIn : "15m"});
}

export function signRefreshToken(payload:TokenPayload) : string{
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET! as string;
    return jwt.sign(payload,REFRESH_SECRET,{expiresIn : "7d"});
}

export function verifyAccessToken(token:string) : TokenPayload {
    
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET! as string;
    return jwt.verify(token,ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token:string) : TokenPayload {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET! as string;
    return jwt.verify(token,REFRESH_SECRET) as TokenPayload;
}
