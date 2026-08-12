import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";

export interface AuthRequest extends Request {
    user?: { userId: string; role: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = header.split(" ")[1];
    if (!token) {
    return res.status(401).json({ message: "Malformed authorization header" });
  }
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }catch{
        return res.status(401).json({message:"Invalid or expired token "});
    }
}

