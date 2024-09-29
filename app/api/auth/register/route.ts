import { NextResponse } from "next/server";

import connectMongodb from "@/libs/connect_mongodb";
import User from "@/models/users.model";
import { IUser } from "@/interface/users.interface";

export async function POST(request: Request) {
    try {
        await connectMongodb();
        const data: IUser = await request.json();
        const emailExist = await User.findOne({ email: data.email });
        const usernameExist = await User.findOne({ username: data.username });

        if (emailExist) {
            return NextResponse.json({ message: 'Email Already Exist' }, { status: 500 })
        } else if (usernameExist) {
            return NextResponse.json({ message: 'Username Already Taken' }, { status: 500 });
        };

        // const encryptedPassword = await bcrypt.hash(data.password, Number(process.env.BCRYPT_SALT_ROUNDS))
        const result = await User.create(data);

        if (result) {
            return NextResponse.json({ message: 'User Created Successfully' }, { status: 200 })
        }

    } catch (error) {
        return NextResponse.json({ message: 'failed to create user' }, { status: 500 })
    }
}