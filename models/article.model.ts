import mongoose, { Schema } from "mongoose";

import { TArticle } from "@/types/article.type";

const articleSchema = new Schema<TArticle>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
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
            unique: true
        }
    ],
    clap: {
        type: Number,
        default: 0
    },
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
        default: 0
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
