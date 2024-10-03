/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose for ObjectId conversion

import connectMongodb from "@/libs/connect_mongodb";
import Article from "@/models/article.model";

// clap
export async function PATCH(request: Request) {
    try {
        await connectMongodb();
        const { articleId, user } = await request.json();

        if (!articleId || !user) {
            return NextResponse.json({
                message: 'Required parameters missing',
            }, { status: 400 });
        }

        // Convert user to ObjectId for comparison
        const userObjectId = new mongoose.Types.ObjectId(user);

        const article = await Article.findById(articleId).select('claps');

        if (!article) {
            return NextResponse.json({
                message: 'Invalid article ID',
            }, { status: 400 });
        }

        // Check if the user has already clapped (comparing ObjectIds)
        const hasClapped = article.claps.some(
            (clapUser: mongoose.Types.ObjectId) => clapUser.equals(userObjectId)
        );

        if (hasClapped) {
            // Remove the clap (undo)
            article.claps = article.claps.filter(
                (clapUser: mongoose.Types.ObjectId) => !clapUser.equals(userObjectId)
            );
            // console.log(`Clap removed for user: ${user}`);
        } else {
            // Add the clap
            article.claps.push(userObjectId);
            // console.log(`Clap added for user: ${user}`);
        }

        // Save the updated article document
        await article.save();

        return NextResponse.json({
            success: true,
            message: hasClapped ? 'Clap removed' : 'Clapped!',
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while updating claps on the article',
            error: error.message,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}
