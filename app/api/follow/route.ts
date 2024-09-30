import { NextResponse } from "next/server";
import mongoose from 'mongoose';

import User from "@/models/users.model";
import connectMongodb from "@/libs/connect_mongodb";

export async function PATCH(request: Request) {
    const { follower, following } = await request.json();

    let session: mongoose.ClientSession | null = null;

    try {
        await connectMongodb();

        if (!follower || !following) {
            return NextResponse.json({
                message: 'Required parameters missing'
            }, { status: 400 });
        }

        // Start a new session
        session = await mongoose.startSession();
        session.startTransaction();

        // Add following to the follower's 'following' array
        const updatedFollower = await User.findByIdAndUpdate(
            follower,
            { $addToSet: { "following": following } },
            { new: true, session } // Pass session to ensure atomicity
        );

        // Add follower to the following's 'followers' array
        const updatedFollowing = await User.findByIdAndUpdate(
            following,
            { $addToSet: { 'followers': follower } },
            { new: true, session } // Pass session to ensure atomicity
        );

        // Check if both updates were successful
        if (!updatedFollower || !updatedFollowing) {
            // If either fails, abort the transaction
            await session.abortTransaction();
            return NextResponse.json({
                message: 'Failed to update follower or following'
            }, { status: 404 });
        }

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            message: 'Successfully updated follower and following relationships'
        }, { status: 200 });

    } catch (error) {
        console.error("Error in transaction:", error);

        // If an error occurs, rollback by aborting the transaction
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
