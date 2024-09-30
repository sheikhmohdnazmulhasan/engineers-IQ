import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    isEmailVerified: boolean;
    role: 'user' | 'admin';
    profileImg: string;
    isPremiumMember: boolean;
    isBlocked: boolean;
    followers: string[];
    following: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
