import { NextResponse } from 'next/server';
import httpStatus from 'http-status';

import User from '@/models/users.model';
import connectMongodb from '@/libs/connect_mongodb';
import { decrypt } from '@/utils/text_encryptor';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        await connectMongodb();

        // Check if query is an email (simple email validation)
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

        // Find user by email or username
        const user = await User.findOne(isEmail ? { email: query } : { username: query }).select('email name username').lean();

        if (!user) {

            return NextResponse.json({ error: 'No users were found based on your query' }, { status: 404 });
        }

        return NextResponse.json({ data: user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
};

export async function PATCH(request: Request) {

    try {
        await connectMongodb();
        const { token, password } = await request.json();

        const decryptedBob = decrypt(token as unknown as string);
        const decryptedData = decryptedBob.split('+++');
        const currentTime = new Date();
        const expiry = new Date(decryptedData[1]);

        if (!decryptedBob) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Token'
            }, { status: httpStatus.BAD_REQUEST })
        }

        if (currentTime > expiry) {
            return NextResponse.json({
                success: false,
                message: 'Token Expired'
            }, { status: httpStatus.REQUEST_TIMEOUT })
        };

        const user = await User.findOne({ email: decryptedData[0] }).select('+password')

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User Not Found'
            }, { status: httpStatus.NOT_FOUND })
        };

        user.password = password;
        user.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        }, { status: httpStatus.OK })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: httpStatus.INTERNAL_SERVER_ERROR })
    }
}
