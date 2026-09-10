import User from "../models/user.model";
import { AppError } from "../utils/AppError";

export async function getAllUsers() {
  return User.find().select("-password").sort({ createdAt: -1 });
}

export async function updateUserRole(userId: string, newRole: string, currentUser: { userId: string }) {
  if (userId === currentUser.userId) {
    throw new AppError("You cannot change your own role", 400);
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  user.role = newRole as any;
  await user.save();
  return user;
}