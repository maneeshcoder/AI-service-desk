import { response, Response } from "express";

const REFRESH_COOKIE_NAME = "refreshToken";
const isProd = process.env.NODE_ENV === 'production';
export function setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/api/auth",
    });
}

export function clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
}