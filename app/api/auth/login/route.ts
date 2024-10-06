import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        await connectMongodb();
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Account does not exist.'
            }, { status: 400 });
        };

        if (user.isBlocked) {
            return NextResponse.json({
                success: false,
                message: 'Account Blocked'
            }, { status: 400 });
        };

        const checkValidPassword = await bcrypt.compare(password, user.password);

        if (!checkValidPassword) {
            return NextResponse.json({
                success: false,
                message: 'Wrong Password'
            }, { status: 500 });
        };

        user.lastLogin = new Date();
        user.save();

        return NextResponse.json({
            success: true,
            message: 'Account Logged in Success',
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Something went wrong'
        }, { status: 500 });
    }
}