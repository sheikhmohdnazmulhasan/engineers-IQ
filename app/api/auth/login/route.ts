import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";

export async function POST(request: Request) {
    const { email, password } = await request.json()

    try {
        await connectMongodb();
        const isEmailExist = await User.findOne({ email }).select('+password');

        if (!isEmailExist) {
            return NextResponse.json({
                success: false,
                message: 'Account does not exist.'
            }, { status: 400 });
        };

        if (isEmailExist.isBlocked) {
            return NextResponse.json({
                success: false,
                message: 'Account Blocked'
            }, { status: 400 });
        };

        const checkValidPassword = await bcrypt.compare(password, isEmailExist.password);

        if (!checkValidPassword) {
            return NextResponse.json({
                success: false,
                message: 'Wrong Password'
            }, { status: 500 });
        };

        const accessToken = jwt.sign({
            email: isEmailExist.email,
            username: isEmailExist.username,
            role: isEmailExist.role
        }, process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET as string, {
            expiresIn: '1d'
        });

        const refreshToken = jwt.sign({
            email: isEmailExist.email,
            username: isEmailExist.username,
            role: isEmailExist.role
        }, process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET as string, {
            expiresIn: '30d'
        });

        return NextResponse.json({
            success: true,
            message: 'Account Logged in Success',
            accessToken,
            refreshToken,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Something went wrong'
        }, { status: 500 });
    }
}