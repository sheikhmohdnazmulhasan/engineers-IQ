interface Clap {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
}

interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        username: string;
        isEmailVerified: boolean;
        isPremiumMember: boolean;
    };
    content: string;
    claps: Clap[];
    createdAt: string;
}

interface Author {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
    profileImg: string;
}

export interface IArticleResponse {
    _id: string;
    author: Author;
    title: string;
    textArea: string;
    description: string;
    images: string[];
    category: string;
    topics: string[];
    claps: Clap[];
    views: number;
    shares: number;
    isPremiumContent: boolean;
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}
