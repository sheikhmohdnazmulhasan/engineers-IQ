import { NextResponse } from "next/server";

import { decrypt } from '@/utils/text_encryptor';
import User from "@/models/users.model";
import connectMongodb from "@/libs/connect_mongodb";

export async function PATCH(request: Request) {

    try {
        await connectMongodb();
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({
                message: 'something wrong'
            }, { status: 400 });
        }

        const decryptedData = decrypt(token);
        if (!decryptedData) {
            return NextResponse.json({
                message: 'something wrong'
            }, { status: 400 });
        }

        console.log(decryptedData);

        const spited = decryptedData.split('+++');
        const currentTime = new Date();
        const expiry = new Date(spited[1]);

        if (currentTime > expiry) {
            return NextResponse.json({
                message: 'something wrong'
            }, { status: 400 });
        }

        const updateUser = await User.findOneAndUpdate({ email: spited[0] }, { isEmailVerified: true });

        if (updateUser) {
            return NextResponse.json({
                message: 'operation successful'
            }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            message: 'something wrong'
        }, { status: 500 });
    }
}
