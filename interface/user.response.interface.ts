export interface IUserResponse {
    success: boolean;
    data: UserData;
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
    isBlocked: boolean;
    role: string;
    followers: string[];
    following: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}
