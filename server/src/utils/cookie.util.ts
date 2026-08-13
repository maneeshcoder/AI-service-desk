import { response, Response } from "express";

const REFRESH_COOKIE_NAME = "refreshToken";

export function setRefreshCookie(res:Response,token : string){
    res.cookie(REFRESH_COOKIE_NAME,token,{
        httpOnly:true,
        secure:process.env.NODE_ENV=="production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        path:"/api/auth",
    });
}

export function clearRefreshCookie(res:Response){
    res.clearCookie(REFRESH_COOKIE_NAME,{path:"/api/auth"});
}