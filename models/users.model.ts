import mongoose from "mongoose";

import { IUser } from "@/interface/users.interface";

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, required: true, default: false },
    isPremiumMember: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ['admin', 'user'], required: true },
})

const User = mongoose.model<IUser>('Users', userSchema);

export default User;