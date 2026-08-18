import bcrypt from "bcrypt";
import User  from "../models/user.model";
import { signAccessToken,signRefreshToken } from "../utils/jwt.util";
import { AppError } from "../utils/AppError";

export async function registerUser(name:string,email:string,password:string){
    const existing = await User.findOne({email});
    if(existing) throw new AppError("Email already registered",409);
    const hashed = await bcrypt.hash(password,10);
    const user = await User.create({name,email,password : hashed});
    return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid credentials",401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Invalid credentials",401);

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { user, accessToken, refreshToken };
}