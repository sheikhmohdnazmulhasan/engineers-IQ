import { Types } from "mongoose";

export type TUser = {
    name: string;
    email: string;
    username: string;
    profileImg?: string;
    password: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
    isBlocked: boolean;
    role: 'admin' | 'user';
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
}