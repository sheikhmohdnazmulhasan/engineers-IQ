export interface IClap {
    _id: string;
    name: string;
    email: string;
    username: string;
    isEmailVerified: boolean;
    isPremiumMember: boolean;
}

export interface IComment {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        username: string;
        isEmailVerified: boolean;
        isPremiumMember: boolean;
        profileImg: string;
    };
    content: string;
    claps: IClap[];
    createdAt: string;
    updatedAt: string;
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
    claps: IClap[];
    views: number;
    shares: number;
    isPremiumContent: boolean;
    comments: IComment[];
    createdAt: string;
    updatedAt: string;
}


export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}
