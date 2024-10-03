/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { NextResponse } from "next/server";

import Article from "@/models/article.model";
import connectMongodb from "@/libs/connect_mongodb";

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('ref');

    try {
        await connectMongodb();
        const payload = await request.json();  // {user: ObjectId, content: string}
        const article = await Article.findById(articleId).select('comments');

        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        };

        article.comments.push(payload);
        await article.save();

        return NextResponse.json({
            success: true,
            message: 'Comment Added Successfully',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating claps on the article',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}