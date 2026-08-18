import User from "../models/user.model";

export async function getAllUsers() {
  return User.find().select("-password").sort({ createdAt: -1 });
}