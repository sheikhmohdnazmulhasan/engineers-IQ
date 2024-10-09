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

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);  // Default to page 1
    const limit = parseInt(searchParams.get('limit') || '10', 10);  // Default to 10 articles per page
    const skip = (page - 1) * limit;

    // Define the query
    const query: FilterQuery<TArticle> = {};

    try {
        await connectMongodb();

        // Caching logic (unchanged)
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

        // Fetch article by _id
        if (_id) {
            const article = await Article.findById(new Types.ObjectId(_id))
                .populate('author claps comments.user comments.claps')
                .sort({ createdAt: -1 });

            article.views++
            article.save();

            if (!article) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: 'Article successfully retrieved',
                data: article,
            }, { status: 200 });
        }

        // Apply searchTerm and other filters
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { textArea: { $regex: searchTerm, $options: 'i' } },
                { topics: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (category) query.category = category;
        if (author && Types.ObjectId.isValid(author)) query.author = new Types.ObjectId(author);
        if (isPremiumContent) query.isPremiumContent = isPremiumContent === 'true';
        if (topic) query.topics = { $in: [topic] };

        // Fetch articles with pagination
        const data = await Article.find(query)
            .populate('author claps comments.user comments.claps')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total documents for pagination metadata
        const totalArticles = await Article.countDocuments(query);

        return NextResponse.json({
            success: true,
            message: 'Articles successfully retrieved',
            data: data,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalArticles / limit),
                totalItems: totalArticles,
                itemsPerPage: limit,
            },
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({
            error: 'Something went wrong',
            details: (error as Error).message,
        }, { status: 500 });
    }
};

// updating
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('_id');
    const data = await request.json();

    try {
        await connectMongodb();
        const result = await Article.findByIdAndUpdate(postId, data, { new: true });

        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Article updated',
                data: result
            }, { status: httpStatus.OK });
        }

        return NextResponse.json({
            success: false,
            message: 'Failed to update the article'
        }, { status: httpStatus.BAD_REQUEST });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating the article',
            error: error.message
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        await connectMongodb();
        const result = await Article.findByIdAndDelete(id);

        if (result) {
            return NextResponse.json({
                success: true,
                message: 'articled deleted',
            }, { status: httpStatus.OK });
        }

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Something went wrong',
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}


