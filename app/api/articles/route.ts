/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";

import Article from "@/models/article.model";
import connectMongodb from "@/libs/connect_mongodb";

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
}
