/* eslint-disable no-console */

/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { FilterQuery, Types } from "mongoose";

import Article from "@/models/article.model";
import User from "@/models/users.model"
import connectMongodb from "@/libs/connect_mongodb";
import { TArticle } from "@/types/article.type";

interface Cache<T> {
    data: T | null;
    lastFetch: number | null;
    expiration: number;
}

const userCache: Cache<any> = {
    data: null,
    lastFetch: null,
    expiration: 1800000,
};

// Creating new article
export async function POST(request: Request) {
    const data = await request.json();

    try {
        await connectMongodb();
        const result = await Article.create(data);

        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Article Published',
                data: result
            }, { status: httpStatus.CREATED });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to publish the article'
        }, { status: httpStatus.BAD_REQUEST });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while creating the article',
            error: error.message
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const searchTerm = searchParams.get('searchTerm') || '';
    const category = searchParams.get('category') as string | null;
    const author = searchParams.get('author') as string | null;
    const isPremiumContent = searchParams.get('isPremiumContent') as string | null;
    const topic = searchParams.get('topic') as string | null;
    const _id = searchParams.get('_id') as string | null;

    // Define the query using the appropriate MongoDB FilterQuery type
    const query: FilterQuery<TArticle> = {};

    try {
        await connectMongodb(); // Call once at the start

        // Check if users are cached and not expired
        if (!userCache.data || !userCache.lastFetch || (Date.now() - userCache.lastFetch) > userCache.expiration) {
            try {
                userCache.data = await User.find().exec();
                userCache.lastFetch = Date.now();
                console.log('Users fetched from database');

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        } else {
            console.log('Using cached users');
        }

        // If _id is provided, fetch the article by its _id directly
        if (_id) {
            const article = await Article.findById(new Types.ObjectId(_id))
                .populate({
                    path: 'author',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                })
                .populate({
                    path: 'claps',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                })
                .populate({
                    path: 'comments.user',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                })
                .populate({
                    path: 'comments.claps',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                })
                .sort({ createdAt: -1 });

            if (!article) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: 'Article successfully retrieved',
                data: article,
            }, { status: 200 });
        }

        // Partial search for title, description, category, and topics
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { textArea: { $regex: searchTerm, $options: 'i' } },
                { topics: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        // Apply filters if provided
        if (category) query.category = category;
        if (author && Types.ObjectId.isValid(author)) query.author = new Types.ObjectId(author);
        if (isPremiumContent) query.isPremiumContent = isPremiumContent === 'true';
        if (topic) query.topics = { $in: [topic] };

        // Fetch matching articles
        const data = await Article.find(query)
            .populate({
                path: 'author',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            })
            .populate({
                path: 'claps',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            })
            .populate({
                path: 'comments.user',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            })
            .populate({
                path: 'comments.claps',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: 'Articles successfully retrieved',
            data: data,
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({
            error: 'Something went wrong',
            details: (error as Error).message,
        }, { status: 500 });
    }
}
