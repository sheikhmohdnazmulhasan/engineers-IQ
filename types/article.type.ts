import { Document, Types } from "mongoose";

// Define the interface for comments
interface IComment {
    user: Types.ObjectId;
    content: string;
    clap: number;
}

// Define the interface for the Article document
export interface TArticle extends Document {
    user: Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    category: string;
    topics: string[];
    clap: number;
    comments: IComment[];
    views: number;
    shares: number;
    isPremiumContent: boolean;
}
