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
            const result = await User.findOne({ username });

            return NextResponse.json({
                success: true,
                data: result
            }, { status: 200 })
        };

        if (email) {
            const result = await User.findOne({ email });

            return NextResponse.json({
                success: true,
                data: result
            }, { status: 200 })
        };

    } catch (error) {
        return NextResponse.json({
            success: false,
            data: null
        }, { status: 500 })
    }
}
