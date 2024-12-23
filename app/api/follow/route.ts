import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import httpStatus from "http-status";

import User from "@/models/users.model";
import connectMongodb from "@/libs/connect_mongodb";
import { decrypt } from "@/utils/text_encryptor";

interface IUser {
    _id: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId[];
}

// who to follow
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('user');

    if (!id) {
        return NextResponse.json({
            message: 'required parameter missing'
        }, { status: httpStatus.BAD_REQUEST })
    }

    try {
        await connectMongodb();
        const currentUser = await User.findById(id).select('following').lean() as IUser;

        if (!currentUser || !currentUser.following.length) {
            const whoToFollow = await User.find({
                _id: { $ne: id }
            }).select('_id name email isPremiumMember isEmailVerified username profileImg').sort({ createdAt: -1 }).limit(3)

            return NextResponse.json(whoToFollow, { status: 200 });
        };

        const userToFollow = await User.find({
            _id: {
                $nin: [...currentUser.following, id]
            }
        }).select('_id name email isPremiumMember username isEmailVerified profileImg').sort({ createdAt: -1 }).limit(3)

        return NextResponse.json(userToFollow, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: httpStatus.INTERNAL_SERVER_ERROR })
    }
};

// follow
export async function PATCH(request: Request) {
    const data = await request.json();
    const follower = decrypt(data?.follower);
    const following = decrypt(data?.following);

    let session: mongoose.ClientSession | null = null;

    try {
        await connectMongodb();

        if (!follower || !following) {
            return NextResponse.json({
                message: 'Required parameters missing'
            }, { status: 400 });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const updatedFollower = await User.findByIdAndUpdate(
            follower,
            { $addToSet: { "following": following } },
            { new: true, session } // Pass session to ensure atomicity
        );

        const updatedFollowing = await User.findByIdAndUpdate(
            following,
            { $addToSet: { 'followers': follower } },
            { new: true, session } // Pass session to ensure atomicity
        );

        if (!updatedFollower || !updatedFollowing) {
            await session.abortTransaction();
            return NextResponse.json({
                message: 'Failed to update follower or following'
            }, { status: 404 });
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            message: 'Successfully created follower and following relationships'
        }, { status: 200 });

    } catch (error) {
        // If an error occurs, rollback by aborting the transaction
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return NextResponse.json({
            message: 'Internal Server Error'
        }, { status: 500 });
    }
};

// unfollow
export async function PUT(request: Request) {
    const data = await request.json();
    const follower = decrypt(data?.follower);
    const following = decrypt(data?.following);

    let session: mongoose.ClientSession | null = null;

    try {
        await connectMongodb();

        if (!follower || !following) {
            return NextResponse.json({
                message: 'Required parameters missing'
            }, { status: 400 });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const updatedFollower = await User.findByIdAndUpdate(
            follower,
            { $pull: { "following": following } },
            { new: true, session }
        );

        const updatedFollowing = await User.findByIdAndUpdate(
            following,
            { $pull: { 'followers': follower } },
            { new: true, session }
        );

        if (!updatedFollower || !updatedFollowing) {
            await session.abortTransaction();
            return NextResponse.json({
                message: 'Failed to unfollow or remove follower'
            }, { status: 404 });
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            message: 'Successfully unfollowed the user'
        }, { status: 200 });

    } catch (error) {
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
