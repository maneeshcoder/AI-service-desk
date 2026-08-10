import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "employee" | "support-engineer" | "admin"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department?: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ["employee", "support-engineer", "admin"],
            default: "employee"
        },
        department: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>("User", userSchema);