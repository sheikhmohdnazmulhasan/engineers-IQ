import httpStatus from "http-status";
import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";
import { decrypt } from "@/utils/text_encryptor";

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user');

    try {
        const { auth, oldPassword, newPassword } = await request.json();
        await connectMongodb();


        const user = await User.findById(userId).select('+password');
        const verifyToken = decrypt(auth);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        };

        if (verifyToken !== user.email) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized request'
            }, { status: httpStatus.UNAUTHORIZED });
        }

        const isMatch = await user.verifyPassword(oldPassword);

        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: 'Current password is incorrect'
            }, { status: 200 });
        };

        user.password = newPassword;
        user.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        }, { status: 200 });


    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            error: error,
        }, { status: httpStatus.INTERNAL_SERVER_ERROR });

    };
};