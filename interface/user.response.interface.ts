import { Document } from 'mongoose';

export interface IfollowersAndFollowing {
    _id: string;
    name: string;
    email: string;
    username: string;
    profileImg: string;
    isPremiumMember: boolean;
}

export interface IUserResponse extends Document {
    status: string;
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
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
