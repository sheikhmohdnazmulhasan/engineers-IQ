
export interface IUserResponse {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
    isBlocked: boolean;
    profileImg: string;
    role: string;
    followers: string[];
    following: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}
