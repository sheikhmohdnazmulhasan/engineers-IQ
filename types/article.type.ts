import { Document, Types } from "mongoose";

// Define the interface for comments
interface IComment {
    user: Types.ObjectId;
    content: string;
    claps: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Define the interface for the Article document
export interface TArticle extends Document {
    author: Types.ObjectId;
    title: string;
    textArea: string;
    description: string;
    images: string[];
    category: string;
    topics: string[];
    claps: Types.ObjectId[];
    comments: IComment[];
    views: number;
    shares: number;
    isPremiumContent: boolean;
}
