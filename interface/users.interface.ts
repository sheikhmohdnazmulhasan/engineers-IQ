import { Document } from 'mongoose';

interface IfollowersAndFollowing {
    _id: string;
    name: string;
    email: string;
    username: string;
    isPremiumMember: boolean;
}


export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    isEmailVerified: boolean;
    role: 'user' | 'admin';
    profileImg: string;
    isPremiumMember: boolean;
    isBlocked: boolean;
    followers: IfollowersAndFollowing[];
    following: IfollowersAndFollowing[];
    createdAt?: Date;
    updatedAt?: Date;
}
