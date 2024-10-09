import { NextResponse } from "next/server";

import User from "@/models/users.model";
import connectMongodb from "@/libs/connect_mongodb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    try {
        await connectMongodb();

        if (username) {
            const result = await User.findOne({ username }).populate({
                path: 'following',
                select: '_id username isEmailVerified name email isPremiumMember profileImg'
            }).populate({
                path: 'followers',
                select: '_id username isEmailVerified name email isPremiumMember profileImg'
            })

            if (!result) {
                return NextResponse.json({
                    success: false,
                    message: 'invalid username'
                }, { status: 500 })
            }

            return NextResponse.json({
                success: true,
                data: result
            }, { status: 200 })
        };

        if (email) {
            const result = await User.findOne({ email }).populate({
                path: 'following',
                select: '_id username name isEmailVerified email isPremiumMember profileImg'
            }).populate({
                path: 'followers',
                select: '_id username name isEmailVerified email isPremiumMember profileImg'
            });

            if (!result) {
                return NextResponse.json({
                    success: false,
                    message: 'Something wrong'
                }, { status: 400 })
            }

            return NextResponse.json({
                success: true,
                data: result
            }, { status: 200 })
        };

        const result = await User.find().populate({
            path: 'following',
            select: '_id username name email isEmailVerified isPremiumMember profileImg'
        }).populate({
            path: 'followers',
            select: '_id username name email isEmailVerified isPremiumMember profileImg'
        })

        return NextResponse.json({
            success: true,
            data: result
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        }, { status: 500 })
    }
};

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const { name, profileImg, pay } = await request.json();

    if (name || profileImg || pay) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatedData: any = {};
            if (name) updatedData.name = name;
            if (profileImg) updatedData.profileImg = profileImg;
            if (pay) updatedData.isPremiumMember = true;

            const result = await User.findByIdAndUpdate(user, updatedData, { new: true });

            if (!result) {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to update user'
                }, { status: 400 });
            }

            return NextResponse.json({
                success: true,
                message: 'User Updated Successfully'
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({
                success: false,
                message: 'Something went wrong'
            }, { status: 500 });
        }

    } else {
        return NextResponse.json({
            success: false,
            message: 'Bad request: No valid fields to update'
        }, { status: 400 });
    }
}
