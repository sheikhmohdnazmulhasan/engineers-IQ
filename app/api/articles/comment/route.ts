/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Article from "@/models/article.model";
import connectMongodb from "@/libs/connect_mongodb";
import { decrypt } from "@/utils/text_encryptor";

// add comment
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('ref');

    try {
        await connectMongodb();
        const payload = await request.json();  // {user: ObjectId, content: string}

        // Validate that the payload has the required fields
        if (!payload.user || !payload.content) {
            return NextResponse.json({
                success: false,
                message: 'Invalid payload: user and content are required.',
            }, { status: 400 });
        }

        // Convert user to ObjectId if it is not already
        const userObjectId = new mongoose.Types.ObjectId(decrypt(payload.user));

        const article = await Article.findById(articleId).select('comments');

        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        }

        // Add the new comment to the article's comments array
        article.comments.push({
            user: userObjectId,
            content: decrypt(payload.content),
            createdAt: new Date(),
        });

        // Save the updated article document
        await article.save();

        return NextResponse.json({
            success: true,
            message: 'Comment added successfully',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while adding the comment to the article',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

// edit comment
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('ref');

    try {
        await connectMongodb();
        const { commentId, updatedContent, user } = await request.json();

        // Validate that commentId, updatedContent, and user are provided
        if (!commentId || !updatedContent || !user) {
            return NextResponse.json({
                message: 'commentId, updatedContent, and user are required',
            }, { status: 400 });
        }

        // Convert commentId to ObjectId
        const commentObjectId = new mongoose.Types.ObjectId(commentId);

        // Find the article by its ID
        const article = await Article.findById(articleId).select('comments');

        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        }

        // Find the targeted comment by its _id
        const comment = article.comments.id(commentObjectId);

        if (!comment) {
            return NextResponse.json({
                message: 'Comment not found',
            }, { status: 404 });
        }

        // Validate that the comment belongs to the user
        if (String(comment.user) !== String(user)) {
            return NextResponse.json({
                message: 'You are not authorized to edit this comment',
            }, { status: 403 });
        }

        // Update the content of the targeted comment
        comment.content = updatedContent;
        comment.updatedAt = new Date(); // track when the comment was updated

        // Save the updated article
        await article.save();

        return NextResponse.json({
            success: true,
            message: 'Comment updated successfully',
            updatedComment: comment,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating the comment',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('ref');

    try {
        await connectMongodb();
        const { commentId, user } = await request.json();

        // Validate required fields
        if (!commentId || !user) {
            return NextResponse.json({
                message: 'commentId and user are required',
            }, { status: 400 });
        }

        const commentObjectId = new mongoose.Types.ObjectId(commentId);

        // Find the article by its ID
        const article = await Article.findById(articleId).select('comments');

        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        }

        // Find the targeted comment
        const comment = article.comments.id(commentObjectId);

        if (!comment) {
            return NextResponse.json({
                message: 'Comment not found',
            }, { status: 404 });
        }

        // Validate comment ownership
        if (String(comment.user) !== String(user)) {
            return NextResponse.json({
                message: 'You are not authorized to delete this comment',
            }, { status: 403 });
        }

        // Remove the comment using `pull()`
        article.comments.pull(commentObjectId);
        await article.save();

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while deleting the comment',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
};