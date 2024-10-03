/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectMongodb from "@/libs/connect_mongodb";
import Article from "@/models/article.model";

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('ref');

    try {
        await connectMongodb();
        const { commentId, userId } = await request.json();

        // Validate required fields
        if (!commentId || !userId) {
            return NextResponse.json({
                message: 'commentId and userId are required',
            }, { status: 400 });
        }

        const commentObjectId = new mongoose.Types.ObjectId(commentId);

        // Find the article by its ID and target comment
        const article = await Article.findById(articleId).select('comments');
        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        }

        // Find the targeted comment
        const comment = article.comments.find((comment: mongoose.Types.ObjectId) => comment._id.equals(commentObjectId));

        if (!comment) {
            return NextResponse.json({
                message: 'Comment not found',
            }, { status: 404 });
        }

        // Initialize claps array if it doesn't exist
        if (!Array.isArray(comment.claps)) {
            comment.claps = [];
        }

        // Check if the user has already clapped (undoing clap)
        const hasClapped = comment.claps.some((clap: mongoose.Types.ObjectId) => String(clap) === String(userId));

        if (hasClapped) {
            // Remove user's clap (undo clap)
            comment.claps = comment.claps.filter((clap: mongoose.Types.ObjectId) => String(clap) !== String(userId));
        } else {
            // Add user's clap
            comment.claps.push(new mongoose.Types.ObjectId(userId));
        }

        await article.save();

        return NextResponse.json({
            success: true,
            message: hasClapped ? 'Clap removed' : 'Clapped!',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating the clap',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};
