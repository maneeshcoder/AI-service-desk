import { loginUser, registerUser } from "../services/auth.service";
import { Request,Response } from "express"
import { signAccessToken,verifyRefreshToken} from "../utils/jwt.util";
import { setRefreshCookie,clearRefreshCookie } from "../utils/cookie.util";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}


export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = verifyRefreshToken(token);
    const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role });
    res.status(200).json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}



export async function logout(req: Request, res: Response) {
  clearRefreshCookie(res);
  res.status(200).json({ message: "Logged out" });
}