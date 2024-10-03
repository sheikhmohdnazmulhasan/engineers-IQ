import mongoose, { Schema } from "mongoose";

import { TArticle } from "@/types/article.type";

const articleSchema = new Schema<TArticle>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    topics: [
        {
            type: String,
            required: true,
        }
    ],
    claps: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            content: {
                type: String,
                required: true
            },
            clap: {
                type: Number,
                default: 0
            }
        }
    ],
    views: {
        type: Number,
        default: 0,
        min: [0, 'views count cannot be negative']
    },
    shares: {
        type: Number,
        default: 0,
        min: [0, 'views count cannot be negative']
    },
    isPremiumContent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Article = mongoose.models.Article || mongoose.model<TArticle>('Article', articleSchema);

export default Article;
