/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { FilterQuery, Types } from "mongoose";

import Article from "@/models/article.model";
import connectMongodb from "@/libs/connect_mongodb";
import { TArticle } from "@/types/article.type";

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

    // If _id is provided, fetch the article by its _id directly
    if (_id && Types.ObjectId.isValid(_id)) {
        try {
            const article = await Article.findById(new Types.ObjectId(_id))
                .populate({
                    path: 'author',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg'
                })
                .populate({
                    path: 'claps',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg'
                })
                .populate({
                    path: 'comments.user',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                })
                .populate({
                    path: 'comments.claps',
                    select: '_id name email isPremiumMember isEmailVerified username profileImg',
                }).sort({ createdAt: -1 })

            if (!article) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }
            return NextResponse.json({
                success: true,
                message: 'Articles successfully retrieved',
                data: article
            }, { status: 200 });

        } catch (error: unknown) {
            return NextResponse.json({ error: 'Something went wrong', details: (error as Error).message }, { status: 500 });
        }
    }

    // Partial search for title, description, category, and topics
    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
            { topics: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    // Filter by category if provided
    if (category) {
        query.category = category;
    }

    // Filter by author if provided (author is assumed to be an ObjectId)
    if (author && Types.ObjectId.isValid(author)) {
        query.author = new Types.ObjectId(author);
    }

    // Filter by premium content if provided
    if (isPremiumContent) {
        query.isPremiumContent = isPremiumContent === 'true';
    }

    // Filter by topic if provided (assumes topics is an array)
    if (topic) {
        query.topics = { $in: [topic] };
    }

    try {
        const data = await Article.find(query)
            .populate({
                path: 'author',
                select: '_id name email isPremiumMember isEmailVerified username profileImg'
            })
            .populate({
                path: 'claps',
                select: '_id name email isPremiumMember isEmailVerified username profileImg'
            })
            .populate({
                path: 'comments.user',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            })
            .populate({
                path: 'comments.claps',
                select: '_id name email isPremiumMember isEmailVerified username profileImg',
            }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: 'Articles successfully retrieved',
            data: data
        }, { status: 200 })

    } catch (error: unknown) {
        return NextResponse.json({ error: 'Something went wrong', details: (error as Error).message }, { status: 500 });
    }
}
